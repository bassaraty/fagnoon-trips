<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ActivityController extends Controller
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
        $activities = Activity::latest()->paginate(15);
        return response()->json($activities);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255|unique:activities,name",
            "description" => "nullable|string",
            "price" => "required|numeric|min:0",
            "is_extra" => "required|boolean", // Indicates if it's an add-on vs part of a base package
            "is_active" => "required|boolean",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $activity = Activity::create($validator->validated());

        return response()->json($activity, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Activity $activity)
    {
        return response()->json($activity);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Activity $activity)
    {
        $validator = Validator::make($request->all(), [
            "name" => "sometimes|required|string|max:255|unique:activities,name," . $activity->id,
            "description" => "nullable|string",
            "price" => "sometimes|required|numeric|min:0",
            "is_extra" => "sometimes|required|boolean",
            "is_active" => "sometimes|required|boolean",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $activity->update($validator->validated());

        return response()->json($activity);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Activity $activity)
    {
        // Consider adding checks if activity is in use before deleting
        $activity->delete();
        return response()->json(null, 204);
    }
}

