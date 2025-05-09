<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Birthday;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Typically, users should only see their own payments, or payments related to their bookings.
        // This might be filtered by payable_type and payable_id if provided in request
        // For now, let's assume an admin context or a user fetching their specific payments.
        $query = Payment::query();
        if ($request->has("payable_type") && $request->has("payable_id")) {
            $payableType = $request->input("payable_type");
            // Basic validation for payable_type
            if (!in_array($payableType, [Reservation::class, Birthday::class])) {
                return response()->json(["message" => "Invalid payable type."], 400);
            }
            $query->where("payable_type", $payableType)->where("payable_id", $request->input("payable_id"));
        }
        // Ensure user can only access their own payments or if they are admin
        // This requires checking ownership of the parent reservable item.
        // This part needs more robust authorization based on your app's logic.

        $payments = $query->whereHasMorph(
            "payable",
            [Reservation::class, Birthday::class],
            function ($query, $type) {
                $query->where("user_id", Auth::id());
            }
        )->latest()->paginate(15);

        return response()->json($payments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "payable_id" => "required|integer",
            "payable_type" => ["required", "string", Rule::in([Reservation::class, Birthday::class])],
            "amount" => "required|numeric|min:0",
            "payment_method" => "required|string|max:255",
            "status" => "required|in:pending,completed,failed,refunded",
            "transaction_id" => "nullable|string|max:255",
            "payment_date" => "nullable|date",
            "notes" => "nullable|string",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();
        $payable = $validatedData["payable_type"]::find($validatedData["payable_id"]);

        if (!$payable || $payable->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Associated event not found or unauthorized."], 403);
        }
        
        $validatedData["user_id"] = Auth::id(); // Associate payment with the user who owns the event
        $payment = Payment::create($validatedData);

        // Update parent model payment_status if this is the primary payment
        if ($payment->status === "completed") {
            $payable->update(["payment_status" => "paid"]);
        } elseif ($payment->status === "pending") {
             $payable->update(["payment_status" => "pending_payment"]); // Or a similar status
        }

        return response()->json($payment, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        $payable = $payment->payable;
        if (!$payable || $payable->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        return response()->json($payment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        $payable = $payment->payable;
        if (!$payable || $payable->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $validator = Validator::make($request->all(), [
            "amount" => "sometimes|required|numeric|min:0",
            "payment_method" => "sometimes|required|string|max:255",
            "status" => "sometimes|required|in:pending,completed,failed,refunded",
            "transaction_id" => "nullable|string|max:255",
            "payment_date" => "nullable|date",
            "notes" => "nullable|string",
            "payment_slip_path" => "nullable|string", // Path to uploaded slip
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payment->update($validator->validated());

        // Update parent model payment_status
        if ($payment->status === "completed") {
            $payable->update(["payment_status" => "paid"]);
        } elseif ($payment->status === "pending" && $payable->payment_status !== "paid") {
             $payable->update(["payment_status" => "pending_payment"]);
        } else if ($payment->status === "failed" && $payable->payment_status !== "paid"){
            $payable->update(["payment_status" => "unpaid"]);
        }

        return response()->json($payment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        $payable = $payment->payable;
        if (!$payable || $payable->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        // Optionally delete the payment slip file from storage
        if ($payment->payment_slip_path) {
            Storage::disk("public")->delete($payment->payment_slip_path);
        }

        $payment->delete();
        
        // Check if there are other completed payments for this payable, if not, update status
        $otherPayments = Payment::where("payable_id", $payable->id)
                                ->where("payable_type", get_class($payable))
                                ->where("status", "completed")
                                ->count();
        if ($otherPayments === 0 && $payable->payment_status === "paid") {
            $payable->update(["payment_status" => "unpaid"]); // Or pending_payment if applicable
        }

        return response()->json(null, 204);
    }

    /**
     * Handle uploading of payment slip.
     */
    public function uploadSlip(Request $request, Payment $payment)
    {
        $payable = $payment->payable;
        if (!$payable || $payable->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized to upload slip for this payment."], 403);
        }

        $validator = Validator::make($request->all(), [
            "payment_slip" => "required|image|mimes:jpg,jpeg,png,pdf|max:2048", // Max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->hasFile("payment_slip")) {
            // Delete old slip if exists
            if ($payment->payment_slip_path) {
                Storage::disk("public")->delete($payment->payment_slip_path);
            }

            $file = $request->file("payment_slip");
            $filename = time() . "_" . $file->getClientOriginalName();
            $path = $file->storeAs("payment_slips/" . $payable->getTable() . "/" . $payable->id, $filename, "public");
            
            $payment->update([
                "payment_slip_path" => $path,
                // Optionally update payment status here, e.g., to pending_verification
            ]);

            return response()->json(["message" => "Payment slip uploaded successfully.", "path" => $path, "payment" => $payment]);
        }

        return response()->json(["message" => "No payment slip file found."], 400);
    }
}

