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
use Illuminate\Support\Str;

class AttendeeController extends Controller
{
    protected $eventableTypes = [
        "reservation" => Reservation::class,
        "birthday" => Birthday::class,
    ];

    protected function getEventableClass(string $type): ?string
    {
        return $this->eventableTypes[strtolower($type)] ?? null;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "eventable_id" => "required|integer",
            "eventable_type" => ["required", "string", Rule::in(array_keys($this->eventableTypes))],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $eventableId = $request->input("eventable_id");
        $eventableTypeString = $request->input("eventable_type");
        $eventableClass = $this->getEventableClass($eventableTypeString);

        if (!$eventableClass) {
            return response()->json(["message" => "Invalid eventable_type specified."], 422);
        }

        $event = $eventableClass::find($eventableId);

        // Authorization: Ensure the authenticated user owns the parent event or is an admin.
        // This assumes Reservation and Birthday models have a user_id field.
        if (!$event || ($event->user_id !== Auth::id() && !Auth::user()->hasRole("admin"))) {
            return response()->json(["message" => "Event not found or unauthorized to view attendees."], 403);
        }

        $attendees = Attendee::where("eventable_id", $eventableId)
                             ->where("eventable_type", $eventableClass) // Use the resolved class name for DB query
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
            "eventable_type" => ["required", "string", Rule::in(array_keys($this->eventableTypes))],
            "name" => "required|string|max:255",
            "phone" => "nullable|string|max:20",
            "adult_count" => "required|integer|min:0",
            "kid_count" => "required|integer|min:0",
            "check_in_time" => "nullable|date_format:Y-m-d H:i:s", 
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();
        $eventableClass = $this->getEventableClass($validatedData["eventable_type"]);

        if (!$eventableClass) {
            return response()->json(["message" => "Invalid eventable_type specified."], 422);
        }
        
        $event = $eventableClass::find($validatedData["eventable_id"]);

        // Authorization
        if (!$event || ($event->user_id !== Auth::id() && !Auth::user()->hasRole("admin"))) {
            return response()->json(["message" => "Event not found or unauthorized to add attendees."], 403);
        }
        
        // The validatedData["eventable_type"] still holds the simple string.
        // We need to store the fully qualified class name in the database for the polymorphic relation.
        $validatedData["eventable_type"] = $eventableClass;

        $attendee = $event->attendees()->create($validatedData);
        return response()->json($attendee, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendee $attendee)
    {
        $event = $attendee->eventable;
        // Authorization
        if (!$event || ($event->user_id !== Auth::id() && !Auth::user()->hasRole("admin"))) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        return response()->json($attendee);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendee $attendee)
    {
        $event = $attendee->eventable;
        // Authorization
        if (!$event || ($event->user_id !== Auth::id() && !Auth::user()->hasRole("admin"))) {
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
        // Authorization
        if (!$event || ($event->user_id !== Auth::id() && !Auth::user()->hasRole("admin"))) {
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
        // Authorization
        if (!$event || ($event->user_id !== Auth::id() && !Auth::user()->hasRole("admin"))) {
            return response()->json(["message" => "Unauthorized to check-in this attendee."], 403);
        }

        if ($attendee->check_in_time) {
            return response()->json(["message" => "Attendee already checked in.", "attendee" => $attendee], 409); 
        }

        $attendee->update(["check_in_time" => Carbon::now()]);
        return response()->json(["message" => "Attendee checked in successfully.", "attendee" => $attendee]);
    }
}

