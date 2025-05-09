<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase; // Ensures a clean database for each test

    /**
     * Test successful user registration.
     *
     * @return void
     */
    public function test_user_can_register_successfully(): void
    {
        $userData = [
            "name" => "Test User",
            "email" => "test@example.com",
            "password" => "password123",
            "password_confirmation" => "password123",
        ];

        $response = $this->postJson("/api/register", $userData);

        $response->assertStatus(201) // Or whatever your API returns for successful registration
                 ->assertJsonStructure([
                     "message", // Assuming a message is returned
                     "user" => [
                         "id",
                         "name",
                         "email",
                         "created_at",
                         "updated_at"
                     ],
                     "token" // Assuming a token is returned upon registration
                 ]);

        $this->assertDatabaseHas("users", [
            "email" => "test@example.com",
        ]);
    }

    /**
     * Test successful user login.
     *
     * @return void
     */
    public function test_user_can_login_successfully(): void
    {
        $user = User::factory()->create([
            "email" => "login@example.com",
            "password" => Hash::make("password123"),
        ]);

        $loginData = [
            "email" => "login@example.com",
            "password" => "password123",
        ];

        $response = $this->postJson("/api/login", $loginData);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     "message",
                     "user" => [
                         "id",
                         "name",
                         "email",
                     ],
                     "token"
                 ]);
        $this->assertAuthenticatedAs($user);
    }

    /**
     * Test failed login with wrong credentials.
     *
     * @return void
     */
    public function test_login_fails_with_wrong_credentials(): void
    {
        User::factory()->create([
            "email" => "wronglogin@example.com",
            "password" => Hash::make("password123"),
        ]);

        $loginData = [
            "email" => "wronglogin@example.com",
            "password" => "wrongpassword",
        ];

        $response = $this->postJson("/api/login", $loginData);

        $response->assertStatus(401); // Or 422 if validation error for credentials mismatch
        $this->assertGuest();
    }

    /**
     * Test user logout.
     *
     * @return void
     */
    public function test_user_can_logout_successfully(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken("test-token")->plainTextToken;

        $response = $this->withHeaders([
            "Authorization" => "Bearer " . $token,
        ])->postJson("/api/logout");

        $response->assertStatus(200) // Or 204 if no content is returned
                 ->assertJson(["message" => "Logged out successfully"]); // Adjust based on your API response
        
        // Check if the token is revoked (if using Sanctum with personal access tokens)
        // This part depends on how your logout is implemented. 
        // If tokens are deleted from the database, you can assert that.
        // $this->assertDatabaseMissing("personal_access_tokens", ["tokenable_id" => $user->id]);
    }
}

