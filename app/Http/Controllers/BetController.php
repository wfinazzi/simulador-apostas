<?php

namespace App\Http\Controllers;

use App\Models\Aposta;
use App\Models\Status;

use Illuminate\Http\Request;

class BetController extends Controller
{
    public function index()
    {
        $apostas = \App\Models\Aposta::with(['banca', 'tipoAposta', 'status'])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($aposta) {
            return [
                'id' => $aposta->id,
                'time_casa' => $aposta->time_casa,
                'time_visitante' => $aposta->time_visitante,
                'tipo_aposta_nome' => $aposta->tipoAposta->nome ?? '—',
                'stake' => $aposta->amount,
                'odd_entrada' => $aposta->odd_at_bet,
                'resultado' => $aposta->status->nome ?? '—',
                'valor_lucro_prejuizo' => $aposta->return_amount,
                'data_jogo' => $aposta->data_jogo,
            ];
        });

        return response()->json($apostas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'banca_id' => 'required|exists:bancas,id',
            'bet_option' => 'required|integer|exists:tipos_apostas,id',
            'amount' => 'required|numeric|min:0.01',
            'odd_at_bet' => 'required|numeric|min:1',
            'status_id' => 'required|integer|exists:statuses,id',
            'time_casa' => 'required|string|max:255',
            'time_visitante' => 'required|string|max:255',
            'return_amount' => 'nullable|numeric',
            'data_jogo' => 'required|date',
        ]);

        $aposta = Aposta::create($validated);

        return response()->json($aposta, 201);
    }

    public function update(Request $request, $id)
    {
        $aposta = Aposta::findOrFail($id);

        $validated = $request->validate([
            'banca_id' => 'required|exists:bancas,id',
            'bet_option' => 'required|integer|exists:tipos_apostas,id',
            'amount' => 'required|numeric|min:0.01',
            'odd_at_bet' => 'required|numeric|min:1',
            'status_id' => 'required|integer|exists:statuses,id',
            'time_casa' => 'required|string|max:255',
            'time_visitante' => 'required|string|max:255',
            'return_amount' => 'nullable|numeric',
            'data_jogo' => 'required|date',
        ]);

        $aposta->update($validated);

        return response()->json($aposta);
    }

    public function show($id)
    {
        $aposta = Aposta::with(['banca', 'tipoAposta', 'status'])
            ->findOrFail($id);

        return response()->json([
            'id' => $aposta->id,
            'banca_id' => $aposta->banca_id,
            'game_id' => $aposta->game_id,
            'bet_option' => $aposta->bet_option,
            'amount' => $aposta->amount,
            'odd_at_bet' => $aposta->odd_at_bet,
            'status' => $aposta->status, // ou $aposta->status->id dependendo do seu relacionamento
            'return_amount' => $aposta->return_amount,
            'comentario' => $aposta->comentario,
            'data_jogo' => $aposta->data_jogo,
            'time_casa' => $aposta->time_casa,
            'time_visitante' => $aposta->time_visitante,
            'relacao_com_banca' => $aposta->relacao_com_banca,
            'valor_lucro_prejuizo' => $aposta->valor_lucro_prejuizo,
        ]);
    }

    public function destroy($id)
    {
        Aposta::destroy($id);
        return response()->json(['message' => 'Aposta excluída']);
    }

    public function estatisticas()
    {
        $apostas = Aposta::all();

        $totalApostado = $apostas->sum('amount');
        $totalRetorno = $apostas->sum('return_amount');
        $lucro = $totalRetorno - $totalApostado;

        return response()->json([
            'total_apostado' => $totalApostado,
            'total_retorno' => $totalRetorno,
            'lucro_liquido' => $lucro
        ]);
    }

    public function status()
    {
        return Status::select('id', 'codigo', 'nome')->get();
    }
}
