<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('shows')->insert([
            [
                'concert_id' => DB::table('concerts')->where('artist', 'Opus')->first()->id,
                'start' => Carbon::parse('2021-10-02T19:00:00Z'),
                'end' => Carbon::parse('2021-10-02T22:00:00Z'),
            ],
            [
                'concert_id' => DB::table('concerts')->where('artist', 'Bilderbuch')->first()->id,
                'start' => Carbon::parse('2021-10-01T17:00:00Z'),
                'end' => Carbon::parse('2021-10-01T19:00:00Z'),
            ],
            [
                'concert_id' => DB::table('concerts')->where('artist', 'Christina Stürmer')->first()->id,
                'start' => Carbon::parse('2021-10-03T18:00:00Z'),
                'end' => Carbon::parse('2021-10-03T21:00:00Z'),
            ],
            [
                'concert_id' => DB::table('concerts')->where('artist', 'Bilderbuch')->first()->id,
                'start' => Carbon::parse('2021-09-30T20:30:00Z'),
                'end' => Carbon::parse('2021-09-30T22:30:00Z'),
            ],
            [
                'concert_id' => DB::table('concerts')->where('artist', 'Wanda')->first()->id,
                'start' => Carbon::parse('2021-09-30T17:00:00Z'),
                'end' => Carbon::parse('2021-09-30T19:00:00Z'),
            ],
            [
                'concert_id' => DB::table('concerts')->where('artist', 'Wanda')->first()->id,
                'start' => Carbon::parse('2021-10-01T20:30:00Z'),
                'end' => Carbon::parse('2021-10-01T22:30:00Z'),
            ],
        ]);
    }
}
