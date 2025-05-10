<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Location;
use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Birthday>
 */
class BirthdayFactory extends Factory
{
    /**
     * Define the model\'s default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'location_id' => Location::factory(),
            'package_id' => Package::factory(),
            'celebrant_name' => $this->faker->name(),
            'celebrant_age' => $this->faker->numberBetween(1, 18),
            'celebrant_birthdate' => $this->faker->date(),
            'celebrant_gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'number_of_guests' => $this->faker->numberBetween(10, 50),
            'event_date' => $this->faker->dateTimeBetween('+1 week', '+1 month')->format('Y-m-d'),
            'start_time' => $this->faker->time('H:i:s'),
            'end_time' => $this->faker->time('H:i:s'),
            'decorations_notes' => $this->faker->optional()->sentence,
            'notes' => $this->faker->optional()->paragraph,
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'cancelled', 'completed']),
            'payment_status' => $this->faker->randomElement(['pending', 'paid', 'partially_paid', 'refunded']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

