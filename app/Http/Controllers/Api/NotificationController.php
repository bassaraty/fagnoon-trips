<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class NotificationController extends Controller
{
    /**
     * Display a listing of the authenticated user's notifications.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $notifications = $user->notifications()->latest()->paginate(15);
        // Or use $user->unreadNotifications()->paginate(15); if you only want unread ones by default

        return response()->json($notifications);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, Notification $notification)
    {
        // Ensure the notification belongs to the authenticated user
        if ($notification->user_id !== Auth::id()) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        if (!$notification->read_at) {
            $notification->update(["read_at" => Carbon::now()]);
        }

        return response()->json($notification);
    }

    /**
     * Mark all unread notifications for the authenticated user as read.
     */
    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();
        $user->unreadNotifications()->update(["read_at" => Carbon::now()]);

        return response()->json(["message" => "All notifications marked as read."]);
    }

    /**
     * Display the specified notification.
     * (Typically not needed if details are in the listing, but kept for API resource consistency)
     */
    public function show(Notification $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        return response()->json($notification);
    }

    // Store and Destroy methods are generally not directly exposed for user notifications via API
    // Notifications are usually created by the system and automatically deleted after a certain period or by a cleanup job.
    // For now, they will remain as placeholders or return 'Not Implemented'.

    /**
     * Store a newly created resource in storage. (System-driven, not typically user API)
     */
    public function store(Request $request)
    {
        return response()->json(["message" => "Not implemented. Notifications are system-generated."], 501);
    }


    /**
     * Remove the specified resource from storage. (System-driven, not typically user API)
     */
    public function destroy(Notification $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        // Potentially allow users to delete their notifications if required by business logic
        // $notification->delete();
        // return response()->json(null, 204);
        return response()->json(["message" => "Not implemented. Notification deletion policy TBD."], 501);
    }
}

