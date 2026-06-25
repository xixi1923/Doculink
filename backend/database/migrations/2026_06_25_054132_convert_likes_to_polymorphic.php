<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('likes', function (Blueprint $table) {
            if (!Schema::hasColumn('likes', 'likeable_id')) {
                $table->unsignedBigInteger('likeable_id')->nullable()->after('user_id');
                $table->string('likeable_type')->nullable()->after('likeable_id');
            }
        });

        // Migrate existing data if any
        DB::table('likes')->whereNotNull('document_id')->update([
            'likeable_id' => DB::raw('document_id'),
            'likeable_type' => 'App\Models\Document'
        ]);

        DB::table('likes')->whereNotNull('book_id')->update([
            'likeable_id' => DB::raw('book_id'),
            'likeable_type' => 'App\Models\Book'
        ]);

        Schema::table('likes', function (Blueprint $table) {
            // Drop unique constraints first
            $table->dropUnique('likes_user_id_document_id_unique');
            $table->dropUnique('likes_user_id_book_id_unique');

            // Drop foreign keys
            $table->dropForeign(['document_id']);
            $table->dropForeign(['book_id']);

            // Drop columns
            $table->dropColumn(['document_id', 'book_id']);

            // Add new unique constraint for polymorphic
            $table->unique(['user_id', 'likeable_id', 'likeable_type'], 'likes_user_likeable_unique');

            // Add index
            $table->index(['likeable_id', 'likeable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('likes', function (Blueprint $table) {
            $table->dropUnique('likes_user_likeable_unique');
            $table->dropIndex(['likeable_id', 'likeable_type']);
            $table->dropColumn(['likeable_id', 'likeable_type']);

            $table->foreignId('document_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->nullable()->constrained()->onDelete('cascade');

            $table->unique(['user_id', 'document_id']);
            $table->unique(['user_id', 'book_id']);
        });
    }
};
