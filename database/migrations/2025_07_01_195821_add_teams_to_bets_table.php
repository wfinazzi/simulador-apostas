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
            $table->string('time_casa')->after('banca_id');
            $table->string('time_visitante')->after('time_casa');
        });
    }

    public function down()
    {
        Schema::table('bets', function (Blueprint $table) {
            $table->dropColumn(['time_casa', 'time_visitante']);
        });
    }
};
