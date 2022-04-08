<?php

namespace App\Http\Controllers\Api\Concerts\Shows;

use App\Http\Controllers\Controller;
use App\Models\Concert;
use App\Models\LocationSeatRow;
use App\Models\Show;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SeatingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($concertId, $showId)
    {
        $concert = Concert::find($concertId);
        $show = Show::find($showId);

        if (!$concert || !$show || $show->concert_id !== $concert->id) {
            return response()->json([
                'error' => 'A concert or show with this ID does not exist',
            ], 404);
        }

        // join seats and include total number and unavailable seats directly in the query to improve performance
        $rows = LocationSeatRow::select([
            'location_seat_rows.id',
            'location_seat_rows.name',
            DB::raw('COUNT(*) AS seats_total'),
            DB::raw('GROUP_CONCAT(IF((location_seats.reservation_id IS NULL OR reservations.expires_AT < NOW()) AND location_seats.ticket_id IS NULL, NULL, location_seats.number) ORDER BY location_seats.number ASC SEPARATOR \',\') AS seats_unavailable')
        ])->leftJoin('location_seats', 'location_seats.location_seat_row_id', 'location_seat_rows.id')
            ->leftJoin('reservations', 'reservations.id', 'location_seats.reservation_id')
            ->where('location_seat_rows.show_id', $show->id)
            ->groupBy(['location_seat_rows.id', 'location_seat_rows.name'])
            ->orderBy('location_seat_rows.order', 'asc')
            ->get();

        return [
            'rows' => $rows->map(function ($row) {
                return [
                    'id' => $row->id,
                    'name' => $row->name,
                    'seats' => [
                        'total' => $row->seats_total,
                        'unavailable' => $row->seats_unavailable ? array_map('intval', explode(',', $row->seats_unavailable)) : [],
                    ],
                ];
            }),
        ];
    }
}
