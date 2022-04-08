<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocationSeatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('location_seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_seat_row_id');
            $table->unsignedMediumInteger('number');
            $table->foreignId('reservation_id')->nullable();
            $table->foreignId('ticket_id')->nullable();

            $table->unique(['location_seat_row_id', 'number']);
            $table->foreign('location_seat_row_id')->references('id')->on('location_seat_rows');
            $table->foreign('reservation_id')->references('id')->on('reservations');
            $table->foreign('ticket_id')->references('id')->on('tickets');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('location_seats');
    }
}
