<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            LocationSeeder::class,
            ConcertSeeder::class,
            ShowSeeder::class,
            LocationSeatSeeder::class,
            BookingSeeder::class,
            TicketSeeder::class,
        ]);
    }
}
