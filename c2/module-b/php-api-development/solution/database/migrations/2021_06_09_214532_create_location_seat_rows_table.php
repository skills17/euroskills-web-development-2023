<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocationSeatRowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('location_seat_rows', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->unsignedMediumInteger('order');
            $table->foreignId('show_id');

            $table->unique(['name', 'show_id']);
            $table->unique(['order', 'show_id']);
            $table->foreign('show_id')->references('id')->on('shows');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('location_seat_rows');
    }
}
