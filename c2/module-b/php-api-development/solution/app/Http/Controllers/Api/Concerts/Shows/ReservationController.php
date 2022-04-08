<?php

namespace App\Http\Controllers\Api\Concerts\Shows;

use App\Http\Controllers\Controller;
use App\Models\Concert;
use App\Models\LocationSeat;
use App\Models\Reservation;
use App\Models\Show;
use App\Rules\InvalidSeat;
use App\Rules\SeatTaken;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReservationController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($concertId, $showId, Request $request)
    {
        $concert = Concert::find($concertId);
        $show = Show::find($showId);

        if (!$concert || !$show || $show->concert_id !== $concert->id) {
            return response()->json([
                'error' => 'A concert or show with this ID does not exist',
            ], 404);
        }

        $reservation = null;

        // resolve previous reservation token
        if ($request->get('reservation_token')) {
            $reservation = Reservation::where('token', $request->get('reservation_token'))->first();
            if (!$reservation) {
                return response()->json([
                    'error' => 'Invalid reservation token',
                ], 403);
            }

        // create a new reservation
        } else {
            $reservation = new Reservation();
            $reservation->token = Str::random(32);
        }

        // validate input data
        $request->validate([
            'reservations' => ['present', 'array', new InvalidSeat($show), new SeatTaken($reservation)],
            'duration' => 'integer|between:1,300',
        ]);

        // store new reservation
        $reservation->expires_at = Carbon::now()->addSeconds($request->get('duration', 300));
        $reservation->save();

        // revoke previous reservations on seats in the same show
        $seatsToRevoke = LocationSeat::select('location_seats.*')->leftJoin('location_seat_rows', 'location_seat_rows.id', 'location_seats.location_seat_row_id')
            ->where('location_seat_rows.show_id', $show->id)
            ->where('location_seats.reservation_id', $reservation->id)
            ->get();
        foreach ($seatsToRevoke as $seatToRevoke) {
            $seatToRevoke->reservation_id = null;
            $seatToRevoke->save();
        }

        // reserve all new seats
        foreach ($request->get('reservations') as $seat) {
            $seat = LocationSeat::where('number', $seat['seat'])->where('location_seat_row_id', $seat['row'])->first();
            $seat->reservation_id = $reservation->id;
            $seat->save();
        }

        return response()->json([
            'reserved' => true,
            'reservation_token' => $reservation->token,
            'reserved_until' => $reservation->expires_at,
        ], 201);
    }
}
