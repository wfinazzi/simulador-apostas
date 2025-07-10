<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TiposApostasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $tipos = [
            ['nome' => 'Back Favorito', 'descricao' => 'A favor do time favorito vencer'],
            ['nome' => 'Back Zebra', 'descricao' => 'A favor da zebra (azarão) vencer'],
            ['nome' => 'Lay Favorito', 'descricao' => 'Contra o time favorito vencer'],
            ['nome' => 'Lay Zebra', 'descricao' => 'Contra a zebra (azarão) vencer'],
            ['nome' => 'Over 0.5', 'descricao' => 'Haverá pelo menos 1 gol no jogo'],
            ['nome' => 'Over 1.5', 'descricao' => 'Haverá pelo menos 2 gols no jogo'],
            ['nome' => 'Over 2.5', 'descricao' => 'Haverá pelo menos 3 gols no jogo'],
            ['nome' => 'Under 0.5', 'descricao' => 'Jogo terminará sem gols'],
            ['nome' => 'Under 1.5', 'descricao' => 'No máximo 1 gol no jogo'],
            ['nome' => 'Under 2.5', 'descricao' => 'No máximo 2 gols no jogo'],
            ['nome' => 'Ambas Marcam', 'descricao' => 'Ambas as equipes marcarão gols'],
            ['nome' => 'Ambas Não Marcam', 'descricao' => 'Pelo menos uma equipe não marcará'],
            ['nome' => 'Handicap Asiático', 'descricao' => 'Aposta com vantagem/desvantagem de gols'],
            ['nome' => 'Resultado Final', 'descricao' => 'Vitória, empate ou derrota tradicional'],
            ['nome' => 'Escanteios', 'descricao' => 'Aposta no número de escanteios'],
            ['nome' => 'Cartões', 'descricao' => 'Aposta na quantidade de cartões'],
            ['nome' => 'Gol até os 10min', 'descricao' => 'Gol até os primeiros 10 minutos de jogo'],
            ['nome' => 'Gol nos últimos minutos', 'descricao' => 'Gol após os 80 minutos'],
            ['nome' => 'Cashout', 'descricao' => 'Aposta encerrada antecipadamente'],
            ['nome' => 'Void', 'descricao' => 'Aposta anulada, sem resultado, valor devolvido'],
        ];

        DB::table('tipos_apostas')->insert($tipos);
    }
}
