<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Birthday extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'location_id',
        'package_id',
        'celebrant_name',
        'celebrant_age',
        'celebrant_birthdate',
        'celebrant_gender',
        'number_of_guests',
        'event_date',
        'start_time',
        'end_time',
        'decorations_notes',
        'notes',
        'status',
        'payment_status',
    ];

    /**
     * Get the user that made the birthday reservation.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the location for the birthday event.
     */
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the package for the birthday event.
     */
    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    /**
     * The activities (add-ons) that belong to the birthday event.
     */
    public function activities()
    {
        return $this->belongsToMany(Activity::class, 'activity_birthday');
    }

    /**
     * Get all of the payments for the birthday event.
     */
    public function payments()
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    /**
     * Get all of the attendees for the birthday event.
     */
    public function attendees()
    {
        return $this->morphMany(Attendee::class, 'eventable');
    }
}

