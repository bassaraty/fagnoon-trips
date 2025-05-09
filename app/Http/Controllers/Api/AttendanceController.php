<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendee;
use App\Models\Reservation;
use App\Models\Birthday;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendees for a specific event.
     * Expects event_type (reservation or birthday) and event_id in the request.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "event_type" => "required|in:trip,birthday",
            "event_id" => "required|integer|min:1",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $eventType = $request->input("event_type");
        $eventId = $request->input("event_id");

        $event = null;
        if ($eventType === "trip") {
            $event = Reservation::find($eventId);
        } elseif ($eventType === "birthday") {
            $event = Birthday::find($eventId);
        }

        if (!$event) {
            return response()->json(["message" => "Event not found."], 404);
        }

        // TODO: Add authorization to ensure user can view attendees for this event
        $attendees = $event->attendees()->latest()->paginate(15);
        return response()->json($attendees);
    }

    /**
     * Store a newly created attendee (check-in an attendee).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "event_type" => "required|in:trip,birthday",
            "event_id" => "required|integer|min:1",
            "name" => "required|string|max:255",
            "phone" => "nullable|string|max:20",
            "adult_count" => "required|integer|min:0",
            "kid_count" => "required|integer|min:0",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $eventType = $request->input("event_type");
        $eventId = $request->input("event_id");

        $event = null;
        if ($eventType === "trip") {
            $event = Reservation::find($eventId);
        } elseif ($eventType === "birthday") {
            $event = Birthday::find($eventId);
        }

        if (!$event) {
            return response()->json(["message" => "Event not found for attendance tracking."], 404);
        }
        
        // TODO: Add authorization to ensure user can add attendees for this event

        $attendeeData = $validator->validated();
        unset($attendeeData["event_type"]); // Not part of Attendee model fillable
        unset($attendeeData["event_id"]);   // Not part of Attendee model fillable

        $attendeeData["check_in_time"] = Carbon::now();

        $attendee = $event->attendees()->create($attendeeData);

        return response()->json($attendee, 201);
    }

    /**
     * Display the specified attendee.
     */
    public function show(Attendee $attendee)
    {
        // TODO: Add authorization
        return response()->json($attendee);
    }

    /**
     * Update the specified attendee in storage.
     */
    public function update(Request $request, Attendee $attendee)
    {
        $validator = Validator::make($request->all(), [
            "name" => "sometimes|required|string|max:255",
            "phone" => "nullable|string|max:20",
            "adult_count" => "sometimes|required|integer|min:0",
            "kid_count" => "sometimes|required|integer|min:0",
            "check_in_time" => "sometimes|required|date_format:Y-m-d H:i:s",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        // TODO: Add authorization

        $attendee->update($validator->validated());

        return response()->json($attendee);
    }

    /**
     * Remove the specified attendee from storage.
     */
    public function destroy(Attendee $attendee)
    {
        // TODO: Add authorization
        $attendee->delete();
        return response()->json(null, 204);
    }
}

