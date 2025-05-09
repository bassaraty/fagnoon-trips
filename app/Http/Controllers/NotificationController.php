<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notifications = Auth::user()->notifications()->latest()->paginate(15);
        // Or, if you want unread first, then read:
        // $notifications = Auth::user()->notifications()->orderBy("read_at", "asc")->latest()->paginate(15);
        return response()->json($notifications);
    }

    /**
     * Mark the specified notification as read.
     */
    public function markAsRead(Request $request, Notification $notification)
    {
        // Ensure the notification belongs to the authenticated user
        if ($notification->user_id !== Auth::id()) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        if (!$notification->read_at) {
            $notification->markAsRead();
        }
        
        return response()->json(["message" => "Notification marked as read.", "notification" => $notification]);
    }

    /**
     * Mark all unread notifications for the authenticated user as read.
     */
    public function markAllAsRead(Request $request)
    {
        Auth::user()->unreadNotifications->markAsRead();
        return response()->json(["message" => "All unread notifications marked as read."]);
    }

    /**
     * Get the count of unread notifications for the authenticated user.
     */
    public function unreadCount()
    {
        $count = Auth::user()->unreadNotifications()->count();
        return response()->json(["unread_count" => $count]);
    }

    // Store, Show, Update, Destroy methods are typically not directly used for user-facing notifications management via API in this manner.
    // Notifications are usually created by the system and deleted automatically or by a batch job.

    /**
     * Store a newly created resource in storage.
     * (Typically system-generated, but can be exposed if needed for specific use cases)
     */
    // public function store(Request $request)
    // {
    //     // Validation and creation logic if manual creation is allowed
    // }

    /**
     * Display the specified resource.
     */
    // public function show(Notification $notification)
    // {
    //     if ($notification->user_id !== Auth::id()) {
    //         return response()->json(["message" => "Unauthorized"], 403);
    //     }
    //     return response()->json($notification);
    // }

    /**
     * Remove the specified resource from storage.
     */
    // public function destroy(Notification $notification)
    // {
    //     if ($notification->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
    //         return response()->json(["message" => "Unauthorized"], 403);
    //     }
    //     $notification->delete();
    //     return response()->json(null, 204);
    // }
}

