<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::resource('v1/concerts', 'App\\Http\\Controllers\\Api\\ConcertsController');
Route::resource('v1/concerts/{concertId}/shows/{showId}/seating', 'App\\Http\\Controllers\\Api\\Concerts\\Shows\\SeatingController');
Route::resource('v1/concerts/{concertId}/shows/{showId}/reservation', 'App\\Http\\Controllers\\Api\\Concerts\\Shows\\ReservationController');
Route::resource('v1/concerts/{concertId}/shows/{showId}/booking', 'App\\Http\\Controllers\\Api\\Concerts\\Shows\\BookingController');
Route::resource('v1/tickets', 'App\\Http\\Controllers\\Api\\TicketsController');
Route::resource('v1/tickets/{ticketId}/cancel', 'App\\Http\\Controllers\\Api\\Tickets\\CancelController');
