<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Birthday;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CardViewController extends Controller
{
    /**
     * Display a listing of reservations formatted for card view.
     */
    public function index(Request $request)
    {
        // TODO: Implement filtering based on user role, branch, and possibly date range or search query
        $cards = [];

        // Fetch Trip Reservations
        $trips = Reservation::with(["user", "location", "package"])
            ->orderBy("reservation_date", "desc")
            ->orderBy("start_time", "desc")
            ->paginate(10); // Paginate for card view

        foreach ($trips as $trip) {
            $cards[] = [
                "id" => "trip_" . $trip->id,
                "type" => "Trip Reservation",
                "title" => $trip->school_name ?: "N/A",
                "sub_title" => "Package: " . $trip->package->name,
                "date" => Carbon::parse($trip->reservation_date)->format("M d, Y"),
                "time" => Carbon::parse($trip->start_time)->format("h:i A") . " - " . Carbon::parse($trip->end_time)->format("h:i A"),
                "location" => $trip->location->name,
                "status" => ucfirst($trip->status),
                "payment_status" => ucfirst($trip->payment_status),
                "payment_color" => $this->getEventColor($trip->payment_status),
                "booked_by" => $trip->user->name,
                "contact_info" => $trip->user->email, // Or phone, if available and relevant
                "view_url" => route("trips.show", $trip->id), // API route for details
                "edit_url" => route("trips.update", $trip->id), // API route for update (PUT)
                "delete_url" => route("trips.destroy", $trip->id), // API route for delete (DELETE)
                // "call_action" => "tel:" . $trip->user->phone, // Example, if phone is available
            ];
        }

        // Fetch Birthday Reservations
        $birthdays = Birthday::with(["user", "location", "package"])
            ->orderBy("event_date", "desc")
            ->orderBy("start_time", "desc")
            ->paginate(10); // Paginate for card view

        foreach ($birthdays as $birthday) {
            $cards[] = [
                "id" => "birthday_" . $birthday->id,
                "type" => "Birthday Reservation",
                "title" => "Birthday: " . $birthday->celebrant_name,
                "sub_title" => "Package: " . $birthday->package->name,
                "date" => Carbon::parse($birthday->event_date)->format("M d, Y"),
                "time" => Carbon::parse($birthday->start_time)->format("h:i A") . " - " . Carbon::parse($birthday->end_time)->format("h:i A"),
                "location" => $birthday->location->name,
                "status" => ucfirst($birthday->status),
                "payment_status" => ucfirst($birthday->payment_status),
                "payment_color" => $this->getEventColor($birthday->payment_status),
                "booked_by" => $birthday->user->name,
                "contact_info" => $birthday->user->email,
                "view_url" => route("birthdays.show", $birthday->id),
                "edit_url" => route("birthdays.update", $birthday->id),
                "delete_url" => route("birthdays.destroy", $birthday->id),
            ];
        }

        // In a real scenario, you might want to merge and sort these, or return them separately.
        // For simplicity, returning as a combined list. Pagination might need adjustment if merging before paginating.
        // A more robust solution would use a unified query or separate endpoints if pagination is critical for each type.
        
        // For now, let's return trips and birthdays separately to handle pagination correctly.
        // The frontend can then decide how to display them (e.g., in separate sections or merged and sorted client-side if not too many items per page)

        return response()->json([
            "trips" => $trips->through(function ($trip) {
                 return [
                    "id" => "trip_" . $trip->id,
                    "type" => "Trip Reservation",
                    "title" => $trip->school_name ?: "N/A",
                    "sub_title" => "Package: " . ($trip->package->name ?? 'N/A'),
                    "date" => Carbon::parse($trip->reservation_date)->format("M d, Y"),
                    "time" => Carbon::parse($trip->start_time)->format("h:i A") . " - " . Carbon::parse($trip->end_time)->format("h:i A"),
                    "location" => $trip->location->name ?? 'N/A',
                    "status" => ucfirst($trip->status),
                    "payment_status" => ucfirst($trip->payment_status),
                    "payment_color" => $this->getEventColor($trip->payment_status),
                    "booked_by" => $trip->user->name ?? 'N/A',
                    "contact_info" => $trip->user->email ?? 'N/A',
                    "view_url" => route("trips.show", $trip->id),
                    "edit_url" => route("trips.update", $trip->id),
                    "delete_url" => route("trips.destroy", $trip->id),
                ];
            }),
            "birthdays" => $birthdays->through(function ($birthday) {
                return [
                    "id" => "birthday_" . $birthday->id,
                    "type" => "Birthday Reservation",
                    "title" => "Birthday: " . $birthday->celebrant_name,
                    "sub_title" => "Package: " . ($birthday->package->name ?? 'N/A'),
                    "date" => Carbon::parse($birthday->event_date)->format("M d, Y"),
                    "time" => Carbon::parse($birthday->start_time)->format("h:i A") . " - " . Carbon::parse($birthday->end_time)->format("h:i A"),
                    "location" => $birthday->location->name ?? 'N/A',
                    "status" => ucfirst($birthday->status),
                    "payment_status" => ucfirst($birthday->payment_status),
                    "payment_color" => $this->getEventColor($birthday->payment_status),
                    "booked_by" => $birthday->user->name ?? 'N/A',
                    "contact_info" => $birthday->user->email ?? 'N/A',
                    "view_url" => route("birthdays.show", $birthday->id),
                    "edit_url" => route("birthdays.update", $birthday->id),
                    "delete_url" => route("birthdays.destroy", $birthday->id),
                ];
            })
        ]);
    }

    private function getEventColor(string $paymentStatus): string
    {
        switch (strtolower($paymentStatus)) {
            case "paid":
                return "green";
            case "unpaid":
                return "red";
            case "partial":
                return "orange";
            default:
                return "blue";
        }
    }

    // store, show, update, destroy methods are not typically used for a generic card view data endpoint
    // as actions (view, edit, delete) are usually handled by the respective resource controllers.
    public function store(Request $request) { return response()->json(["message" => "Not implemented"], 501); }
    public function show(string $id) { return response()->json(["message" => "Not implemented"], 501); }
    public function update(Request $request, string $id) { return response()->json(["message" => "Not implemented"], 501); }
    public function destroy(string $id) { return response()->json(["message" => "Not implemented"], 501); }
}

