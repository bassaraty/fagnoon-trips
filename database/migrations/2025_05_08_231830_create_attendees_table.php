<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create(
            'attendees',
            function (Blueprint $table) {
                $table->id();
                // Polymorphic relationship to link attendees to either a reservation (trip) or a birthday event
                $table->morphs('eventable'); // Will create eventable_id and eventable_type
                $table->string('name');
                $table->string('phone')->nullable();
                $table->integer('adult_count')->default(0);
                $table->integer('kid_count')->default(0);
                $table->timestamp('check_in_time')->nullable();
                $table->timestamps();
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendees');
    }
};
