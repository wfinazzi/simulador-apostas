<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('bets', function (Blueprint $table) {
            $table->unsignedBigInteger('tipo_aposta_id')->after('banca_id');

            $table->foreign('tipo_aposta_id')
                ->references('id')
                ->on('tipos_apostas')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('bets', function (Blueprint $table) {
            $table->dropForeign(['tipo_aposta_id']);
            $table->dropColumn('tipo_aposta_id');
        });
    }
};
