<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bancas', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->decimal('valor_inicial', 10, 2);
            $table->date('data_inicio')->nullable();
            $table->text('observacao')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bancas');
    }
};
