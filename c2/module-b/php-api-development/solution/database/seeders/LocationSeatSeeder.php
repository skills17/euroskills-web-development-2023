<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $locationRows = [
            'Oper Graz' => [
                'Stalls 01' => 40, 'Stalls 02' => 39, 'Stalls 03' => 40, 'Stalls 04' => 39, 'Stalls 05' => 40, 'Stalls 06' => 39,
                'Stalls 07' => 40, 'Stalls 08' => 39, 'Stalls 09' => 40, 'Stalls 10' => 39, 'Stalls 11' => 40, 'Stalls 12' => 39,
                'Stalls 13' => 40, 'Stalls 14' => 39, 'Stalls 15' => 40, 'Stalls 16' => 39, 'Stalls 17' => 40, 'Stalls 18' => 39,
                'Terrace 1' => 35, 'Terrace 2' => 30, 'Terrace 3' => 20, 'Terrace 4' => 20, 'Terrace 5' => 20, 'Terrace 6' => 20,
            ],
            'Freilufthalle B' => [
                '1' => 20, '2' => 20, '3' => 20, '4' => 20, '5' => 20, '6' => 17, '7' => 17, '8' => 17, '9' => 20, '10' => 20, '11' => 20, '12' => 20, '13' => 20,
            ],
            'Das Orpheum' => [
                'A' => 15, 'B' => 16, 'C' => 15, 'D' => 16, 'E' => 15, 'F' => 16, 'G' => 15, 'H' => 16, 'I' => 15, 'J' => 16, 'K' => 15, 'L' => 16, 'M' => 15, 'N' => 16,
            ],
        ];

        foreach ($locationRows as $locationName => $rows) {
            $location = DB::table('locations')->where('name', $locationName)->first();
            $shows = DB::table('shows')->leftJoin('concerts', 'shows.concert_id', 'concerts.id')
                ->select(['shows.id'])
                ->orderBy('shows.id')
                ->where('concerts.location_id', $location->id)
                ->get();

            foreach ($shows as $show) {
                $rowNames = array_map(function ($row, $order) use ($show) {
                    return [
                        'name' => $row,
                        'order' => $order,
                        'show_id' => $show->id,
                    ];
                }, array_keys($rows), range(1, count($rows)));

                // insert rows
                DB::table('location_seat_rows')->insert($rowNames);

                // get row ids
                $createdRows = DB::table('location_seat_rows')->where('show_id', $show->id)->get();
                $seats = [];

                foreach ($createdRows as $createdRow) {
                    for ($i = 0; $i < $rows[$createdRow->name]; $i++) {
                        $seats[] = [
                            'location_seat_row_id' => $createdRow->id,
                            'number' => $i + 1,
                        ];
                    }
                }

                // insert seats
                DB::table('location_seats')->insert($seats);
            }
        }
    }
}
