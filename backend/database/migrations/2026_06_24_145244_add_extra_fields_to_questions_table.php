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
        Schema::table('questions', function (Blueprint $table) {
            $table->string('slug')->unique()->after('title')->nullable();
            $table->foreignId('category_id')->nullable()->after('user_id')->constrained()->onDelete('set null');
            $table->string('image_path')->nullable()->after('content');
            $table->boolean('is_public')->default(true)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['slug', 'category_id', 'image_path', 'is_public']);
        });
    }
};
