<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Activity;
use App\Models\Payment;
use App\Services\LocationAvailabilityService;
use App\Services\NotificationService; // Import NotificationService
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TripController extends Controller
{
    protected $locationAvailabilityService;
    protected $notificationService; // Declare NotificationService

    public function __construct(LocationAvailabilityService $locationAvailabilityService, NotificationService $notificationService) // Inject NotificationService
    {
        $this->locationAvailabilityService = $locationAvailabilityService;
        $this->notificationService = $notificationService; // Assign NotificationService
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $trips = Reservation::with(["user", "location", "package", "activities", "payments"])->latest()->paginate(15);
        return response()->json($trips);
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
            "number_of_supervisors" => "required|integer|min:1",
            "reservation_date" => "required|date|after_or_equal:today",
            "start_time" => "required|date_format:H:i",
            "notes" => "nullable|string",
            "activity_ids" => "nullable|array",
            "activity_ids.*" => "exists:activities,id",
            "payment_amount" => "nullable|numeric|min:0",
            "payment_method" => "nullable|string|max:255",
            "payment_proof_path" => "nullable|string|max:255",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if (!$this->locationAvailabilityService->isLocationAvailable($request->input("location_id"), $request->input("reservation_date"))) {
            return response()->json(["message" => "Selected location is not available for the chosen date."], 409);
        }

        $validatedData = $validator->validated();
        $validatedData["user_id"] = Auth::id();
        $startTime = Carbon::parse($validatedData["start_time"]);
        $validatedData["end_time"] = $startTime->addHours(4)->format("H:i:s");
        $validatedData["status"] = "pending";
        $validatedData["payment_status"] = $request->input("payment_amount") > 0 ? "partial" : "unpaid";

        $trip = Reservation::create($validatedData);

        if ($request->has("activity_ids")) {
            $trip->activities()->sync($request->input("activity_ids"));
        }

        if ($request->filled("payment_amount") && $request->input("payment_amount") > 0) {
            $trip->payments()->create([
                "amount" => $request->input("payment_amount"),
                "payment_method" => $request->input("payment_method"),
                "payment_proof_path" => $request->input("payment_proof_path"),
                "status" => "completed",
                "payment_date" => Carbon::now(),
            ]);
        }

        // Send notification for trip creation
        $this->notificationService->notifyReservationCreated($trip);

        return response()->json($trip->load(["user", "location", "package", "activities", "payments"]), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $trip)
    {
        return response()->json($trip->load(["user", "location", "package", "activities", "payments", "attendees"]));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservation $trip)
    {
        $validator = Validator::make($request->all(), [
            "location_id" => "sometimes|required|exists:locations,id",
            "package_id" => "sometimes|required|exists:packages,id",
            "school_name" => "sometimes|required|string|max:255",
            "school_grade" => "sometimes|required|string|max:255",
            "number_of_students" => "sometimes|required|integer|min:1",
            "number_of_supervisors" => "sometimes|required|integer|min:1",
            "reservation_date" => "sometimes|required|date",
            "start_time" => "sometimes|required|date_format:H:i",
            "notes" => "nullable|string",
            "status" => "sometimes|required|in:pending,confirmed,cancelled,completed",
            "payment_status" => "sometimes|required|in:unpaid,paid,partial",
            "activity_ids" => "nullable|array",
            "activity_ids.*" => "exists:activities,id",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $newLocationId = $request->input("location_id", $trip->location_id);
        $newDate = $request->input("reservation_date", $trip->reservation_date);
        if (($request->has("location_id") && $request->input("location_id") != $trip->location_id) || 
            ($request->has("reservation_date") && Carbon::parse($request->input("reservation_date"))->notEqualTo(Carbon::parse($trip->reservation_date)))) {
            if (!$this->locationAvailabilityService->isLocationAvailable($newLocationId, $newDate, $trip->id, null)) {
                return response()->json(["message" => "Selected location is not available for the chosen date."], 409);
            }
        }

        $validatedData = $validator->validated();
        if ($request->has("start_time")) {
            $startTime = Carbon::parse($validatedData["start_time"]);
            $validatedData["end_time"] = $startTime->addHours(4)->format("H:i:s");
        }

        $oldStatus = $trip->status;
        $trip->update($validatedData);

        if ($request->has("activity_ids")) {
            $trip->activities()->sync($request->input("activity_ids"));
        }

        // Send notification for trip update
        $this->notificationService->notifyReservationUpdated($trip, $oldStatus);

        return response()->json($trip->load(["user", "location", "package", "activities", "payments"]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $trip)
    {
        // TODO: Send notification for trip cancellation if applicable before deleting
        $trip->delete();
        return response()->json(null, 204);
    }
}

