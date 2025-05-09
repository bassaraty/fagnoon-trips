<?php

namespace App\Http\Controllers;

use App\Models\Birthday;
use App\Models\Package;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class BirthdayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $birthdays = Birthday::where("user_id", Auth::id())->with(["location", "package", "activities"])->latest()->paginate(10);
        return response()->json($birthdays);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "location_id" => "required|exists:locations,id",
            "package_id" => "required|exists:packages,id",
            "celebrant_name" => "required|string|max:255",
            "celebrant_age" => "required|integer|min:1",
            "celebrant_birthdate" => "nullable|date",
            "celebrant_gender" => "nullable|in:male,female,other",
            "number_of_guests" => "required|integer|min:1",
            "event_date" => [
                "required",
                "date",
                "after_or_equal:today",
                // Custom rule for one booking per location per day (shared with Reservations)
                // This rule should ideally be in a custom FormRequest or a shared service if it gets complex
                Rule::unique("reservations", "reservation_date")->where(function ($query) use ($request) {
                    return $query->where("location_id", $request->location_id);
                }),
                Rule::unique("birthdays", "event_date")->where(function ($query) use ($request) {
                    return $query->where("location_id", $request->location_id);
                }),
            ],
            "start_time" => "required|date_format:H:i",
            "decorations_notes" => "nullable|string",
            "notes" => "nullable|string",
            "activity_ids" => "nullable|array",
            "activity_ids.*" => "exists:activities,id",
        ], [
            "event_date.unique" => "This location is already booked for the selected date (either as a trip or birthday)."
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();
        $validatedData["user_id"] = Auth::id();
        
        $package = Package::find($validatedData["package_id"]);
        $startTime = Carbon::parse($validatedData["start_time"]);
        $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 3)->format("H:i:s"); 

        // Placeholder for package/activity limits

        $birthday = Birthday::create($validatedData);

        if ($request->has("activity_ids")) {
            $birthday->activities()->sync($request->input("activity_ids"));
        }

        return response()->json($birthday->load(["location", "package", "activities"]), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Birthday $birthday)
    {
        if ($birthday->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        return response()->json($birthday->load(["location", "package", "activities", "attendees", "payments"]));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Birthday $birthday)
    {
        if ($birthday->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $validator = Validator::make($request->all(), [
            "location_id" => "sometimes|required|exists:locations,id",
            "package_id" => "sometimes|required|exists:packages,id",
            "celebrant_name" => "sometimes|required|string|max:255",
            "celebrant_age" => "sometimes|required|integer|min:1",
            "celebrant_birthdate" => "nullable|date",
            "celebrant_gender" => "nullable|in:male,female,other",
            "number_of_guests" => "sometimes|required|integer|min:1",
            "event_date" => [
                "sometimes",
                "required",
                "date",
                "after_or_equal:today",
                Rule::unique("reservations", "reservation_date")->where(function ($query) use ($request, $birthday) {
                    return $query->where("location_id", $request->location_id ?? $birthday->location_id);
                }),
                Rule::unique("birthdays", "event_date")->where(function ($query) use ($request, $birthday) {
                    return $query->where("location_id", $request->location_id ?? $birthday->location_id)
                                ->where("id", "!=", $birthday->id);
                }),
            ],
            "start_time" => "sometimes|required|date_format:H:i",
            "decorations_notes" => "nullable|string",
            "notes" => "nullable|string",
            "status" => "sometimes|required|in:pending,confirmed,cancelled,completed",
            "payment_status" => "sometimes|required|in:unpaid,paid,partial",
            "activity_ids" => "nullable|array",
            "activity_ids.*" => "exists:activities,id",
            "payment_data.transaction_id" => [Rule::requiredIf(fn() => $request->input("payment_status") === "paid" && $request->input("status") === "confirmed"), "nullable", "string"],
            "payment_data.payment_method" => [Rule::requiredIf(fn() => $request->input("payment_status") === "paid" && $request->input("status") === "confirmed"), "nullable", "string"],
        ], [
            "event_date.unique" => "This location is already booked for the selected date (either as a trip or birthday)."
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();

        if (isset($validatedData["package_id"])) {
            $package = Package::find($validatedData["package_id"]);
            if (isset($validatedData["start_time"])) {
                 $startTime = Carbon::parse($validatedData["start_time"]);
                 $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 3)->format("H:i:s");
            } else {
                 $startTime = Carbon::parse($birthday->start_time);
                 $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 3)->format("H:i:s");
            }
        } elseif (isset($validatedData["start_time"])) {
            $package = $birthday->package; // Use existing package
            $startTime = Carbon::parse($validatedData["start_time"]);
            $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 3)->format("H:i:s");
        }
        
        // Placeholder for package/activity limits

        $birthday->update($validatedData);

        if ($request->has("activity_ids")) {
            $birthday->activities()->sync($request->input("activity_ids"));
        }

        // Handle payment data if provided and status is confirmed and paid
        if ($request->input("payment_status") === "paid" && $request->input("status") === "confirmed" && $request->has("payment_data")) {
            $payment_info = $request->input("payment_data");
            $birthday->payments()->updateOrCreate(
                ["payable_id" => $birthday->id, "payable_type" => Birthday::class],
                [
                    "amount" => $birthday->package->price, // Or calculate based on package/activities
                    "payment_method" => $payment_info["payment_method"] ?? null,
                    "transaction_id" => $payment_info["transaction_id"] ?? null,
                    "status" => "completed",
                    "payment_date" => Carbon::now(),
                ]
            );
        }

        return response()->json($birthday->load(["location", "package", "activities"]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Birthday $birthday)
    {
        if ($birthday->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $birthday->activities()->detach();
        $birthday->payments()->delete(); // Delete related payments
        $birthday->attendees()->delete(); // Delete related attendees
        $birthday->delete();

        return response()->json(null, 204);
    }
}

