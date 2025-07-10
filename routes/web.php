<?php

use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/bets/create', function () {
        return Inertia::render('Bets/CreateBet');
    });

    Route::get('/bets/list', function () {
        return Inertia::render('BetsList');
    });

    Route::get('/bets/{id}/edit', function ($id) {
        $bet = \App\Models\Bet::findOrFail($id);
        return Inertia::render('Bets/EditBet', ['bet' => $bet]);
    });

    Route::get('/bets/history', function () {
        return Inertia::render('Bets/History');
    });

    Route::get('/bancas/list', function () {
        return Inertia::render('Banca/ListBancas');
    });

    Route::get('/bancas/create', function () {
        return Inertia::render('Banca/CreateBanca');
    });

    Route::get('/bancas/{id}/edit', function ($id) {
        $banca = \App\Models\Banca::findOrFail($id);
        return Inertia::render('Banca/EditBanca', ['banca' => $banca]);
    });
});

Route::get('/auth/google/redirect', function () {
    return Socialite::driver('google')->redirect();
})->name('auth.google.redirect');

Route::get('/auth/google/callback', function () {
    try {
        $googleUser = Socialite::driver('google')->user();

        // Encontrar usuário existente ou criar um novo
        $user = User::updateOrCreate(
            [
                'email' => $googleUser->getEmail(),
            ],
            [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'password' => bcrypt(Str::random(16)), // Senha aleatória para usuários do Google
                // Você pode adicionar mais campos se precisar
            ]
        );

        Auth::login($user);

        // Redirecionar para o dashboard ou para a página inicial
        return redirect('/dashboard'); // Ou qualquer rota que você queira

    } catch (\Exception $e) {
        // Lidar com erros de autenticação
        return redirect('/login')->withErrors(['google_login' => 'Não foi possível fazer login com o Google.']);
    }
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
