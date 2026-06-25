<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('department_full_name');
            $table->string('department_short_name')->nullable();
            $table->timestamps();
        });

        Schema::create('education_levels', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // High School, University
            $table->string('name'); // Grade 10, Bachelor Degree, etc.
            $table->timestamps();
        });

        Schema::table('documents', function (Blueprint $table) {
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('education_level_id')->nullable()->constrained()->onDelete('set null');
            $table->string('resource_level')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['education_level_id']);
            $table->dropColumn(['department_id', 'education_level_id', 'resource_level']);
        });

        Schema::dropIfExists('education_levels');
        Schema::dropIfExists('departments');
    }
};
