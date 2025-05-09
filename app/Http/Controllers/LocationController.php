<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Publicly accessible list of locations
        $locations = Location::latest()->paginate(10);
        return response()->json($locations);
    }

    /**
     * Store a newly created resource in storage.
     * (Typically admin-only, but implementing basic structure)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:locations,name',
            'address' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            // Add other location-specific fields here if any
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $location = Location::create($validator->validated());
        return response()->json($location, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location)
    {
        return response()->json($location);
    }

    /**
     * Update the specified resource in storage.
     * (Typically admin-only)
     */
    public function update(Request $request, Location $location)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:locations,name,' . $location->id,
            'address' => 'nullable|string|max:255',
            'capacity' => 'sometimes|required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $location->update($validator->validated());
        return response()->json($location);
    }

    /**
     * Remove the specified resource from storage.
     * (Typically admin-only)
     */
    public function destroy(Location $location)
    {
        // Consider implications: what happens to reservations using this location?
        // Soft deletes or preventing deletion if in use might be better.
        $location->delete();
        return response()->json(null, 204);
    }
}

