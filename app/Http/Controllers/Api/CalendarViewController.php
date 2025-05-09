<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Birthday;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CalendarViewController extends Controller
{
    /**
     * Display a listing of events for the calendar.
     * Supports fetching events for a given month/year or a date range.
     */
    public function index(Request $request)
    {
        // Validate request parameters for date range or month/year
        $request->validate([
            'start_date' => 'sometimes|required_with:end_date|date',
            'end_date' => 'sometimes|required_with:start_date|date|after_or_equal:start_date',
            'month' => 'sometimes|required_with:year|integer|between:1,12',
            'year' => 'sometimes|required_with:month|integer|digits:4',
        ]);

        $events = [];

        // Determine date range for fetching events
        $startDate = null;
        $endDate = null;

        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = Carbon::parse($request->input('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->input('end_date'))->endOfDay();
        } elseif ($request->has('month') && $request->has('year')) {
            $year = $request->input('year');
            $month = $request->input('month');
            $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
            $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth();
        } else {
            // Default to current month if no range is specified
            $startDate = Carbon::now()->startOfMonth();
            $endDate = Carbon::now()->endOfMonth();
        }

        // Fetch Trip Reservations
        $trips = Reservation::with(['location', 'package'])
            ->whereBetween('reservation_date', [$startDate, $endDate])
            ->get();

        foreach ($trips as $trip) {
            $events[] = [
                'id' => 'trip_' . $trip->id,
                'title' => 'Trip: ' . ($trip->school_name ?: 'N/A') . ' (' . $trip->package->name . ') at ' . $trip->location->name,
                'start' => Carbon::parse($trip->reservation_date . ' ' . $trip->start_time)->toIso8601String(),
                'end' => Carbon::parse($trip->reservation_date . ' ' . $trip->end_time)->toIso8601String(),
                'color' => $this->getEventColor($trip->payment_status),
                'type' => 'trip',
                'details_url' => route('trips.show', $trip->id), // Assuming you have named routes
                'payment_status' => $trip->payment_status,
                'location_name' => $trip->location->name,
                'package_name' => $trip->package->name,
            ];
        }

        // Fetch Birthday Reservations
        $birthdays = Birthday::with(['location', 'package'])
            ->whereBetween('event_date', [$startDate, $endDate])
            ->get();

        foreach ($birthdays as $birthday) {
            $events[] = [
                'id' => 'birthday_' . $birthday->id,
                'title' => 'Birthday: ' . $birthday->celebrant_name . ' (' . $birthday->package->name . ') at ' . $birthday->location->name,
                'start' => Carbon::parse($birthday->event_date . ' ' . $birthday->start_time)->toIso8601String(),
                'end' => Carbon::parse($birthday->event_date . ' ' . $birthday->end_time)->toIso8601String(),
                'color' => $this->getEventColor($birthday->payment_status),
                'type' => 'birthday',
                'details_url' => route('birthdays.show', $birthday->id), // Assuming you have named routes
                'payment_status' => $birthday->payment_status,
                'location_name' => $birthday->location->name,
                'package_name' => $birthday->package->name,
            ];
        }

        return response()->json($events);
    }

    private function getEventColor(string $paymentStatus): string
    {
        switch (strtolower($paymentStatus)) {
            case 'paid':
                return 'green'; // Green for Paid
            case 'unpaid':
                return 'red';   // Red for Unpaid
            case 'partial':
                return 'orange'; // Orange for Partially Paid (optional)
            default:
                return 'blue';  // Default color
        }
    }

    // Other methods (store, show, update, destroy) are not typically needed for a calendar view controller
    // unless you plan to manage calendar-specific settings or views through it.
    // For now, they will remain empty as per the --api resource generation.

    public function store(Request $request) { return response()->json(['message' => 'Not implemented'], 501); }
    public function show(string $id) { return response()->json(['message' => 'Not implemented'], 501); }
    public function update(Request $request, string $id) { return response()->json(['message' => 'Not implemented'], 501); }
    public function destroy(string $id) { return response()->json(['message' => 'Not implemented'], 501); }
}

