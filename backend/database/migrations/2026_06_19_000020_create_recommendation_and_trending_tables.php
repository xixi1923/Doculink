<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Metadata tables
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('majors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // Activity tables
        Schema::create('user_document_activity', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('document_id')->constrained()->onDelete('cascade');
            $table->string('action'); // view, download, save, like
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('document_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('document_id')->constrained()->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('saved_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('document_id')->constrained()->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('document_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('document_id')->constrained()->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('search_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('keyword');
            $table->timestamp('created_at')->useCurrent();
        });

        // Statistics table
        Schema::create('document_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained()->onDelete('cascade');
            $table->decimal('trending_score', 15, 4)->default(0);
            $table->decimal('recommendation_score', 15, 4)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_statistics');
        Schema::dropIfExists('search_history');
        Schema::dropIfExists('document_likes');
        Schema::dropIfExists('saved_documents');
        Schema::dropIfExists('document_views');
        Schema::dropIfExists('user_document_activity');
        Schema::dropIfExists('majors');
        Schema::dropIfExists('subjects');
    }
};
