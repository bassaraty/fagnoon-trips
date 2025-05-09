<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use App\Models\Reservation;
use App\Models\Birthday;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class AttendeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "eventable_id" => "required|integer",
            "eventable_type" => ["required", "string", Rule::in([Reservation::class, Birthday::class])],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $eventableId = $request->input("eventable_id");
        $eventableType = $request->input("eventable_type");
        $event = $eventableType::find($eventableId);

        if (!$event || $event->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Event not found or unauthorized to view attendees."], 403);
        }

        $attendees = Attendee::where("eventable_id", $eventableId)
                             ->where("eventable_type", $eventableType)
                             ->latest()->paginate(20);
        return response()->json($attendees);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "eventable_id" => "required|integer",
            "eventable_type" => ["required", "string", Rule::in([Reservation::class, Birthday::class])],
            "name" => "required|string|max:255",
            "phone" => "nullable|string|max:20",
            "adult_count" => "required|integer|min:0",
            "kid_count" => "required|integer|min:0",
            // check_in_time will be set separately or upon creation if provided
            "check_in_time" => "nullable|date_format:Y-m-d H:i:s", 
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();
        $event = $validatedData["eventable_type"]::find($validatedData["eventable_id"]);

        if (!$event || $event->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Event not found or unauthorized to add attendees."], 403);
        }
        
        // Ensure at least one adult or kid is specified if counts are used for primary guest info
        if ($validatedData["adult_count"] == 0 && $validatedData["kid_count"] == 0) {
            // This validation might be more complex depending on how attendees are counted
            // For now, assume a named attendee implies at least one person.
            // If adult_count or kid_count are primary, then one must be > 0.
            // For simplicity, we assume a named entry is one person, counts are additional.
        }

        $attendee = $event->attendees()->create($validatedData);
        return response()->json($attendee, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendee $attendee)
    {
        $event = $attendee->eventable;
        if (!$event || $event->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        return response()->json($attendee);
    }

    /**
     * Update the specified resource in storage.
     * This can be used for general updates or specific actions like check-in.
     */
    public function update(Request $request, Attendee $attendee)
    {
        $event = $attendee->eventable;
        if (!$event || $event->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized to update this attendee."], 403);
        }

        $validator = Validator::make($request->all(), [
            "name" => "sometimes|required|string|max:255",
            "phone" => "nullable|string|max:20",
            "adult_count" => "sometimes|required|integer|min:0",
            "kid_count" => "sometimes|required|integer|min:0",
            "check_in_time" => "nullable|date_format:Y-m-d H:i:s",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();

        // If 'perform_check_in' flag is sent and true, and not already checked in
        if ($request->boolean("perform_check_in") && is_null($attendee->check_in_time)) {
            $validatedData["check_in_time"] = Carbon::now();
        }

        $attendee->update($validatedData);
        return response()->json($attendee);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendee $attendee)
    {
        $event = $attendee->eventable;
        if (!$event || $event->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized to delete this attendee."], 403);
        }

        $attendee->delete();
        return response()->json(null, 204);
    }

    /**
     * Mark an attendee as checked-in.
     */
    public function checkIn(Request $request, Attendee $attendee)
    {
        $event = $attendee->eventable;
        // Add more robust authorization: e.g., only staff or event owner can check-in
        if (!$event || ($event->user_id !== Auth::id() /* && !Auth::user()->isStaff() */)) {
            return response()->json(["message" => "Unauthorized to check-in this attendee."], 403);
        }

        if ($attendee->check_in_time) {
            return response()->json(["message" => "Attendee already checked in.", "attendee" => $attendee], 409); // Conflict
        }

        $attendee->update(["check_in_time" => Carbon::now()]);
        return response()->json(["message" => "Attendee checked in successfully.", "attendee" => $attendee]);
    }
}

