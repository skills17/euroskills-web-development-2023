<?php

namespace App\Rules;

use App\Models\LocationSeat;
use App\Models\LocationSeatRow;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Rule;

class SeatTaken implements Rule
{
    protected $reservation = null;
    protected $failedReservation = [];

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
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

            if ($seat && $seat->reservation_id !== null) {
                if ($seat->reservation_id !== $this->reservation->id && $seat->reservation->expires_at->greaterThan(Carbon::now())) {
                    $this->failedReservation = ['row' => $row->id, 'seat' => $seat->number];
                    return false;
                }
            } else if ($seat && $seat->ticket_id !== null) {
                $this->failedReservation = ['row' => $row->id, 'seat' => $seat->number];
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
        return 'Seat '.$this->failedReservation['seat'].' in row '.$this->failedReservation['row'].' is already taken.';
    }
}
