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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address')->nullable(); // Added
            $table->string('city')->nullable(); // Added
            $table->string('state')->nullable(); // Added
            $table->string('zip_code')->nullable(); // Added
            $table->string('branch')->nullable(); // Added
            $table->integer('max_capacity')->nullable(); // Changed from capacity
            $table->text('description')->nullable(); // Added
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};

