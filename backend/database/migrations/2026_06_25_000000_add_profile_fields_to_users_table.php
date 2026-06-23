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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username')->unique()->nullable()->after('firebase_uid');
            }
            if (!Schema::hasColumn('users', 'school')) {
                $table->string('school')->nullable()->after('major');
            }
            if (!Schema::hasColumn('users', 'affiliation')) {
                $table->string('affiliation')->nullable()->after('school');
            }
            if (!Schema::hasColumn('users', 'country')) {
                $table->string('country')->nullable()->after('affiliation');
            }
            if (!Schema::hasColumn('users', 'academic_title')) {
                $table->string('academic_title')->nullable()->after('country');
            }
            if (!Schema::hasColumn('users', 'research_interests')) {
                $table->json('research_interests')->nullable()->after('academic_title');
            }
            if (!Schema::hasColumn('users', 'social_links')) {
                $table->json('social_links')->nullable()->after('research_interests');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'school',
                'affiliation',
                'country',
                'academic_title',
                'research_interests',
                'social_links'
            ]);
        });
    }
};
