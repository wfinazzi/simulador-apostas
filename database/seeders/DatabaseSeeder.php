<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => 'Test User',
            'email' => 'test' . Str::random(5) . '@example.com', // Garante que o email seja único
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // Defina uma senha padrão
            'remember_token' => Str::random(10),
        ]);

        $this->call([
            GameSeeder::class,
        ]);
    }
}
