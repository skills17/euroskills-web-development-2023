<?php

namespace App\Http\Controllers\Api\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class CancelController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($ticketId, Request $request)
    {
        $code = $request->get('code');
        $name = $request->get('name');
        $ticket = Ticket::find($ticketId);

        if (!$ticket) {
            return response()->json([
                'error' => 'A ticket with this ID does not exist',
            ], 404);
        } else if ($ticket->code !== $code || $ticket->booking->name !== $name) {
            return response()->json([
                'error' => 'Unauthorized',
            ], 401);
        }

        // update seat
        $ticket->seat->ticket_id = null;
        $ticket->seat->save();

        // delete ticket
        $ticket->delete();

        return response('', 204);
    }
}
