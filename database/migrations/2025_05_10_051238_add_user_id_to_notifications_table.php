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
        Schema::table("notifications", function (Blueprint $table) {
            $table->unsignedBigInteger("user_id")->nullable()->after("id");
            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");
            $table->index("user_id");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("notifications", function (Blueprint $table) {
            // It's important to drop foreign keys using an array of column names
            // or the specific foreign key name if you defined one.
            // Laravel's default naming convention is {table}_{column}_foreign
            $table->dropForeign("notifications_user_id_foreign");
            $table->dropIndex(["user_id"]); // Drop index by column name
            $table->dropColumn("user_id");
        });
    }
};

