<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Publicly accessible list of packages
        $packages = Package::latest()->paginate(10);
        return response()->json($packages);
    }

    /**
     * Store a newly created resource in storage.
     * (Typically admin-only, but implementing basic structure)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:packages,name',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_hours' => 'required|integer|min:1',
            'type' => 'required|in:trip,birthday,other',
            // Add other package-specific fields here if any
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $package = Package::create($validator->validated());
        return response()->json($package, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Package $package)
    {
        return response()->json($package);
    }

    /**
     * Update the specified resource in storage.
     * (Typically admin-only)
     */
    public function update(Request $request, Package $package)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:packages,name,' . $package->id,
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'duration_hours' => 'sometimes|required|integer|min:1',
            'type' => 'sometimes|required|in:trip,birthday,other',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $package->update($validator->validated());
        return response()->json($package);
    }

    /**
     * Remove the specified resource from storage.
     * (Typically admin-only)
     */
    public function destroy(Package $package)
    {
        // Consider implications: what happens to reservations using this package?
        // Soft deletes or preventing deletion if in use might be better.
        $package->delete();
        return response()->json(null, 204);
    }
}

