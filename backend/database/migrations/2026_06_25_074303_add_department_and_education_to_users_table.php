<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('department_id')->nullable()->after('university_id')->constrained()->onDelete('set null');
            $table->foreignId('education_level_id')->nullable()->after('department_id')->constrained()->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['education_level_id']);
            $table->dropForeign(['department_id']);
            $table->dropColumn(['department_id', 'education_level_id']);
        });
    }
};
