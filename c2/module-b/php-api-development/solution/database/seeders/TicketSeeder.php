<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\LocationSeat;
use App\Models\Ticket;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $bookings = Booking::get();
        $numSeats = LocationSeat::count();
        $codeCharacters = array_merge(range('A', 'Z'), array_map('strval', range(0, 9)));

        $faker = Factory::create();
        $faker->seed(3);

        foreach ($bookings as $booking) {
            $numTickets = $faker->numberBetween(1, 8);
            $startSeat = 0;

            // find seats in the same row
            while (true) {
                $startSeat = $faker->numberBetween(1, $numSeats);
                $seats = LocationSeat::select(DB::raw('COUNT(*) as seats'))
                    ->where('id', '>=', $startSeat)
                    ->where('id', '<', $startSeat + $numTickets)
                    ->whereNull('ticket_id')
                    ->groupBy('location_seat_row_id')
                    ->get()
                    ->toArray();

                // found if only one row and amount equals expected free seats
                if (count($seats) === 1 && $seats[0]['seats'] === $numTickets) {
                    break;
                }
            }

            for ($i = 0; $i < $numTickets; $i++) {
                $ticket = new Ticket();
                $ticket->booking_id = $booking->id;
                $ticket->code = join('', $faker->randomElements($codeCharacters, 10));
                $ticket->created_at = $booking->created_at;
                $ticket->save();

                $seat = LocationSeat::where('id', $startSeat + $i)->first();
                $seat->ticket_id = $ticket->id;
                $seat->save();
            }
        }
    }
}
