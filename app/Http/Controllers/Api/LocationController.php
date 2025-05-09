<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Display a listing of all bookable locations for public use (e.g., in forms).
     */
    public function listAll()
    {
        $locations = Location::where("is_bookable", true)->orderBy("name")->get(["id", "name", "branch", "capacity"]);
        return response()->json($locations);
    }

    /**
     * Display a listing of the resource (paginated, for general browsing if needed).
     */
    public function index()
    {
        $locations = Location::where("is_bookable", true)->latest()->paginate(10);
        return response()->json($locations);
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location)
    {
        // Ensure only bookable locations are shown publicly, or add admin check for non-bookable ones
        if (!$location->is_bookable) {
            // Optional: Add admin check here if admins should see non-bookable ones via this route
            // if (!Auth::check() || !Auth::user()->hasRole('admin')) {
            //     return response()->json(["message" => "Location not found or not available."], 404);
            // }
            return response()->json(["message" => "Location not found or not available."], 404);
        }
        return response()->json($location);
    }

    // Store, Update, Destroy methods are typically for admin panel, so they are in Admin\LocationController.
    // If public submission of locations is ever needed, those methods would be built out here with appropriate validation and security.
}

