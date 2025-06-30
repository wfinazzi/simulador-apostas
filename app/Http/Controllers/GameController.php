<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(\App\Models\Game::orderBy('match_date', 'asc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'home_team' => 'required|string|max:255',
            'away_team' => 'required|string|max:255',
            'home_odds' => 'required|numeric|min:1',
            'draw_odds' => 'required|numeric|min:1',
            'away_odds' => 'required|numeric|min:1',
            'match_date' => 'required|date',
        ]);

        $game = Game::create($validated);

        return response()->json($game, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'home_team' => 'required|string|max:255',
            'away_team' => 'required|string|max:255',
            'home_odds' => 'required|numeric|min:1',
            'draw_odds' => 'required|numeric|min:1',
            'away_odds' => 'required|numeric|min:1',
            'match_date' => 'required|date',
        ]);

        $game = Game::findOrFail($id);
        $game->update($validated);

        return response()->json($game);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Game::destroy($id);
        return response()->json(['message' => 'Jogo excluído']);
    }
}
