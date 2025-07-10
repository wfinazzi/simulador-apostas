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
        Schema::dropIfExists('bets'); // apaga a tabela bets antiga

        Schema::create('bets', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('banca_id')->nullable()->constrained()->onDelete('cascade');

            $table->string('time_casa');
            $table->string('time_visitante');

            $table->foreignId('bet_option')->constrained('tipos_apostas')->onDelete('cascade');

            $table->decimal('amount', 10, 2);
            $table->decimal('odd_at_bet', 5, 2);

            $table->foreignId('status_id')->constrained('statuses')->onDelete('restrict');

            $table->decimal('return_amount', 10, 2)->nullable();

            $table->dateTime('data_jogo');

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
