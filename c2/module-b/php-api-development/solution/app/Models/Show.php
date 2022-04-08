<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Show extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $hidden = [
        'concert_id',
    ];

    protected $dates = [
        'start',
        'end',
    ];

    public function concert()
    {
        return $this->belongsTo('App\\Models\\Concert');
    }
}
