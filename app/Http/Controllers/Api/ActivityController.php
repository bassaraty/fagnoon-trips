<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * Display a listing of all active activities for public use (e.g., in forms).
     */
    public function listAll()
    {
        $activities = Activity::where("is_active", true)->orderBy("name")->get(["id", "name", "description", "price", "is_extra"]);
        return response()->json($activities);
    }

    /**
     * Display a listing of the resource (paginated, for general browsing if needed).
     */
    public function index()
    {
        $activities = Activity::where("is_active", true)->latest()->paginate(10);
        return response()->json($activities);
    }

    /**
     * Display the specified resource.
     */
    public function show(Activity $activity)
    {
        // Ensure only active activities are shown publicly
        if (!$activity->is_active) {
            return response()->json(["message" => "Activity not found or not available."], 404);
        }
        return response()->json($activity);
    }

    // Store, Update, Destroy methods are for admin panel, in Admin\ActivityController.
}

