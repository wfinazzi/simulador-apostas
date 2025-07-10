<?php

namespace App\Http\Controllers;

use App\Models\TiposAposta;
use Illuminate\Http\Request;

class TipoApostaController extends Controller
{
    public function index()
    {
        return response()->json(TiposAposta::all());
    }
}
