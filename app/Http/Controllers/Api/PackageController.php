<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    /**
     * Display a listing of all active packages for public use (e.g., in forms).
     * Optionally filters by type (trip or birthday).
     */
    public function listAll(Request $request)
    {
        $query = Package::where("is_active", true)->orderBy("name");

        if ($request->has("type") && in_array($request->type, ["trip", "birthday", "general"])) {
            $query->where("type", $request->type);
        }

        $packages = $query->get(["id", "name", "description", "price", "number_of_activities", "type"]);
        return response()->json($packages);
    }

    /**
     * Display a listing of the resource (paginated, for general browsing if needed).
     * Optionally filters by type (trip or birthday).
     */
    public function index(Request $request)
    {
        $query = Package::where("is_active", true)->latest();

        if ($request->has("type") && in_array($request->type, ["trip", "birthday", "general"])) {
            $query->where("type", $request->type);
        }
        
        $packages = $query->paginate(10);
        return response()->json($packages);
    }

    /**
     * Display the specified resource.
     */
    public function show(Package $package)
    {
        // Ensure only active packages are shown publicly
        if (!$package->is_active) {
            return response()->json(["message" => "Package not found or not available."], 404);
        }
        return response()->json($package);
    }

    // Store, Update, Destroy methods are for admin panel, in Admin\PackageController.
}

