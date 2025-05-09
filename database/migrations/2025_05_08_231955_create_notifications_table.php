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
            'notifications',
            function (Blueprint $table) {
                $table->uuid('id')->primary(); // Using UUID for notifications as per Laravel's convention
                $table->string('type'); // Class name of the notification
                $table->morphs('notifiable'); // User who receives the notification
                $table->text('data'); // JSON-encoded notification data
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
