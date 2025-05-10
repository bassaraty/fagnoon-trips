<?php

namespace App\Observers;

use App\Models\Reservation;
use App\Services\NotificationService; // Import NotificationService

class ReservationObserver
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the Reservation "created" event.
     */
    public function created(Reservation $reservation): void
    {
        $this->notificationService->notifyReservationCreated($reservation);

        // Admin notification logic can also be moved to the service or kept here if specific
        // For now, focusing on user notifications via service as per consolidation goal
    }

    /**
     * Handle the Reservation "updated" event.
     */
    public function updated(Reservation $reservation): void
    {
        // The NotificationService->notifyReservationUpdated might need access to original attributes
        // or the observer can determine the message and pass it.
        // For simplicity, let's assume the service handles the logic of what changed if it needs to.
        // The existing service method takes $oldStatus, which is not directly available here without fetching original.
        // However, $reservation->getOriginal('status') could be used if needed before this point.
        // Or, the service method can be adapted.
        // Let's refine the service call or the service method itself later if needed.
        // For now, a simple call. The service's current updated method might be sufficient.

        // We need to check if significant fields were updated to avoid spamming notifications.
        // The previous observer had logic for this:
        $changes = $reservation->getChanges();
        $relevantChanges = array_diff(array_keys($changes), ["updated_at", "created_at", "end_time"]);

        if (empty($relevantChanges) && !$reservation->wasChanged("status") && !$reservation->wasChanged("payment_status")) {
            return; // No significant changes to notify about
        }

        // Pass the reservation. The service method can fetch original data if it needs to compare.
        // Or, we can enhance the service method to accept a list of changes.
        $this->notificationService->notifyReservationUpdated($reservation, $reservation->getOriginal("status"));
    }

    /**
     * Handle the Reservation "deleted" event.
     */
    public function deleted(Reservation $reservation): void
    {
        // Assuming a method notifyReservationDeleted exists or will be added to NotificationService
        $this->notificationService->notifyReservationDeleted($reservation);
    }

    /**
     * Handle the Reservation "restored" event.
     */
    public function restored(Reservation $reservation): void
    {
        // Logic for restored event if using soft deletes and restoration
        // Example: $this->notificationService->notifyReservationRestored($reservation);
    }

    /**
     * Handle the Reservation "force deleted" event.
     */
    public function forceDeleted(Reservation $reservation): void
    {
        // Logic for force deleted event if using soft deletes
        // Example: $this->notificationService->notifyReservationForceDeleted($reservation);
    }
}

