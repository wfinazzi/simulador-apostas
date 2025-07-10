<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Status;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Status::insert([
            ['codigo' => 'won', 'nome' => 'Lucro'],
            ['codigo' => 'lost', 'nome' => 'Prejuízo'],
            ['codigo' => 'cashout', 'nome' => 'Cashout'],
            ['codigo' => 'pending', 'nome' => 'Pendente'],
        ]);
    }
}
