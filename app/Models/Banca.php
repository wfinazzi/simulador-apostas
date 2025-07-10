<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banca extends Model
{
    // Campos que podem ser preenchidos em massa, se estiver usando $fillable
    protected $fillable = ['nome', 'valor_inicial', 'data_inicio', 'observacao'];

    // Define a relação 1:N com as apostas (bets)
    public function bets()
    {
        return $this->hasMany(\App\Models\Bet::class);
    }
}
