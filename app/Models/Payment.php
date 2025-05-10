<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payable_id',
        'payable_type',
        'amount',
        'payment_method',
        'transaction_id',
        'payment_slip_path', // Changed from payment_proof_path
        'status',
        'payment_date',
        'notes',
    ];

    /**
     * Get the parent payable model (reservation or birthday).
     */
    public function payable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user that the payment belongs to.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

