<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    protected $fillable = [
        'home_team',
        'away_team',
        'home_odds',
        'draw_odds',
        'away_odds',
        'match_date',
        'result',
    ];

    public function bets(): HasMany
    {
        return $this->hasMany(Bet::class);
    }
}
