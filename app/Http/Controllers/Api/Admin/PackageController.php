<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PackageController extends Controller
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
        $packages = Package::latest()->paginate(15);
        return response()->json($packages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255|unique:packages,name",
            "description" => "nullable|string",
            "price" => "required|numeric|min:0",
            "number_of_activities" => "required|integer|min:0",
            "type" => "required|in:trip,birthday,general", // Added 'general' as a possible type
            "is_active" => "required|boolean",
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
     */
    public function update(Request $request, Package $package)
    {
        $validator = Validator::make($request->all(), [
            "name" => "sometimes|required|string|max:255|unique:packages,name," . $package->id,
            "description" => "nullable|string",
            "price" => "sometimes|required|numeric|min:0",
            "number_of_activities" => "sometimes|required|integer|min:0",
            "type" => "sometimes|required|in:trip,birthday,general",
            "is_active" => "sometimes|required|boolean",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $package->update($validator->validated());

        return response()->json($package);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Package $package)
    {
        // Consider adding checks if package is in use before deleting
        $package->delete();
        return response()->json(null, 204);
    }
}

