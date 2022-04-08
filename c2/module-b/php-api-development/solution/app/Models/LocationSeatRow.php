<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocationSeatRow extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $hidden = [
        'order',
    ];

    public function show()
    {
        return $this->belongsTo('App\\Models\\Show');
    }
}
