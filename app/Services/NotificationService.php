<?php

namespace App\Services;

use App\Models\User;
use App\Models\Notification;
use App\Models\Reservation;
use App\Models\Birthday;

class NotificationService
{
    /**
     * Send a notification to a user.
     *
     * @param User $user The user to notify.
     * @param string $type The type of notification (e.g., "reservation_created", "payment_reminder").
     * @param string $message The main message of the notification.
     * @param mixed $notifiable The model instance that the notification is related to (e.g., Reservation, Birthday).
     * @param array $additionalData Additional data to store with the notification.
     * @return Notification
     */
    public function sendNotification(User $user, string $type, string $message, $notifiable = null, array $additionalData = []): Notification
    {
        $data = array_merge([
            "message" => $message,
        ], $additionalData);

        // Ensure notifiable_type and notifiable_id are correctly set if $notifiable is provided
        $notificationData = [
            "user_id" => $user->id,
            "type" => $type, // This should be the class name of the Laravel Notification if using that system
            "data" => $data,
        ];

        if ($notifiable) {
            $notificationData["notifiable_type"] = get_class($notifiable);
            $notificationData["notifiable_id"] = $notifiable->id;
        }

        return Notification::create($notificationData);
    }

    public function notifyReservationCreated(Reservation $reservation)
    {
        if ($reservation->user) {
            $message = sprintf(
                "Your school trip reservation for %s at %s on %s (%s - %s) has been successfully created with status: %s.",
                $reservation->school_name ?? "N/A",
                $reservation->location->name ?? "N/A",
                $reservation->reservation_date,
                $reservation->start_time,
                $reservation->end_time,
                $reservation->status
            );
            $this->sendNotification(
                $reservation->user, 
                "App\Notifications\ReservationCreatedNotification", // Example, adjust to actual notification class
                $message, 
                $reservation,
                ["reservation_id" => $reservation->id, "details_url" => route("reservations.show", $reservation->id)] // Corrected route name
            );
        }
    }

    public function notifyBirthdayCreated(Birthday $birthday)
    {
        if ($birthday->user) {
            $message = sprintf(
                "Your birthday booking for %s at %s on %s (%s - %s) has been successfully created with status: %s.",
                $birthday->celebrant_name ?? "N/A",
                $birthday->location->name ?? "N/A",
                $birthday->event_date,
                $birthday->start_time,
                $birthday->end_time,
                $birthday->status
            );
            $this->sendNotification(
                $birthday->user, 
                "App\Notifications\BirthdayCreatedNotification", // Example, adjust to actual notification class
                $message, 
                $birthday,
                ["birthday_id" => $birthday->id, "details_url" => route("birthdays.show", $birthday->id)]
            );
        }
    }

    public function notifyReservationUpdated(Reservation $reservation, string $oldStatus = null)
    {
        if ($reservation->user) {
            $message = sprintf(
                "Your school trip reservation for %s at %s on %s has been updated. New status: %s.",
                $reservation->school_name ?? "N/A",
                $reservation->location->name ?? "N/A",
                $reservation->reservation_date,
                $reservation->status
            );
            if ($oldStatus && $oldStatus !== $reservation->status) {
                 $message = sprintf(
                    "The status of your school trip reservation for %s at %s on %s has changed from %s to %s.",
                    $reservation->school_name ?? "N/A",
                    $reservation->location->name ?? "N/A",
                    $reservation->reservation_date,
                    $oldStatus,
                    $reservation->status
                );
            }
            $this->sendNotification(
                $reservation->user, 
                "App\Notifications\ReservationUpdatedNotification", // Example, adjust to actual notification class
                $message, 
                $reservation,
                ["reservation_id" => $reservation->id, "new_status" => $reservation->status, "details_url" => route("reservations.show", $reservation->id)] // Corrected route name
            );
        }
    }

    public function notifyBirthdayUpdated(Birthday $birthday, string $oldStatus = null)
    {
        if ($birthday->user) {
            $message = sprintf(
                "Your birthday booking for %s at %s on %s has been updated. New status: %s.",
                $birthday->celebrant_name ?? "N/A",
                $birthday->location->name ?? "N/A",
                $birthday->event_date,
                $birthday->status
            );
             if ($oldStatus && $oldStatus !== $birthday->status) {
                 $message = sprintf(
                    "The status of your birthday booking for %s at %s on %s has changed from %s to %s.",
                    $birthday->celebrant_name ?? "N/A",
                    $birthday->location->name ?? "N/A",
                    $birthday->event_date,
                    $oldStatus,
                    $birthday->status
                );
            }
            $this->sendNotification(
                $birthday->user, 
                "App\Notifications\BirthdayUpdatedNotification", // Example, adjust to actual notification class
                $message, 
                $birthday,
                ["birthday_id" => $birthday->id, "new_status" => $birthday->status, "details_url" => route("birthdays.show", $birthday->id)]
            );
        }
    }

    public function notifyReservationDeleted(Reservation $reservation)
    {
        if ($reservation->user) {
            $message = sprintf(
                "Your school trip reservation for %s at %s on %s has been cancelled/deleted.",
                $reservation->school_name ?? "N/A",
                $reservation->location->name ?? "N/A",
                $reservation->reservation_date
            );
            $this->sendNotification(
                $reservation->user,
                "App\Notifications\ReservationCancelledNotification", // Example, adjust to actual notification class
                $message,
                $reservation, // Pass the reservation object itself
                ["reservation_id" => $reservation->id] // Keep reservation_id in data for reference
            );
        }
    }

    public function notifyBirthdayDeleted(Birthday $birthday)
    {
        if ($birthday->user) {
            $message = sprintf(
                "Your birthday booking for %s at %s on %s has been cancelled/deleted.",
                $birthday->celebrant_name ?? "N/A",
                $birthday->location->name ?? "N/A",
                $birthday->event_date
            );
            $this->sendNotification(
                $birthday->user,
                "App\Notifications\BirthdayCancelledNotification", // Example, adjust to actual notification class
                $message,
                $birthday, // Pass the birthday object itself
                ["birthday_id" => $birthday->id] // Keep birthday_id in data for reference
            );
        }
    }
}

