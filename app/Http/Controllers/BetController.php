<?php

namespace App\Http\Controllers;

use App\Models\Bet;
use Illuminate\Http\Request;

class BetController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'game_id' => 'required|exists:games,id',
            'bet_option' => 'required|in:home,draw,away',
            'amount' => 'required|numeric|min:1',
        ]);

        // Deixe o user_id como null por enquanto
        $userId = null;

        // Se você já planeja autenticação no futuro, o código pode ser reabilitado
        // $userId = auth()->user() ? auth()->id() : null;

        // Criação da aposta
        $bet = Bet::create([
            'game_id' => $validated['game_id'],
            'bet_option' => $validated['bet_option'],
            'amount' => $validated['amount'],
            'user_id' => $userId, // user_id pode ser null por enquanto
            'odd_at_bet' => 1.5, // Defina um valor de exemplo para as odds
            'status' => 'pending', // Define o status inicial da aposta
            'return_amount' => 0, // Inicialize o valor de retorno
        ]);

        return response()->json($bet, 201);
    }
}
