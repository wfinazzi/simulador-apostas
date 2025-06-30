<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/games/create', function () {
        return Inertia::render('CreateGame');
    });

    Route::get('/games/list', function () {
        return Inertia::render('GamesList');
    });

    Route::get('/games/{id}/edit', function ($id) {
        $game = \App\Models\Game::findOrFail($id);
        return Inertia::render('EditGame', ['game' => $game]);
    });

    Route::get('/bets/history', function () {
        return Inertia::render('Bets/History');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
