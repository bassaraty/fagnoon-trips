<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Package;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Reservation::where("user_id", Auth::id())->with(["location", "package", "activities"])->latest()->paginate(10);
        return response()->json($reservations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "location_id" => "required|exists:locations,id",
            "package_id" => "required|exists:packages,id",
            "reservation_date" => [
                "required",
                "date",
                "after_or_equal:today",
                // Custom rule for one booking per location per day
                Rule::unique("reservations")->where(function ($query) use ($request) {
                    return $query->where("location_id", $request->location_id)
                                ->where("reservation_date", $request->reservation_date);
                }),
            ],
            "start_time" => "required|date_format:H:i",
            "school_name" => "nullable|string|max:255",
            "school_grade" => "nullable|string|max:255",
            "number_of_students" => "nullable|integer|min:1",
            "number_of_supervisors" => "nullable|integer|min:1",
            "notes" => "nullable|string",
            "activity_ids" => "nullable|array",
            "activity_ids.*" => "exists:activities,id",
        ], [
            "reservation_date.unique" => "This location is already booked for the selected date."
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();
        $validatedData["user_id"] = Auth::id();
        
        $package = Package::find($validatedData["package_id"]);
        $startTime = Carbon::parse($validatedData["start_time"]);
        $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 4)->format("H:i:s");

        // Placeholder for package/activity limits - to be implemented
        // e.g., check if package allows selected number of activities or students

        $reservation = Reservation::create($validatedData);

        if ($request->has("activity_ids")) {
            $reservation->activities()->sync($request->input("activity_ids"));
        }

        return response()->json($reservation->load(["location", "package", "activities"]), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        return response()->json($reservation->load(["location", "package", "activities", "attendees", "payments"]));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $validator = Validator::make($request->all(), [
            "location_id" => "sometimes|required|exists:locations,id",
            "package_id" => "sometimes|required|exists:packages,id",
            "reservation_date" => [
                "sometimes",
                "required",
                "date",
                "after_or_equal:today",
                Rule::unique("reservations")->where(function ($query) use ($request, $reservation) {
                    return $query->where("location_id", $request->location_id ?? $reservation->location_id)
                                ->where("reservation_date", $request->reservation_date ?? $reservation->reservation_date)
                                ->where("id", "!=", $reservation->id); // Exclude current reservation
                }),
            ],
            "start_time" => "sometimes|required|date_format:H:i",
            "school_name" => "nullable|string|max:255",
            "school_grade" => "nullable|string|max:255",
            "number_of_students" => "nullable|integer|min:1",
            "number_of_supervisors" => "nullable|integer|min:1",
            "notes" => "nullable|string",
            "status" => "sometimes|required|in:pending,confirmed,cancelled,completed",
            "payment_status" => "sometimes|required|in:unpaid,paid,partial",
            "activity_ids" => "nullable|array",
            "activity_ids.*" => "exists:activities,id",
            // Conditional validation for payment data if status is 'paid'
            "payment_data.transaction_id" => [Rule::requiredIf(fn() => $request->input("payment_status") === "paid" && $request->input("status") === "confirmed"), "nullable", "string"],
            "payment_data.payment_method" => [Rule::requiredIf(fn() => $request->input("payment_status") === "paid" && $request->input("status") === "confirmed"), "nullable", "string"],
        ], [
            "reservation_date.unique" => "This location is already booked for the selected date."
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();
        
        if (isset($validatedData["package_id"])) {
            $package = Package::find($validatedData["package_id"]);
            if (isset($validatedData["start_time"])) {
                 $startTime = Carbon::parse($validatedData["start_time"]);
                 $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 4)->format("H:i:s");
            } else {
                 $startTime = Carbon::parse($reservation->start_time);
                 $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 4)->format("H:i:s");
            }
        } elseif (isset($validatedData["start_time"])) {
            $package = $reservation->package; // Use existing package
            $startTime = Carbon::parse($validatedData["start_time"]);
            $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 4)->format("H:i:s");
        }

        // Placeholder for package/activity limits - to be implemented

        $reservation->update($validatedData);

        if ($request->has("activity_ids")) {
            $reservation->activities()->sync($request->input("activity_ids"));
        }
        
        // Handle payment data if provided and status is confirmed and paid
        if ($request->input("payment_status") === "paid" && $request->input("status") === "confirmed" && $request->has("payment_data")) {
            // This logic will be more robust in the PaymentController or a dedicated service
            // For now, assuming payment_data contains fields for the Payment model
            $payment_info = $request->input("payment_data");
            $reservation->payments()->updateOrCreate(
                ["payable_id" => $reservation->id, "payable_type" => Reservation::class], // Assuming one primary payment record for simplicity
                [
                    "amount" => $reservation->package->price, // Or calculate based on package/activities
                    "payment_method" => $payment_info["payment_method"] ?? null,
                    "transaction_id" => $payment_info["transaction_id"] ?? null,
                    "status" => "completed",
                    "payment_date" => Carbon::now(),
                ]
            );
        }

        return response()->json($reservation->load(["location", "package", "activities"]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $reservation->activities()->detach();
        $reservation->payments()->delete(); // Delete related payments
        $reservation->attendees()->delete(); // Delete related attendees
        $reservation->delete();

        return response()->json(null, 204);
    }
}

