<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bets', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('game_id')->constrained()->onDelete('cascade');

            $table->enum('bet_option', ['home', 'draw', 'away']); // Aposta feita
            $table->decimal('amount', 10, 2);                     // Valor apostado
            $table->decimal('odd_at_bet', 5, 2);                  // Odd no momento da aposta
            $table->enum('status', ['pending', 'won', 'lost'])->default('pending');
            $table->decimal('return_amount', 10, 2)->nullable();  // Valor de retorno, se ganhar

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bets');
    }
};
