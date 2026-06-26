<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->foreignId('subject_id')->nullable()->after('education_level_id')->constrained()->onDelete('set null');
            $table->foreignId('major_id')->nullable()->after('subject_id')->constrained()->onDelete('set null');
            $table->integer('like_count')->default(0)->after('download_count');
            $table->integer('save_count')->default(0)->after('like_count');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropForeign(['major_id']);
            $table->dropForeign(['subject_id']);
            $table->dropColumn(['subject_id', 'major_id', 'like_count', 'save_count']);
        });
    }
};
