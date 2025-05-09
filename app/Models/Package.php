<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'number_of_activities',
        'type',
        'is_active',
    ];

    /**
     * Get the reservations that use this package.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Get the birthday events that use this package.
     */
    public function birthdays()
    {
        return $this->hasMany(Birthday::class);
    }
}

