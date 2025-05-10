<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Feedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', // The user who submitted the feedback
        'eventable_id', // Polymorphic relation ID (e.g., Reservation ID or Birthday ID)
        'eventable_type', // Polymorphic relation type (e.g., App\Models\Reservation)
        'rating', // e.g., 1-5 stars
        'comment', // Textual feedback
        'image_path', // Path to an uploaded image for the feedback
    ];

    /**
     * Get the user who submitted the feedback.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent eventable model (reservation or birthday).
     */
    public function eventable(): MorphTo
    {
        return $this->morphTo();
    }
}

