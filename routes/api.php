<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController; // Assuming this remains or is handled by Breeze
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\BirthdayController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AttendeeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\FeedbackController; 
// Keep Admin and other specific controllers if they are not part of the current refactoring scope
use App\Http\Controllers\Api\CalendarViewController;
use App\Http\Controllers\Api\CardViewController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\LocationController as AdminLocationController;
use App\Http\Controllers\Api\Admin\PackageController as AdminPackageController;
use App\Http\Controllers\Api\Admin\ActivityController as AdminActivityController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Authentication Routes (Likely handled by Laravel Breeze, verify if AuthController needs to be App\Http\Controllers\Auth or similar)
Route::post("/register", [AuthController::class, "register"]);
Route::post("/login", [AuthController::class, "login"]);

Route::middleware("auth:sanctum")->group(function () {
    Route::post("/logout", [AuthController::class, "logout"]);
    Route::get("/user", function (Request $request) {
        return $request->user()->load("roles"); // Load roles with user
    });

    // Resource Routes for new controllers
    Route::apiResource("reservations", ReservationController::class);
    Route::apiResource("birthdays", BirthdayController::class);
    Route::apiResource("locations", LocationController::class);
    Route::apiResource("packages", PackageController::class);
    Route::apiResource("activities", ActivityController::class);
    Route::apiResource("attendees", AttendeeController::class);
    Route::apiResource("notifications", NotificationController::class)->except(["store", "update", "destroy"]); // System generated
    Route::apiResource("payments", PaymentController::class);
    Route::apiResource("feedback", FeedbackController::class); 

    // Specific route for uploading payment slip
    Route::post("payments/{payment}/upload-slip", [PaymentController::class, "uploadSlip"])->name("payments.uploadSlip");
    // Specific route for uploading feedback image
    Route::post("feedback/{feedback}/upload-image", [FeedbackController::class, "uploadImage"])->name("feedback.uploadImage");
    // Specific route for attendee check-in
    Route::post("attendees/{attendee}/check-in", [AttendeeController::class, "checkIn"])->name("attendees.checkIn");


    // Specific notification routes
    Route::get("notifications/unread-count", [NotificationController::class, "unreadCount"])->name("notifications.unreadCount");
    Route::post("notifications/{notification}/mark-as-read", [NotificationController::class, "markAsRead"])->name("notifications.markAsRead");
    Route::post("notifications/mark-all-as-read", [NotificationController::class, "markAllAsRead"])->name("notifications.markAllAsRead");

    // Publicly accessible data for forms, etc. (using index methods of new controllers)
    // Example: GET /api/locations, GET /api/packages, GET /api/activities

    // Calendar and Card View Routes (Keep as is if not in current scope)
    Route::get("calendar-view", [CalendarViewController::class, "index"]);
    Route::get("card-view", [CardViewController::class, "index"]);

    // Admin Panel Routes (Protected by admin role/permission)
    Route::prefix("admin")->name("admin.")->middleware(["auth:sanctum", "role:admin"])->group(function () {
        Route::apiResource("users", AdminUserController::class);
        Route::apiResource("locations", AdminLocationController::class); 
        Route::apiResource("packages", AdminPackageController::class);   
        Route::apiResource("activities", AdminActivityController::class); 
    });
});


