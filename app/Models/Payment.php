<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payable_id',
        'payable_type',
        'amount',
        'payment_method',
        'transaction_id',
        'payment_proof_path',
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
}

