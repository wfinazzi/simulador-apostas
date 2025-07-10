<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\BetController;
use App\Http\Controllers\TipoApostaController;
use App\Http\Controllers\BancaController;
use App\Http\Controllers\DashboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Banca
Route::get('/bancas', [BancaController::class, 'index']);
Route::post('/bancas', [BancaController::class, 'store']);
Route::get('/bancas/{id}', [BancaController::class, 'show']);
Route::put('/bancas/{id}', [BancaController::class, 'update']);
Route::delete('/bancas/{id}', [BancaController::class, 'destroy']);

// Tipos de Aposta
Route::get('/tipos_apostas', [TipoApostaController::class, 'index']);

// Apostas
Route::get('/bets', [BetController::class, 'index']);
Route::post('/bets', [BetController::class, 'store']);
Route::get('/bets/{id}', [BetController::class, 'show']);
Route::put('/bets/{id}', [BetController::class, 'update']);
Route::delete('/bets/{id}', [BetController::class, 'destroy']);

// Estatísticas e status
Route::get('/apostas/estatisticas', [BetController::class, 'estatisticas']);
Route::get('/apostas/status', [BetController::class, 'status']);

Route::get('/dashboard', [DashboardController::class, 'index']);
