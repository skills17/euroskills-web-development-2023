<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConcertSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('concerts')->insert([
            [
                'artist' => 'Opus',
                'location_id' => DB::table('locations')->where('name', 'Oper Graz')->first()->id,
            ],
            [
                'artist' => 'Bilderbuch',
                'location_id' => DB::table('locations')->where('name', 'Das Orpheum')->first()->id,
            ],
            [
                'artist' => 'Wanda',
                'location_id' => DB::table('locations')->where('name', 'Freilufthalle B')->first()->id,
            ],
            [
                'artist' => 'Christina Stürmer',
                'location_id' => DB::table('locations')->where('name', 'Das Orpheum')->first()->id,
            ],
        ]);
    }
}
