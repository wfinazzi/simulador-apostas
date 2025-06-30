<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;
use Carbon\Carbon;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        Game::query()->delete(); // limpa antes de popular

        $jogos = [
            ['home_team' => 'Flamengo', 'away_team' => 'Palmeiras'],
            ['home_team' => 'Corinthians', 'away_team' => 'São Paulo'],
            ['home_team' => 'Grêmio', 'away_team' => 'Internacional'],
            ['home_team' => 'Vasco', 'away_team' => 'Botafogo'],
            ['home_team' => 'Atlético-MG', 'away_team' => 'Cruzeiro'],
        ];

        foreach ($jogos as $index => $jogo) {
            Game::create([
                'home_team' => $jogo['home_team'],
                'away_team' => $jogo['away_team'],
                'home_odds' => rand(150, 300) / 100, // 1.5 a 3.0
                'draw_odds' => rand(250, 350) / 100,
                'away_odds' => rand(150, 300) / 100,
                'match_date' => Carbon::now()->addDays($index + 1),
            ]);
        }
    }
}
