<?php

namespace App\Http\Controllers;

use App\Models\Aposta;
use App\Models\Status;
use App\Models\TiposAposta;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalAmount = Aposta::sum('amount');
        $totalReturn = Aposta::sum('return_amount');
        $profit = $totalReturn - $totalAmount;

        $roi = $totalAmount > 0
            ? round(($profit / $totalAmount) * 100, 2)
            : 0;

        // Mapeamento de status e opções de aposta
        $statusMap = Status::pluck('nome', 'id');         // ex: [1 => 'Ganha', 2 => 'Perdida', ...]
        $optionMap = TiposAposta::pluck('nome', 'id');     // ex: [1 => 'Lay', 2 => 'Over', ...]

        return response()->json([
            'total_bets' => Aposta::count(),
            'total_amount' => (float) $totalAmount,
            'total_return' => (float) $totalReturn,
            'profit' => (float) $profit,
            'roi' => (float) $roi,

            'bets_by_status' => Aposta::select('status_id', DB::raw('count(*) as total'))
                ->groupBy('status_id')
                ->get()
                ->map(function ($item) use ($statusMap) {
                    return [
                        'status_id' => (int) $item->status_id,
                        'status_name' => $statusMap[$item->status_id] ?? 'Desconhecido',
                        'total' => (int) $item->total,
                    ];
                }),

            'bets_by_option' => Aposta::select('bet_option', DB::raw('count(*) as total'))
                ->groupBy('bet_option')
                ->get()
                ->map(function ($item) use ($optionMap) {
                    return [
                        'bet_option' => (int) $item->bet_option,
                        'option_name' => $optionMap[$item->bet_option] ?? 'Desconhecido',
                        'total' => (int) $item->total,
                    ];
                }),

            'profit_per_day' => Aposta::select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(return_amount - amount) as profit')
                )
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date', 'asc')
                ->get()
                ->map(function ($item) {
                    return [
                        'date' => $item->date,
                        'profit' => (float) $item->profit,
                    ];
                }),

            'latest_bets' => Aposta::with(['status', 'tipoAposta']) // se os relacionamentos estiverem definidos
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($a) {
                return [
                    'time_casa' => $a->time_casa,
                    'time_visitante' => $a->time_visitante,
                    'amount' => (float) $a->amount,
                    'odd_at_bet' => (float) $a->odd_at_bet,
                    'status_name' => $a->status->nome ?? 'Desconhecido',
                    'data_jogo' => optional($a->data_jogo)->format('Y-m-d H:i'),
                    'return_amount' => (float) $a->return_amount,
                    'lucro' => (float) $a->return_amount - $a->amount,
                ];
            }),
        ]);
    }
}
