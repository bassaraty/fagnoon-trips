<?php

namespace App\Http\Controllers;

use App\Models\Trip; // Assuming Trip model exists and is similar to Reservation
use App\Models\Package;
use App\Models\Location;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Carbon\Carbon;

class TripController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Logic to display a list of trips, perhaps for the authenticated user or admin
        // For now, using Inertia render as a placeholder, actual data fetching might differ
        // $trips = Trip::with(["location", "package", "activities"])->latest()->paginate(10);
        // return Inertia::render("Trips/Index", ["trips" => $trips]);
        return Inertia::render("Trips/Index", [
            "trips" => Trip::all(), // Placeholder
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Pass necessary data for form, e.g., locations, packages
        // return Inertia::render("Trips/Create", [
        //     "locations" => Location::where("is_bookable", true)->get(),
        //     "packages" => Package::where("is_active", true)->where("type", "trip")->get(), // Assuming package type for trips
        //     "activities" => Activity::where("is_active", true)->get(),
        // ]);
        return Inertia::render("Trips/Create"); // Placeholder
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "location_id" => "required|exists:locations,id",
            "package_id" => "required|exists:packages,id",
            "school_name" => "required|string|max:255",
            "school_grade" => "required|string|max:255",
            "number_of_students" => "required|integer|min:1",
            "number_of_supervisors" => "required|integer|min:0",
            "reservation_date" => [
                "required",
                "date",
                "after_or_equal:today",
                Rule::unique("trips", "reservation_date")->where(function ($query) use ($request) {
                    return $query->where("location_id", $request->location_id);
                }),
                Rule::unique("birthdays", "event_date")->where(function ($query) use ($request) { // Check against birthdays table
                    return $query->where("location_id", $request->location_id);
                }),
            ],
            "start_time" => "required|date_format:H:i",
            "notes" => "nullable|string",
            "activity_ids" => "nullable|array",
            "activity_ids.*" => "exists:activities,id",
            // Conditional validation example: if a certain package requires specific fields
            // "conditional_field" => [Rule::requiredIf($request->package_id == X), "nullable", "string"],
        ]);

        if ($validator->fails()) {
            // For Inertia, it's common to redirect back with errors
            // return redirect()->back()->withErrors($validator)->withInput();
            // If this is an API-like controller (as BirthdayController seems to be), return JSON
             return response()->json($validator->errors(), 422); // Or handle appropriately for Inertia
        }

        $validatedData = $validator->validated();
        $package = Package::find($validatedData["package_id"]);

        // Package/Activity Limits Validation
        if ($package && isset($validatedData["activity_ids"])) {
            if (count($validatedData["activity_ids"]) > $package->number_of_activities) {
                // return redirect()->back()->withErrors(["activity_ids" => "Number of selected activities exceeds the limit for this package."])->withInput();
                 return response()->json(["activity_ids" => ["Number of selected activities exceeds the limit for this package."]], 422);
            }
        }
        
        $validatedData["user_id"] = Auth::id();
        // Assuming Trip model uses reservation_date, start_time, end_time like Reservation model
        // Calculate end_time based on package duration (if applicable, similar to BirthdayController)
        // $startTime = Carbon::parse($validatedData["start_time"]);
        // $validatedData["end_time"] = $startTime->copy()->addHours($package->duration_hours ?? 3)->format("H:i:s"); // Assuming duration_hours on package

        $trip = Trip::create($validatedData);

        if ($request->has("activity_ids")) {
            $trip->activities()->sync($request->input("activity_ids"));
        }

        // return redirect()->route("trips.index")->with("success", "Trip booked successfully.");
        // If API-like:
        return response()->json($trip->load(["location", "package", "activities"]), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Trip $trip)
    {
        // Add authorization if necessary, e.g., user can only see their own trips or admin can see all
        // if ($trip->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
        //     abort(403);
        // }
        return Inertia::render("Trips/Show", [
            "trip" => $trip->load(["location", "package", "activities", "attendees", "payments"]) // Assuming attendees and payments relationships
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Trip $trip)
    {
        // Add authorization
        // if ($trip->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
        //     abort(403);
        // }
        // return Inertia::render("Trips/Edit", [
        //     "trip" => $trip,
        //     "locations" => Location::where("is_bookable", true)->get(),
        //     "packages" => Package::where("is_active", true)->where("type", "trip")->get(),
        //     "activities" => Activity::where("is_active", true)->get(),
        // ]);
         return Inertia::render("Trips/Edit", [
            "trip" => $trip,
        ]); // Placeholder
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Trip $trip)
    {
        // Add authorization
        // if ($trip->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
        //     return response()->json(["message" => "Unauthorized"], 403); // Or abort(403) for Inertia
        // }

        $validator = Validator::make($request->all(), [
            "location_id" => "sometimes|required|exists:locations,id",
            "package_id" => "sometimes|required|exists:packages,id",
            "school_name" => "sometimes|required|string|max:255",
            "school_grade" => "sometimes|required|string|max:255",
            "number_of_students" => "sometimes|required|integer|min:1",
            "number_of_supervisors" => "sometimes|required|integer|min:0",
            "reservation_date" => [
                "sometimes",
                "required",
                "date",
                "after_or_equal:today",
                Rule::unique("trips", "reservation_date")->where(function ($query) use ($request, $trip) {
                    return $query->where("location_id", $request->location_id ?? $trip->location_id)
                                ->where("id", "!=", $trip->id);
                }),
                Rule::unique("birthdays", "event_date")->where(function ($query) use ($request, $trip) { // Check against birthdays table
                    return $query->where("location_id", $request->location_id ?? $trip->location_id);
                     // If birthdays can also be updated, ensure we don't clash with an existing birthday on the same date/location
                }),
            ],
            "start_time" => "sometimes|required|date_format:H:i",
            "notes" => "nullable|string",
            "status" => "sometimes|required|in:pending,confirmed,cancelled,completed", // Example statuses
            "payment_status" => "sometimes|required|in:unpaid,paid,partial", // Example statuses
            "activity_ids" => "nullable|array",
            "activity_ids.*" => "exists:activities,id",
        ]);

        if ($validator->fails()) {
            // return redirect()->back()->withErrors($validator)->withInput();
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();
        $package = Package::find($validatedData["package_id"] ?? $trip->package_id);

        // Package/Activity Limits Validation
        if ($package && isset($validatedData["activity_ids"])) {
            if (count($validatedData["activity_ids"]) > $package->number_of_activities) {
                // return redirect()->back()->withErrors(["activity_ids" => "Number of selected activities exceeds the limit for this package."])->withInput();
                return response()->json(["activity_ids" => ["Number of selected activities exceeds the limit for this package."]], 422);
            }
        }

        // Recalculate end_time if start_time or package changes
        // if (isset($validatedData["start_time"]) || isset($validatedData["package_id"])) {
        //     $currentPackage = $package;
        //     $currentStartTime = Carbon::parse($validatedData["start_time"] ?? $trip->start_time);
        //     $validatedData["end_time"] = $currentStartTime->copy()->addHours($currentPackage->duration_hours ?? 3)->format("H:i:s");
        // }

        $trip->update($validatedData);

        if ($request->has("activity_ids")) {
            $trip->activities()->sync($request->input("activity_ids"));
        }

        // return redirect()->route("trips.index")->with("success", "Trip updated successfully.");
        return response()->json($trip->load(["location", "package", "activities"]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trip $trip)
    {
        // Add authorization
        // if ($trip->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
        //     return response()->json(["message" => "Unauthorized"], 403); // Or abort(403)
        // }

        $trip->activities()->detach();
        // $trip->payments()->delete(); // If payments exist
        // $trip->attendees()->delete(); // If attendees exist
        $trip->delete();

        // return redirect()->route("trips.index")->with("success", "Trip cancelled successfully.");
        return response()->json(null, 204);
    }
}

