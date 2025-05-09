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
            // Add other common data points if needed
        ], $additionalData);

        $notification = new Notification([
            "user_id" => $user->id,
            "type" => $type,
            "data" => $data,
        ]);

        if ($notifiable) {
            $notification->notifiable()->associate($notifiable);
        }

        $notification->save();

        // Here you would typically integrate with actual notification channels 
        // like email, SMS, push notifications (e.g., Laravel Echo, Pusher, FCM).
        // For this example, we are just saving to the database.
        // Mail::to($user->email)->send(new GenericNotificationMail($message, $data));
        // $user->notify(new 
//App\Notifications\SystemNotification($type, $message, $data, $notifiable)); // Using Laravel's built-in notification system

        return $notification;
    }

    /**
     * Example: Notify user about a new reservation.
     */
    public function notifyReservationCreated(Reservation $reservation)
    {
        if ($reservation->user) {
            $message = sprintf(
                "Your school trip reservation for %s at %s on %s (%s - %s) has been successfully created with status: %s.",
                $reservation->school_name,
                $reservation->location->name,
                $reservation->reservation_date,
                $reservation->start_time,
                $reservation->end_time,
                $reservation->status
            );
            $this->sendNotification(
                $reservation->user, 
                "reservation_created", 
                $message, 
                $reservation,
                ["reservation_id" => $reservation->id, "details_url" => route("trips.show", $reservation->id)]
            );
        }
    }

    /**
     * Example: Notify user about a new birthday booking.
     */
    public function notifyBirthdayCreated(Birthday $birthday)
    {
        if ($birthday->user) {
            $message = sprintf(
                "Your birthday booking for %s at %s on %s (%s - %s) has been successfully created with status: %s.",
                $birthday->celebrant_name,
                $birthday->location->name,
                $birthday->event_date,
                $birthday->start_time,
                $birthday->end_time,
                $birthday->status
            );
            $this->sendNotification(
                $birthday->user, 
                "birthday_created", 
                $message, 
                $birthday,
                ["birthday_id" => $birthday->id, "details_url" => route("birthdays.show", $birthday->id)]
            );
        }
    }

    /**
     * Example: Notify user about a reservation status update.
     */
    public function notifyReservationUpdated(Reservation $reservation, string $oldStatus = null)
    {
        if ($reservation->user) {
            $message = sprintf(
                "Your school trip reservation for %s at %s on %s has been updated. New status: %s.",
                $reservation->school_name,
                $reservation->location->name,
                $reservation->reservation_date,
                $reservation->status
            );
            if ($oldStatus && $oldStatus !== $reservation->status) {
                 $message = sprintf(
                    "The status of your school trip reservation for %s at %s on %s has changed from %s to %s.",
                    $reservation->school_name,
                    $reservation->location->name,
                    $reservation->reservation_date,
                    $oldStatus,
                    $reservation->status
                );
            }
            $this->sendNotification(
                $reservation->user, 
                "reservation_updated", 
                $message, 
                $reservation,
                ["reservation_id" => $reservation->id, "new_status" => $reservation->status, "details_url" => route("trips.show", $reservation->id)]
            );
        }
    }

     /**
     * Example: Notify user about a birthday status update.
     */
    public function notifyBirthdayUpdated(Birthday $birthday, string $oldStatus = null)
    {
        if ($birthday->user) {
            $message = sprintf(
                "Your birthday booking for %s at %s on %s has been updated. New status: %s.",
                $birthday->celebrant_name,
                $birthday->location->name,
                $birthday->event_date,
                $birthday->status
            );
             if ($oldStatus && $oldStatus !== $birthday->status) {
                 $message = sprintf(
                    "The status of your birthday booking for %s at %s on %s has changed from %s to %s.",
                    $birthday->celebrant_name,
                    $birthday->location->name,
                    $birthday->event_date,
                    $oldStatus,
                    $birthday->status
                );
            }
            $this->sendNotification(
                $birthday->user, 
                "birthday_updated", 
                $message, 
                $birthday,
                ["birthday_id" => $birthday->id, "new_status" => $birthday->status, "details_url" => route("birthdays.show", $birthday->id)]
            );
        }
    }

    // Add more specific notification methods as needed (e.g., payment reminders, upcoming event reminders)
}

