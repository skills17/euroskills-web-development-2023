<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $dates = [
        'expires_at',
    ];

    public function seats()
    {
        return $this->hasMany('App\\Models\\LocationSeat');
    }
}
