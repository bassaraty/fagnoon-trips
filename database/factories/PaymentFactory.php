<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\Birthday;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Randomly choose between Reservation and Birthday for the payable type
        $payableType = $this->faker->randomElement([
            Reservation::class,
            Birthday::class
        ]);

        // Create a factory for the chosen payable type to get a valid ID
        // This assumes ReservationFactory and BirthdayFactory exist and are set up correctly
        $payable = $payableType::factory()->create();

        return [
            'payable_id' => $payable->id,
            'payable_type' => $payableType,
            'amount' => $this->faker->randomFloat(2, 50, 500), // Adjusted amount range
            'payment_method' => $this->faker->randomElement(['credit_card', 'bank_transfer', 'cash']),
            'transaction_id' => Str::random(20), // Using Str::random for a simpler transaction ID
            'payment_proof_path' => null, // Default to null, can be set in tests if needed
            'status' => $this->faker->randomElement(['pending', 'completed', 'failed', 'refunded']),
            'payment_date' => $this->faker->dateTimeThisMonth(),
            'notes' => $this->faker->optional()->sentence,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

