<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Reservation;
use App\Models\Role; // Assuming Spatie/laravel-permission
use App\Models\Permission; // Assuming Spatie/laravel-permission

class AuthorizationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $adminUser;
    protected $regularUser;
    protected $anotherUser;
    protected $adminRole;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed roles and permissions if not already handled by a global seeder
        // For Spatie/laravel-permission, you might have a RoleSeeder
        $this->artisan("db:seed", ["--class" => "RoleSeeder"]); // Ensure this seeder creates "admin" role

        $this->adminRole = Role::firstOrCreate(["name" => "admin", "guard_name" => "web"]);
        // If your seeder doesn't create it, or for more explicit control:
        // $this->adminRole = Role::firstOrCreate(["name" => "admin"]);

        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole($this->adminRole);

        $this->regularUser = User::factory()->create();
        $this->anotherUser = User::factory()->create();
    }

    public function test_non_owner_cannot_view_another_users_reservation()
    {
        $reservation = Reservation::factory()->create(["user_id" => $this->regularUser->id]);

        $response = $this->actingAs($this->anotherUser, "sanctum")->getJson("/api/reservations/" . $reservation->id);

        $response->assertStatus(403);
    }

    public function test_owner_can_view_their_own_reservation()
    {
        $reservation = Reservation::factory()->create(["user_id" => $this->regularUser->id]);

        $response = $this->actingAs($this->regularUser, "sanctum")->getJson("/api/reservations/" . $reservation->id);

        $response->assertStatus(200)
                 ->assertJsonPath("data.id", $reservation->id);
    }

    public function test_admin_can_view_any_reservation()
    {
        $reservation = Reservation::factory()->create(["user_id" => $this->regularUser->id]);

        $response = $this->actingAs($this->adminUser, "sanctum")->getJson("/api/reservations/" . $reservation->id);

        $response->assertStatus(200)
                 ->assertJsonPath("data.id", $reservation->id);
    }

    public function test_non_owner_cannot_update_another_users_reservation()
    {
        $reservation = Reservation::factory()->create(["user_id" => $this->regularUser->id]);

        $response = $this->actingAs($this->anotherUser, "sanctum")->putJson("/api/reservations/" . $reservation->id, [
            "status" => "cancelled", // Attempt to update
        ]);

        $response->assertStatus(403);
    }

    public function test_owner_can_update_their_own_reservation()
    {
        $reservation = Reservation::factory()->create(["user_id" => $this->regularUser->id, "status" => "confirmed"]);

        $response = $this->actingAs($this->regularUser, "sanctum")->putJson("/api/reservations/" . $reservation->id, [
            "status" => "cancelled",
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath("data.status", "cancelled");
        $this->assertDatabaseHas("reservations", ["id" => $reservation->id, "status" => "cancelled"]);
    }

    public function test_admin_can_update_any_reservation()
    {
        $reservation = Reservation::factory()->create(["user_id" => $this->regularUser->id, "status" => "confirmed"]);

        $response = $this->actingAs($this->adminUser, "sanctum")->putJson("/api/reservations/" . $reservation->id, [
            "status" => "cancelled",
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath("data.status", "cancelled");
        $this->assertDatabaseHas("reservations", ["id" => $reservation->id, "status" => "cancelled"]);
    }

    public function test_non_admin_cannot_access_admin_only_routes()
    {
        // Assuming /api/admin/users is an admin-only route for listing users
        $response = $this->actingAs($this->regularUser, "sanctum")->getJson("/api/admin/users");

        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_only_routes()
    {
        $response = $this->actingAs($this->adminUser, "sanctum")->getJson("/api/admin/users");

        $response->assertStatus(200); // Or whatever success status your admin route returns
    }
}

