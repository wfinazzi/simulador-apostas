<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bet extends Model
{
    protected $fillable = [
        'user_id',
        'game_id',
        'bet_option',
        'amount',
        'odd_at_bet',
        'status',
        'return_amount',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function banca()
    {
        return $this->belongsTo(Banca::class);
    }

    public function tipoAposta()
    {
        return $this->belongsTo(TiposAposta::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class, 'status');
    }
}
