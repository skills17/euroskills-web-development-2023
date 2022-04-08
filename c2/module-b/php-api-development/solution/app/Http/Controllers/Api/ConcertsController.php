<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Concert;
use Illuminate\Http\Request;

class ConcertsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return [
            'concerts' => Concert::orderBy('artist')->with(['location', 'shows'])->orderBy('artist', 'asc')->get(),
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $concert = Concert::with(['location', 'shows'])->find($id);

        if (!$concert) {
            return response()->json([
                'error' => 'A concert with this ID does not exist',
            ], 404);
        }

        return [
            'concert' => $concert,
        ];
    }
}
