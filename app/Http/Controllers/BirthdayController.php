<?php

namespace App\Http\Controllers;

use App\Models\Birthday;
use App\Models\Package;
use App\Models\Location;
use App\Models\Activity; // Added Activity model
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
        // Policy can be applied here if needed, e.g., $this->authorize("viewAny", Birthday::class);
        // Current logic: only show birthdays for the authenticated user unless they are admin.
        // If an admin should see all, the viewAny policy should handle that.
        if (Auth::user()->hasRole("admin")) {
            $birthdays = Birthday::with(["location", "package", "activities"])->latest()->paginate(10);
        } else {
            $birthdays = Birthday::where("user_id", Auth::id())->with(["location", "package", "activities"])->latest()->paginate(10);
        }
        return response()->json($birthdays);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize("create", Birthday::class);

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
                Rule::unique("trips", "reservation_date")->where(function ($query) use ($request) { // Check against trips table
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
        $package = Package::find($validatedData["package_id"]);

        if ($package && isset($validatedData["activity_ids"])) {
            if (count($validatedData["activity_ids"]) > $package->number_of_activities) {
                 return response()->json(["activity_ids" => ["Number of selected activities exceeds the limit for this package."]], 422);
            }
        }

        $validatedData["user_id"] = Auth::id();
        $startTime = Carbon::parse($validatedData["start_time"]);
        $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 3)->format("H:i:s"); 

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
        $this->authorize("view", $birthday);
        return response()->json($birthday->load(["location", "package", "activities", "attendees", "payments"]));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Birthday $birthday)
    {
        $this->authorize("update", $birthday);

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
                Rule::unique("trips", "reservation_date")->where(function ($query) use ($request, $birthday) { // Check against trips table
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
        $package = Package::find($validatedData["package_id"] ?? $birthday->package_id);

        if ($package && isset($validatedData["activity_ids"])) {
            if (count($validatedData["activity_ids"]) > $package->number_of_activities) {
                 return response()->json(["activity_ids" => ["Number of selected activities exceeds the limit for this package."]], 422);
            }
        }

        if (isset($validatedData["package_id"])) {
            if (isset($validatedData["start_time"])) {
                 $startTime = Carbon::parse($validatedData["start_time"]);
                 $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 3)->format("H:i:s");
            } else {
                 $startTime = Carbon::parse($birthday->start_time);
                 $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 3)->format("H:i:s");
            }
        } elseif (isset($validatedData["start_time"])) {
            $package = $birthday->package; 
            $startTime = Carbon::parse($validatedData["start_time"]);
            $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 3)->format("H:i:s");
        }
        
        $birthday->update($validatedData);

        if ($request->has("activity_ids")) {
            $birthday->activities()->sync($request->input("activity_ids"));
        }

        if ($request->input("payment_status") === "paid" && $request->input("status") === "confirmed" && $request->has("payment_data")) {
            $payment_info = $request->input("payment_data");
            $birthday->payments()->updateOrCreate(
                ["payable_id" => $birthday->id, "payable_type" => Birthday::class],
                [
                    "amount" => $birthday->package->price, 
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
        $this->authorize("delete", $birthday);

        $birthday->activities()->detach();
        $birthday->payments()->delete(); 
        $birthday->attendees()->delete(); 
        $birthday->delete();

        return response()->json(null, 204);
    }
}

