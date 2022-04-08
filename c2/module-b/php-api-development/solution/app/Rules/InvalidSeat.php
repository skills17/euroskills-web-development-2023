<?php

namespace App\Rules;

use App\Models\LocationSeat;
use App\Models\LocationSeatRow;
use App\Models\Show;
use Illuminate\Contracts\Validation\Rule;

class InvalidSeat implements Rule
{
    protected $show;
    protected $seat = [];

    public function __construct(Show $show)
    {
        $this->show = $show;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        foreach ($value as $reservation) {
            $row = LocationSeatRow::find($reservation['row']);
            $seat = $row ? LocationSeat::where('location_seat_row_id', $row->id)->where('number', $reservation['seat'])->first() : null;

            if (!$row || $row->show_id !== $this->show->id || !$seat) {
                $this->seat = ['row' => $row->id ?? $reservation['row'], 'seat' => $reservation['seat']];
                return false;
            }
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Seat '.$this->seat['seat'].' in row '.$this->seat['row'].' is invalid.';
    }
}
