<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Location;
use App\Models\Reservation;
use App\Models\Package; // Added Package model
use Carbon\Carbon;

class BookingTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed necessary data or roles if required for tests
        $this->artisan("db:seed", ["--class" => "RoleSeeder"]); // Assuming you have a RoleSeeder
        // Seed packages if your PackageFactory is set up
        // Package::factory()->count(1)->create(); // Ensure at least one package exists or create specific one for test
    }

    public function test_user_can_book_a_reservation_when_location_is_free()
    {
        $user = User::factory()->create();
        $location = Location::factory()->create();
        $package = Package::factory()->create(); // Create a package
        $reservationDate = Carbon::tomorrow()->toDateString();

        $response = $this->actingAs($user, "sanctum")->postJson("/api/reservations", [
            "location_id" => $location->id,
            // "user_id" => $user->id, // Controller should use Auth::id()
            "package_id" => $package->id, // Use the created package_id
            "reservation_date" => $reservationDate,
            "start_time" => "10:00:00",
            // "end_time" => "12:00:00", // end_time is calculated by controller based on package duration
            // "status" => "confirmed", // Default status should be handled by controller or model
            "school_name" => "Test School",
            "school_grade" => "10th Grade",
            "number_of_students" => 20,
            "number_of_supervisors" => 2,
            "notes" => "Some notes for the reservation.",
            "activity_ids" => [], // Assuming activities are optional or handled
            // Add other required fields for reservation based on your controller validation
            // "num_adults" => 2, // These seem to be for a different type of reservation or are optional
            // "num_children" => 1,
        ]);

        $response->assertStatus(201) // Expect 201 for successful creation
                 ->assertJsonPath("data.location_id", $location->id)
                 ->assertJsonPath("data.package_id", $package->id)
                 ->assertJsonPath("data.reservation_date", $reservationDate);

        $this->assertDatabaseHas("reservations", [
            "location_id" => $location->id,
            "package_id" => $package->id,
            "reservation_date" => $reservationDate,
            "user_id" => $user->id,
        ]);
    }

    public function test_user_cannot_book_a_reservation_when_location_is_conflicting()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $location = Location::factory()->create();
        $package = Package::factory()->create(); // Create a package for the conflicting reservation
        $conflictingPackage = Package::factory()->create(); // Create a package for the new reservation attempt

        $reservationDate = Carbon::tomorrow()->toDateString();

        // Create an existing reservation that would conflict
        Reservation::factory()->create([
            "location_id" => $location->id,
            "user_id" => $otherUser->id,
            "package_id" => $package->id,
            "reservation_date" => $reservationDate,
            "start_time" => "10:00:00", // Example start time
            // end_time will be based on package duration
            "status" => "confirmed",
        ]);

        $response = $this->actingAs($user, "sanctum")->postJson("/api/reservations", [
            "location_id" => $location->id,
            "package_id" => $conflictingPackage->id,
            "reservation_date" => $reservationDate, // Same date, same location
            "start_time" => "10:00:00", // Same start time, should conflict due to unique rule on date & location
            "school_name" => "Test School New",
            "school_grade" => "11th Grade",
            "number_of_students" => 15,
            "number_of_supervisors" => 1,
        ]);

        // The unique rule on (location_id, reservation_date) should cause a 422 validation error
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(["reservation_date"]);

        // Ensure the new reservation was NOT created
        $this->assertDatabaseCount("reservations", 1); // Only the initial one should exist
    }
}

