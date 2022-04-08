<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketsController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $code = $request->get('code');
        $name = $request->get('name');

        if (!$code || !$name) {
            return response()->json([
                'error' => 'Unauthorized',
            ], 401);
        }

        // resolve the specified ticket
        $ticket = Ticket::select('tickets.*')->leftJoin('bookings', 'bookings.id', 'tickets.booking_id')
            ->where('bookings.name', $name)
            ->where('tickets.code', $code)
            ->first();

        if (!$ticket) {
            return response()->json([
                'error' => 'Unauthorized',
            ], 401);
        }

        $allTickets = Ticket::select('tickets.*')->leftJoin('location_seats', 'location_seats.ticket_id', 'tickets.id')
            ->leftJoin('location_seat_rows', 'location_seat_rows.id', 'location_seats.location_seat_row_id')
            ->where('tickets.booking_id', $ticket->booking_id)
            ->orderBy('location_seat_rows.order', 'asc')
            ->orderBy('location_seats.number', 'asc')
            ->get();

        return ['tickets' => $allTickets->map(function ($ticket) {
            return $ticket->loadAllInfo();
        })];
    }
}
