<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Location;
use App\Models\Package;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class ReservationFlowTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Location $location;
    protected Package $package;

    protected function setUp(): void
    {
        parent::setUp();
        // Create a user and authenticate
        $this->user = User::factory()->create();
        $this->actingAs($this->user);

        // Create necessary related data
        $this->location = Location::factory()->create(["name" => "Test Location"]);
        $this->package = Package::factory()->create(["name" => "Test Package"]);
    }

    /**
     * Test creating a trip reservation with valid data.
     *
     * @return void
     */
    public function test_can_create_trip_reservation_with_valid_data(): void
    {
        $reservationData = [
            "user_id" => $this->user->id,
            "location_id" => $this->location->id,
            "package_id" => $this->package->id,
            "reservation_date" => Carbon::tomorrow()->toDateString(),
            "start_time" => "10:00:00",
            "adult_count" => 2,
            "kid_count" => 1,
            "status" => "confirmed", // Assuming default status or provided
            "event_type" => "trip",
            "total_price" => 100.00 // Assuming price is calculated or provided
        ];

        $response = $this->postJson("/api/reservations", $reservationData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     "id",
                     "user_id",
                     "location_id",
                     "package_id",
                     "reservation_date",
                     "status"
                 ])
                 ->assertJson($reservationData); // Check if the response contains the input data

        $this->assertDatabaseHas("reservations", [
            "user_id" => $this->user->id,
            "location_id" => $this->location->id,
            "package_id" => $this->package->id,
            "event_type" => "trip"
        ]);
    }

    /**
     * Test failing to create a reservation with a missing required field.
     *
     * @return void
     */
    public function test_cannot_create_reservation_with_missing_required_field(): void
    {
        $reservationData = [
            // Missing location_id
            "user_id" => $this->user->id,
            "package_id" => $this->package->id,
            "reservation_date" => Carbon::tomorrow()->toDateString(),
            "start_time" => "10:00:00",
            "event_type" => "trip",
        ];

        $response = $this->postJson("/api/reservations", $reservationData);

        $response->assertStatus(422) // Unprocessable Entity for validation errors
                 ->assertJsonValidationErrors(["location_id"]);
    }

    /**
     * Test updating a trip reservation.
     *
     * @return void
     */
    public function test_can_update_trip_reservation(): void
    {
        $reservation = Reservation::factory()->create([
            "user_id" => $this->user->id,
            "location_id" => $this->location->id,
            "package_id" => $this->package->id,
            "event_type" => "trip",
            "adult_count" => 1
        ]);

        $updateData = [
            "adult_count" => 2,
            "status" => "updated_status"
        ];

        $response = $this->putJson("/api/reservations/" . $reservation->id, $updateData);

        $response->assertStatus(200)
                 ->assertJsonFragment(["adult_count" => 2, "status" => "updated_status"]);

        $this->assertDatabaseHas("reservations", [
            "id" => $reservation->id,
            "adult_count" => 2,
            "status" => "updated_status"
        ]);
    }

    /**
     * Test deleting a trip reservation.
     *
     * @return void
     */
    public function test_can_delete_trip_reservation(): void
    {
        $reservation = Reservation::factory()->create([
            "user_id" => $this->user->id,
            "location_id" => $this->location->id,
            "package_id" => $this->package->id,
            "event_type" => "trip"
        ]);

        $response = $this->deleteJson("/api/reservations/" . $reservation->id);

        $response->assertStatus(204); // No Content for successful deletion
        $this->assertDatabaseMissing("reservations", ["id" => $reservation->id]);
    }

    /**
     * Test one booking per location per day conflict scenario.
     *
     * @return void
     */
    public function test_one_booking_per_location_per_day_conflict(): void
    {
        $date = Carbon::tomorrow()->toDateString();
        // First reservation
        Reservation::factory()->create([
            "user_id" => $this->user->id,
            "location_id" => $this->location->id,
            "package_id" => $this->package->id,
            "reservation_date" => $date,
            "event_type" => "trip",
            "status" => "confirmed"
        ]);

        // Attempt to create a second reservation for the same user, location, and date
        $conflictingReservationData = [
            "user_id" => $this->user->id,
            "location_id" => $this->location->id,
            "package_id" => Package::factory()->create()->id, // Different package
            "reservation_date" => $date,
            "start_time" => "14:00:00",
            "adult_count" => 1,
            "kid_count" => 0,
            "status" => "confirmed",
            "event_type" => "trip",
            "total_price" => 50.00
        ];

        $response = $this->postJson("/api/reservations", $conflictingReservationData);
        
        // The expected status code depends on how the business rule is enforced.
        // It could be 422 (validation error) or 409 (Conflict), or other.
        // Assuming the ReservationController store method has this validation.
        $response->assertStatus(422) // Or 409, adjust as per your implementation
                 ->assertJsonValidationErrors(["reservation_date"]); // Or a custom error message key
    }
}

