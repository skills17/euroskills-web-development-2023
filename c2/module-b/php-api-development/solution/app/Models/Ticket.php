<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $dates = [
        'created_at',
    ];

    public function loadAllInfo()
    {
        $this->load('seat.row.show.concert.location');

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->booking->name,
            'created_at' => $this->created_at,
            'row' => [
                'id' => $this->seat->row->id,
                'name' => $this->seat->row->name,
            ],
            'seat' => $this->seat->number,
            'show' => $this->seat->row->show,
        ];
    }

    public function booking()
    {
        return $this->belongsTo('App\\Models\\Booking');
    }

    public function seat()
    {
        return $this->hasOne('App\\Models\\LocationSeat');
    }
}
