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
        Schema::table('documents', function (Blueprint $table) {
            $table->dropForeign(['document_type_id']);
            $table->dropColumn(['thumbnail', 'document_type_id', 'course_code', 'tags']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->string('thumbnail')->nullable();
            $table->foreignId('document_type_id')->nullable()->constrained()->onDelete('set null');
            $table->string('course_code')->nullable();
            $table->text('tags')->nullable();
        });
    }
};
