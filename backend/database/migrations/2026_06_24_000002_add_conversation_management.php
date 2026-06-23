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
        // Add status and soft deletes to conversations
        Schema::table('conversations', function (Blueprint $table) {
            $table->enum('status', ['active', 'ended', 'archived'])->default('active')->after('id');
            $table->timestamp('ended_at')->nullable()->after('status');
            $table->softDeletes()->after('ended_at');
        });

        // Create user blocks table
        Schema::create('user_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blocker_id')->constrained('users')->onDelete('cascade'); // User doing the blocking
            $table->foreignId('blocked_id')->constrained('users')->onDelete('cascade'); // User being blocked
            $table->text('reason')->nullable();
            $table->timestamps();
            
            // Prevent duplicate blocks
            $table->unique(['blocker_id', 'blocked_id']);
        });

        // Add typing indicator status table
        Schema::create('typing_indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('typing_at');
            $table->timestamps();
            
            // Composite unique key - only one typing indicator per user per conversation
            $table->unique(['conversation_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('typing_indicators');
        Schema::dropIfExists('user_blocks');
        
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropColumn(['status', 'ended_at', 'deleted_at']);
        });
    }
};
