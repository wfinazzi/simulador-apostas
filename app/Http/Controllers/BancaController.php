<?php

namespace App\Http\Controllers;

use App\Models\Banca;
use Illuminate\Http\Request;

class BancaController extends Controller
{
    /**
     * Retorna todas as bancas cadastradas.
     */
    public function index()
    {
        $bancas = Banca::with('bets')->get()->map(function ($banca) {
            $lucroTotal = $banca->bets ? $banca->bets->sum('lucro_prejuizo') : 0;
            $banca->saldo_atual = $banca->valor_inicial + $lucroTotal;
            return $banca;
        });

        return response()->json($bancas);
    }
    /**
     * Armazena uma nova banca.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'valor_inicial' => 'required|numeric|min:0',
            'data_inicio' => 'nullable|date',
            'observacao' => 'nullable|string',
        ]);

        $banca = Banca::create($validated);

        return response()->json($banca, 201);
    }

    /**
     * Retorna uma banca específica.
     */
    public function show($id)
    {
        $banca = Banca::findOrFail($id);
        return response()->json($banca);
    }

    /**
     * Atualiza uma banca existente.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'valor_inicial' => 'required|numeric|min:0',
            'data_inicio' => 'nullable|date',
            'observacao' => 'nullable|string',
        ]);

        $banca = Banca::findOrFail($id);
        $banca->update($validated);

        return response()->json($banca);
    }

    /**
     * Remove uma banca do banco de dados.
     */
    public function destroy($id)
    {
        Banca::destroy($id);
        return response()->json(['message' => 'Banca excluída com sucesso.']);
    }
}
