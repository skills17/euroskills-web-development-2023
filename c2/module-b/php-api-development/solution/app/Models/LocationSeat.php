<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocationSeat extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function reservation()
    {
        return $this->belongsTo('App\\Models\\Reservation');
    }

    public function row()
    {
        return $this->belongsTo('App\\Models\\LocationSeatRow', null, null, 'location_seat_row');
    }
}
