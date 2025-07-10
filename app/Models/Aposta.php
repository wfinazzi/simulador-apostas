<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Aposta extends Model
{
    protected $table = 'bets';

    protected $fillable = [
        'banca_id',
        'game_id',
        'user_id',
        'time_casa',
        'time_visitante',
        'bet_option',
        'amount',
        'odd_at_bet',
        'time_casa',
        'time_visitante',
        'tipo_aposta_id',
        'status_id',
        'data_jogo',
        'return_amount',
    ];

    public function banca(): BelongsTo
    {
        return $this->belongsTo(Banca::class);
    }

    public function tipoAposta()
    {
        return $this->belongsTo(TiposAposta::class, 'bet_option');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
