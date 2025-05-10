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
use Illuminate\Support\Str;

class FeedbackController extends Controller
{
    protected $eventableTypes = [
        "reservation" => Reservation::class,
        "birthday" => Birthday::class,
    ];

    protected function getEventableClass(string $type): ?string
    {
        return $this->eventableTypes[strtolower($type)] ?? null;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Feedback::query()->with("user");

        if ($request->has(["eventable_type", "eventable_id"])) {
            $eventableTypeString = $request->input("eventable_type");
            $eventableId = $request->input("eventable_id");
            $eventableClass = $this->getEventableClass($eventableTypeString);

            if (!$eventableClass) {
                return response()->json(["message" => "Invalid event_type for feedback."], 400);
            }
            $query->where("eventable_type", $eventableClass)->where("eventable_id", $eventableId);
        }

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
            "eventable_type" => ["required", "string", Rule::in(array_keys($this->eventableTypes))],
            "rating" => "nullable|integer|min:1|max:5",
            "comment" => "nullable|string|max:5000",
            "feedback_image" => "nullable|image|mimes:jpg,jpeg,png|max:2048",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();
        $eventableClass = $this->getEventableClass($validatedData["eventable_type"]);

        if (!$eventableClass) {
            return response()->json(["message" => "Invalid eventable_type specified."], 422);
        }

        $event = $eventableClass::find($validatedData["eventable_id"]);

        if (!$event || ($event->user_id !== Auth::id() && !Auth::user()->hasRole("admin"))) {
            return response()->json(["message" => "Event not found or unauthorized to leave feedback."], 403);
        }

        $validatedData["user_id"] = Auth::id();
        $validatedData["eventable_type"] = $eventableClass; // Store the fully qualified class name

        if ($request->hasFile("feedback_image")) {
            $file = $request->file("feedback_image");
            $filename = time() . "_" . $file->getClientOriginalName();
            $path = $file->storeAs("feedback_images/" . strtolower(Str::snake(class_basename($eventableClass))) . "/" . $validatedData["eventable_id"], $filename, "public");
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
        return response()->json($feedback->load("user"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Feedback $feedback)
    {
        if ($feedback->user_id !== Auth::id() && !Auth::user()->hasRole("admin")) {
            return response()->json(["message" => "Unauthorized to update this feedback."], 403);
        }

        $validator = Validator::make($request->all(), [
            "rating" => "nullable|integer|min:1|max:5",
            "comment" => "nullable|string|max:5000",
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
        if ($feedback->user_id !== Auth::id() && !Auth::user()->hasRole("admin")) {
            return response()->json(["message" => "Unauthorized to delete this feedback."], 403);
        }

        if ($feedback->image_path) {
            Storage::disk("public")->delete($feedback->image_path);
        }
        $feedback->delete();
        return response()->json(null, 204);
    }

    /**
     * Handle uploading of feedback image.
     */
    public function uploadImage(Request $request, Feedback $feedback)
    {
        if ($feedback->user_id !== Auth::id() && !Auth::user()->hasRole("admin")) {
            return response()->json(["message" => "Unauthorized to upload image for this feedback."], 403);
        }

        $validator = Validator::make($request->all(), [
            "feedback_image" => "required|image|mimes:jpg,jpeg,png|max:2048",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->hasFile("feedback_image")) {
            if ($feedback->image_path) {
                Storage::disk("public")->delete($feedback->image_path);
            }

            $file = $request->file("feedback_image");
            $filename = time() . "_" . $file->getClientOriginalName();
            $event = $feedback->eventable;
            $path = $file->storeAs("feedback_images/" . strtolower(Str::snake(class_basename($event))) . "/" . $event->id, $filename, "public");
            
            $feedback->update(["image_path" => $path]);

            return response()->json(["message" => "Feedback image uploaded successfully.", "path" => $path, "feedback" => $feedback->load("user")]);
        }

        return response()->json(["message" => "No feedback image file found."], 400);
    }
}

