<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->renameColumn('name', 'subject_name');
        });

        Schema::table('majors', function (Blueprint $table) {
            $table->renameColumn('name', 'major_name');
            $table->foreignId('department_id')->nullable()->after('major_name')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('majors', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn('department_id');
            $table->renameColumn('major_name', 'name');
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->renameColumn('subject_name', 'name');
        });
    }
};
