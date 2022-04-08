<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Concert extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $hidden = [
        'location_id',
    ];

    public function location()
    {
        return $this->belongsTo('App\\Models\\Location');
    }

    public function shows()
    {
        return $this->hasMany('App\\Models\\Show')->orderBy('start', 'asc');
    }
}
