<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location')->nullable();
            $table->string('image')->nullable();
            $table->string('students_count')->default('0');
            $table->float('rating')->default(5.0);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Add university_id to documents table
        Schema::table('documents', function (Blueprint $table) {
            $table->foreignId('university_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropForeign(['university_id']);
            $table->dropColumn('university_id');
        });
        Schema::dropIfExists('universities');
    }
};
