<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            if (!Schema::hasColumn('books', 'subtitle')) {
                $table->string('subtitle')->nullable()->after('title');
            }
            if (!Schema::hasColumn('books', 'language')) {
                $table->string('language')->default('English')->after('publisher');
            }
            if (!Schema::hasColumn('books', 'pdf_url')) {
                $table->string('pdf_url')->nullable()->after('cover_image');
            }
            if (!Schema::hasColumn('books', 'tags')) {
                $table->json('tags')->nullable()->after('category_id');
            }
            if (!Schema::hasColumn('books', 'book_type')) {
                $table->enum('book_type', ['free', 'premium'])->default('free')->after('tags');
            }
            if (!Schema::hasColumn('books', 'status')) {
                $table->enum('status', ['published', 'draft', 'archived'])->default('published')->after('book_type');
            }
            if (!Schema::hasColumn('books', 'file_size')) {
                $table->string('file_size')->nullable()->after('status');
            }
            if (!Schema::hasColumn('books', 'page_count')) {
                $table->integer('page_count')->nullable()->after('file_size');
            }
            if (!Schema::hasColumn('books', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('page_count');
            }
            if (!Schema::hasColumn('books', 'slug')) {
                $table->string('slug')->unique()->after('id')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
             $table->dropColumn(['subtitle', 'language', 'pdf_url', 'tags', 'book_type', 'status', 'file_size', 'page_count', 'is_featured', 'slug']);
        });
    }
};
