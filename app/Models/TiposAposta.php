<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TiposAposta extends Model
{
    protected $fillable = [
        'nome',
        'descricao',
    ];

    public function apostas(): HasMany
    {
        return $this->hasMany(Aposta::class, 'bet_option');
    }
}
