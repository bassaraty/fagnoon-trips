<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan("db:seed", ["--class" => "RoleSeeder"]);
    }

    public function test_payment_slip_can_be_uploaded_for_a_payment()
    {
        Storage::fake("public"); // Fake the public disk

        $user = User::factory()->create();
        $reservation = Reservation::factory()->create(["user_id" => $user->id]);
        $payment = Payment::factory()->create([
            "payable_id" => $reservation->id,
            "payable_type" => Reservation::class,
            "user_id" => $user->id,
        ]);

        $file = UploadedFile::fake()->image("payment_slip.jpg");

        $response = $this->actingAs($user, "sanctum")
                         ->postJson("/api/payments/{$payment->id}/upload-slip", [
                             "payment_slip" => $file,
                         ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(["message", "path", "payment"]);
        
        $payment->refresh();
        $this->assertNotNull($payment->payment_slip_path);
        Storage::disk("public")->assertExists($payment->payment_slip_path);
    }

    public function test_payment_slip_upload_rejects_invalid_file_types()
    {
        Storage::fake("public");

        $user = User::factory()->create();
        $reservation = Reservation::factory()->create(["user_id" => $user->id]);
        $payment = Payment::factory()->create([
            "payable_id" => $reservation->id,
            "payable_type" => Reservation::class,
            "user_id" => $user->id,
        ]);

        $file = UploadedFile::fake()->create("document.txt", 100, "text/plain");

        $response = $this->actingAs($user, "sanctum")
                         ->postJson("/api/payments/{$payment->id}/upload-slip", [
                             "payment_slip" => $file,
                         ]);

        $response->assertStatus(422) // Validation error
                 ->assertJsonValidationErrors("payment_slip");
        
        $payment->refresh();
        $this->assertNull($payment->payment_slip_path);
    }

    // Similar tests can be added for Feedback image uploads if that endpoint exists
    // e.g., test_feedback_image_can_be_uploaded()
    // e.g., test_feedback_image_upload_rejects_invalid_file_types()
}

