<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Publicly accessible list of activities
        $activities = Activity::latest()->paginate(10);
        return response()->json($activities);
    }

    /**
     * Store a newly created resource in storage.
     * (Typically admin-only, but implementing basic structure)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:activities,name',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            // Add other activity-specific fields here if any
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
     * (Typically admin-only)
     */
    public function update(Request $request, Activity $activity)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:activities,name,' . $activity->id,
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $activity->update($validator->validated());
        return response()->json($activity);
    }

    /**
     * Remove the specified resource from storage.
     * (Typically admin-only)
     */
    public function destroy(Activity $activity)
    {
        // Consider implications: what happens to reservations/birthdays using this activity?
        // Detaching from related models might be needed before deletion.
        $activity->delete();
        return response()->json(null, 204);
    }
}

