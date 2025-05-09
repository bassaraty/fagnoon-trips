<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'location_id',
        'package_id',
        'school_name',
        'school_grade',
        'number_of_students',
        'number_of_supervisors',
        'reservation_date',
        'start_time',
        'end_time',
        'notes',
        'status',
        'payment_status',
    ];

    /**
     * Get the user that made the reservation.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the location for the reservation.
     */
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the package for the reservation.
     */
    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    /**
     * The activities that belong to the reservation.
     */
    public function activities()
    {
        return $this->belongsToMany(Activity::class, 'activity_reservation');
    }

    /**
     * Get all of the payments for the reservation.
     */
    public function payments()
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    /**
     * Get all of the attendees for the reservation.
     */
    public function attendees()
    {
        return $this->morphMany(Attendee::class, 'eventable');
    }
}

