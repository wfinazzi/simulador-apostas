<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\BetController;
use App\Models\Bet;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/games', [GameController::class, 'index']);
Route::post('/games', [GameController::class, 'store']);
Route::get('/games/{id}', [GameController::class, 'show']); // para buscar 1 jogo
Route::put('/games/{id}', [GameController::class, 'update']); // para atualizar jogo
Route::delete('/games/{id}', [GameController::class, 'destroy']);
Route::post('/bets', [BetController::class, 'store']);
Route::get('/bets', function () {
    return Bet::with('game')->latest()->get();
});
