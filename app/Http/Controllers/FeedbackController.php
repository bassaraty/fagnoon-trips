<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Reservation;
use App\Models\Birthday;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Feedback might be public or admin-only, or per-event
        // For now, let's assume it's related to a specific event if provided
        $query = Feedback::query()->with("user"); // Eager load user who gave feedback

        if ($request->has(["eventable_type", "eventable_id"])) {
            $eventableType = $request->input("eventable_type");
            $eventableId = $request->input("eventable_id");

            if (!in_array($eventableType, [Reservation::class, Birthday::class])) {
                return response()->json(["message" => "Invalid event type for feedback."], 400);
            }
            $query->where("eventable_type", $eventableType)->where("eventable_id", $eventableId);
        }
        // Add authorization: only admin or event owner can see all feedback for an event?
        // Or perhaps feedback is public once submitted for an event?
        // This needs clarification based on requirements.

        $feedback = $query->latest()->paginate(15);
        return response()->json($feedback);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "eventable_id" => "required|integer",
            "eventable_type" => ["required", "string", Rule::in([Reservation::class, Birthday::class])],
            "rating" => "nullable|integer|min:1|max:5",
            "comment" => "nullable|string|max:5000",
            "feedback_image" => "nullable|image|mimes:jpg,jpeg,png|max:2048", // For direct image upload with feedback
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();
        $event = $validatedData["eventable_type"]::find($validatedData["eventable_id"]);

        // Check if user is authorized to leave feedback (e.g., attended the event or booked it)
        if (!$event || $event->user_id !== Auth::id() /* && !Auth::user()->isParticipant($event) */) {
            return response()->json(["message" => "Event not found or unauthorized to leave feedback."], 403);
        }

        $validatedData["user_id"] = Auth::id();

        if ($request->hasFile("feedback_image")) {
            $file = $request->file("feedback_image");
            $filename = time() . "_" . $file->getClientOriginalName();
            // Store in a path like: feedback_images/reservations/1/timestamp_image.jpg
            $path = $file->storeAs("feedback_images/" . strtolower(class_basename($validatedData["eventable_type"])) . "/" . $validatedData["eventable_id"], $filename, "public");
            $validatedData["image_path"] = $path;
        }

        $feedback = Feedback::create($validatedData);
        return response()->json($feedback->load("user"), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Feedback $feedback)
    {
        // Add authorization if needed (e.g., only admin or feedback owner can view raw feedback details)
        return response()->json($feedback->load("user"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Feedback $feedback)
    {
        if ($feedback->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized to update this feedback."], 403);
        }

        $validator = Validator::make($request->all(), [
            "rating" => "nullable|integer|min:1|max:5",
            "comment" => "nullable|string|max:5000",
            // Image update can be handled by a separate method or by re-uploading
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $feedback->update($validator->validated());
        return response()->json($feedback->load("user"));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Feedback $feedback)
    {
        if ($feedback->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized to delete this feedback."], 403);
        }

        if ($feedback->image_path) {
            Storage::disk("public")->delete($feedback->image_path);
        }
        $feedback->delete();
        return response()->json(null, 204);
    }

    /**
     * Handle uploading of feedback image (alternative to direct store/update).
     */
    public function uploadImage(Request $request, Feedback $feedback)
    {
        if ($feedback->user_id !== Auth::id() /* && !Auth::user()->isAdmin() */) {
            return response()->json(["message" => "Unauthorized to upload image for this feedback."], 403);
        }

        $validator = Validator::make($request->all(), [
            "feedback_image" => "required|image|mimes:jpg,jpeg,png|max:2048", // Max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->hasFile("feedback_image")) {
            // Delete old image if exists
            if ($feedback->image_path) {
                Storage::disk("public")->delete($feedback->image_path);
            }

            $file = $request->file("feedback_image");
            $filename = time() . "_" . $file->getClientOriginalName();
            $event = $feedback->eventable;
            $path = $file->storeAs("feedback_images/" . strtolower(class_basename($event)) . "/" . $event->id, $filename, "public");
            
            $feedback->update(["image_path" => $path]);

            return response()->json(["message" => "Feedback image uploaded successfully.", "path" => $path, "feedback" => $feedback->load("user")]);
        }

        return response()->json(["message" => "No feedback image file found."], 400);
    }
}

