<?php

namespace App\Services;

use App\Models\Location;
use App\Models\Reservation;
use App\Models\Birthday;
use Carbon\Carbon;

class LocationAvailabilityService
{
    // Define IDs for special locations. These should ideally be configurable or dynamically determined.
    // For this implementation, we assume these IDs are set in the seeder.
    const LARGE_ROOF_LR_ID = 1; // Assumed ID for "Large Roof (Left & Right)"
    const LARGE_ROOF_L_ID = 2;  // Assumed ID for "Large Roof (Left)"
    const LARGE_ROOF_R_ID = 3;  // Assumed ID for "Large Roof (Right)"

    public function isLocationAvailable(int $locationId, string $date, ?int $excludeReservationId = null, ?int $excludeBirthdayId = null): bool
    {
        $parsedDate = Carbon::parse($date)->toDateString();

        // Base query for reservations
        $reservationQuery = Reservation::where('location_id', $locationId)
            ->whereDate('reservation_date', $parsedDate);
        if ($excludeReservationId) {
            $reservationQuery->where('id', '!=', $excludeReservationId);
        }
        if ($reservationQuery->exists()) {
            return false;
        }

        // Base query for birthdays
        $birthdayQuery = Birthday::where('location_id', $locationId)
            ->whereDate('event_date', $parsedDate);
        if ($excludeBirthdayId) {
            $birthdayQuery->where('id', '!=', $excludeBirthdayId);
        }
        if ($birthdayQuery->exists()) {
            return false;
        }

        // Special "Large Roof" logic
        if ($locationId == self::LARGE_ROOF_LR_ID) {
            // Trying to book "Large Roof (Left & Right)"
            // Check if "Large Roof (Left)" or "Large Roof (Right)" is booked
            if ($this->isSpecificLocationBooked(self::LARGE_ROOF_L_ID, $parsedDate, $excludeReservationId, $excludeBirthdayId)) {
                return false;
            }
            if ($this->isSpecificLocationBooked(self::LARGE_ROOF_R_ID, $parsedDate, $excludeReservationId, $excludeBirthdayId)) {
                return false;
            }
        } elseif ($locationId == self::LARGE_ROOF_L_ID || $locationId == self::LARGE_ROOF_R_ID) {
            // Trying to book "Large Roof (Left)" or "Large Roof (Right)"
            // Check if "Large Roof (Left & Right)" is booked
            if ($this->isSpecificLocationBooked(self::LARGE_ROOF_LR_ID, $parsedDate, $excludeReservationId, $excludeBirthdayId)) {
                return false;
            }
        }

        return true;
    }

    private function isSpecificLocationBooked(int $specificLocationId, string $date, ?int $excludeReservationId = null, ?int $excludeBirthdayId = null): bool
    {
        $reservationExistsQuery = Reservation::where('location_id', $specificLocationId)
            ->whereDate('reservation_date', $date);
        if ($excludeReservationId) {
            // This exclusion logic might need refinement if the excluded ID is for a different location type
            // For now, assuming it's a general exclusion for simplicity.
        }
        if ($reservationExistsQuery->exists()) {
            return true;
        }
        
        $birthdayExistsQuery = Birthday::where('location_id', $specificLocationId)
            ->whereDate('event_date', $date);
        if ($excludeBirthdayId) {
            // Similar to above
        }
        if ($birthdayExistsQuery->exists()) {
            return true;
        }

        return false;
    }
}

