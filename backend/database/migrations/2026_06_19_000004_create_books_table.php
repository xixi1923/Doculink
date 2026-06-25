<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('file_path');
            $table->string('isbn')->nullable();
            $table->string('publisher')->nullable();
            $table->year('publication_year')->nullable();
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('university_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('education_level_id')->nullable()->constrained()->onDelete('set null');
            $table->string('subject')->nullable();
            $table->string('resource_level')->nullable();
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->integer('view_count')->default(0);
            $table->integer('download_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
