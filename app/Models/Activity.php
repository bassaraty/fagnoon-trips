<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'is_extra',
        'is_active',
    ];

    /**
     * The reservations that include this activity.
     */
    public function reservations()
    {
        return $this->belongsToMany(Reservation::class, 'activity_reservation');
    }

    /**
     * The birthday events that include this activity (as an add-on).
     */
    public function birthdays()
    {
        return $this->belongsToMany(Birthday::class, 'activity_birthday');
    }
}

