<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('subject')->nullable();
            $table->string('school')->nullable();
            $table->string('university')->nullable();
            $table->string('major')->nullable();
            $table->string('grade')->nullable();
            $table->string('semester')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('thumbnail')->nullable();
            $table->string('file_path');
            $table->string('file_type'); // pdf, docx, pptx, image
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->string('visibility')->default('public'); // public, private, unlisted
            $table->integer('views_count')->default(0);
            $table->integer('downloads_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
