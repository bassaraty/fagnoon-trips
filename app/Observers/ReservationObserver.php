<?php

namespace App\Observers;

use App\Models\Reservation;
use App\Models\Notification; // Make sure to import the Notification model
use App\Models\User; // Import User model if you need to notify specific users like admins

class ReservationObserver
{
    /**
     * Handle the Reservation "created" event.
     */
    public function created(Reservation $reservation): void
    {
        // Notify the user who made the reservation
        if ($reservation->user) {
            Notification::create([
                "user_id" => $reservation->user_id,
                "type" => "App\Notifications\ReservationCreatedNotification", // Example type, adjust as needed
                "notifiable_type" => Reservation::class,
                "notifiable_id" => $reservation->id,
                "data" => [
                    "message" => "Your reservation for " . ($reservation->package->name ?? "a package") . " at " . ($reservation->location->name ?? "a location") . " on " . $reservation->reservation_date . " has been created.",
                    "reservation_id" => $reservation->id,
                    "status" => $reservation->status,
                ],
            ]);
        }

        // Optionally, notify admins or other relevant users
        // $admins = User::where("role", "admin")->get(); // Example: Get admin users
        // foreach ($admins as $admin) {
        //     Notification::create([
        //         "user_id" => $admin->id,
        //         "type" => "App\Notifications\Admin\NewReservationNotification",
        //         "notifiable_type" => Reservation::class,
        //         "notifiable_id" => $reservation->id,
        //         "data" => [
        //             "message" => "A new reservation (ID: {$reservation->id}) has been created by user {$reservation->user->name}.".
        //             "reservation_id" => $reservation->id,
        //         ],
        //     ]);
        // }
    }

    /**
     * Handle the Reservation "updated" event.
     */
    public function updated(Reservation $reservation): void
    {
        if ($reservation->user) {
            // Check what was changed to provide a more specific notification
            $changes = $reservation->getChanges();
            $changedFields = array_keys($changes);
            // Remove timestamps and other irrelevant fields from notification message
            $relevantChanges = array_diff($changedFields, ["updated_at", "created_at", "end_time"]); 

            if (empty($relevantChanges) && !$reservation->wasChanged("status") && !$reservation->wasChanged("payment_status")) {
                return; // No significant changes to notify about
            }

            $message = "Your reservation (ID: {$reservation->id}) has been updated.";
            if ($reservation->wasChanged("status")) {
                $message = "Your reservation (ID: {$reservation->id}) status has been updated to: " . $reservation->status . ".";
            } elseif ($reservation->wasChanged("payment_status")) {
                $message = "Your reservation (ID: {$reservation->id}) payment status has been updated to: " . $reservation->payment_status . ".";
            } elseif (count($relevantChanges) > 0) {
                $message = "Your reservation (ID: {$reservation->id}) details for " . implode(", ", $relevantChanges) . " have been updated.";
            }

            Notification::create([
                "user_id" => $reservation->user_id,
                "type" => "App\Notifications\ReservationUpdatedNotification",
                "notifiable_type" => Reservation::class,
                "notifiable_id" => $reservation->id,
                "data" => [
                    "message" => $message,
                    "reservation_id" => $reservation->id,
                    "status" => $reservation->status,
                    "changes" => $changes, // Optionally include changes for detailed view
                ],
            ]);
        }
        // Optionally notify admins
    }

    /**
     * Handle the Reservation "deleted" event.
     */
    public function deleted(Reservation $reservation): void
    {
        if ($reservation->user) {
            Notification::create([
                "user_id" => $reservation->user_id,
                "type" => "App\Notifications\ReservationCancelledNotification", // Or DeletedNotification
                "notifiable_type" => Reservation::class,
                "notifiable_id" => $reservation->id, // The ID still exists on the model instance before it's gone from DB
                "data" => [
                    "message" => "Your reservation (ID: {$reservation->id}) for " . ($reservation->package->name ?? "a package") . " at " . ($reservation->location->name ?? "a location") . " on " . $reservation->reservation_date . " has been cancelled/deleted.",
                    "reservation_id" => $reservation->id,
                ],
            ]);
        }
        // Optionally notify admins
    }

    /**
     * Handle the Reservation "restored" event.
     */
    public function restored(Reservation $reservation): void
    {
        // Logic for restored event if using soft deletes and restoration
    }

    /**
     * Handle the Reservation "force deleted" event.
     */
    public function forceDeleted(Reservation $reservation): void
    {
        // Logic for force deleted event if using soft deletes
    }
}

