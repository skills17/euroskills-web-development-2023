<?php

namespace App\Http\Controllers\Api\Concerts\Shows;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Concert;
use App\Models\Reservation;
use App\Models\Show;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
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

        // validate input data
        $request->validate([
            'reservation_token' => 'required',
            'name' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'zip' => 'required|string',
            'country' => 'required|string',
        ]);

        // validate reservation
        $reservation = Reservation::where('token', $request->get('reservation_token'))->first();
        if (!$reservation || !$reservation->expires_at->greaterThan(Carbon::now())) {
            return response()->json([
                'error' => 'Unauthorized',
            ], 401);
        }

        // get reserved seats
        $seats = $reservation->seats->load('row')->filter(function ($seat) use ($show) {
            return $seat->row->show_id === $show->id;
        })->sortBy([['row.order', 'asc'], ['number', 'asc']]);

        // create booking
        $booking = new Booking($request->all());
        $booking->save();

        // create tickets for seats
        $tickets = [];
        foreach ($seats as $seat) {
            $ticket = new Ticket();
            $ticket->code = Str::upper(Str::random(10));
            $ticket->booking_id = $booking->id;
            $ticket->save();
            $ticket->refresh();

            $seat->reservation_id = null;
            $seat->ticket_id = $ticket->id;
            $seat->save();

            $tickets[] = $ticket;
        }

        return response()->json(['tickets' => array_map(function ($ticket) {
            return $ticket->loadAllInfo();
        }, $tickets)], 201);
    }
}
