<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'capacity',
        'branch',
        'rules',
        'is_bookable',
    ];

    /**
     * Get the reservations for the location.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Get the birthday events for the location.
     */
    public function birthdays()
    {
        return $this->hasMany(Birthday::class);
    }
}

