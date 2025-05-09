<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    public function __construct()
    {
        // $this->middleware("role:admin");
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = Location::latest()->paginate(15);
        return response()->json($locations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255|unique:locations,name",
            "capacity" => "required|integer|min:1",
            "branch" => "required|string|max:255",
            "rules" => "nullable|string",
            "is_bookable" => "required|boolean",
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
     */
    public function update(Request $request, Location $location)
    {
        $validator = Validator::make($request->all(), [
            "name" => "sometimes|required|string|max:255|unique:locations,name," . $location->id,
            "capacity" => "sometimes|required|integer|min:1",
            "branch" => "sometimes|required|string|max:255",
            "rules" => "nullable|string",
            "is_bookable" => "sometimes|required|boolean",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $location->update($validator->validated());

        return response()->json($location);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        // Consider adding checks if location is in use before deleting
        $location->delete();
        return response()->json(null, 204);
    }
}

