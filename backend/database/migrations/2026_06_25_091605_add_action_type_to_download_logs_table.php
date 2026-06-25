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
        Schema::table('download_logs', function (Blueprint $table) {
            $table->string('action_type')->default('download')->after('book_id'); // read, download
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('download_logs', function (Blueprint $table) {
            $table->dropColumn('action_type');
        });
    }
};
