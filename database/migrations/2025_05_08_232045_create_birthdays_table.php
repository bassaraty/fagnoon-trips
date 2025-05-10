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
        Schema::create("birthdays", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained()->onDelete("cascade"); // User who made the reservation
            $table->foreignId("location_id")->constrained()->onDelete("cascade");
            $table->foreignId("package_id")->constrained()->onDelete("cascade");
            $table->string("celebrant_name");
            $table->integer("celebrant_age");
            $table->date("celebrant_birthdate")->nullable();
            $table->enum("celebrant_gender", ["male", "female", "other"])->nullable();
            $table->integer("number_of_guests");
            $table->date("event_date");
            $table->time("start_time");
            $table->time("end_time"); // Auto-calculated or based on package
            $table->text("decorations_notes")->nullable();
            $table->text("notes")->nullable();
            $table->enum("status", ["pending", "confirmed", "cancelled", "completed"])->default("pending");
            $table->enum("payment_status", ["unpaid", "paid", "partial"])->default("unpaid");
            $table->timestamps();

            // Add composite unique index
            $table->unique(["location_id", "event_date"]);
        });

        // Pivot table for birthdays and activities (add-ons)
        Schema::create("activity_birthday", function (Blueprint $table) {
            $table->id();
            $table->foreignId("birthday_id")->constrained()->onDelete("cascade");
            $table->foreignId("activity_id")->constrained()->onDelete("cascade"); // For add-ons like face painting, pinata
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("activity_birthday");
        Schema::dropIfExists("birthdays");
    }
};

