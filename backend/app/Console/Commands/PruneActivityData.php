<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PruneActivityData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:prune-activity {--days=90 : The number of days of data to keep}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prune old activity logs, search history, and views to keep the database size manageable.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $cutoffDate = Carbon::now()->subDays($days);

        $this->info("Pruning data older than {$days} days (Cutoff: {$cutoffDate})...");

        // Prune search history
        $searchCount = DB::table('search_history')->where('created_at', '<', $cutoffDate)->delete();
        $this->line("- Removed {$searchCount} search history records.");

        // Prune document views (keep statistics, but remove raw logs)
        $viewCount = DB::table('document_views')->where('created_at', '<', $cutoffDate)->delete();
        $this->line("- Removed {$viewCount} raw view records.");

        // Prune user activity
        $activityCount = DB::table('user_document_activity')->where('created_at', '<', $cutoffDate)->delete();
        $this->line("- Removed {$activityCount} activity records.");

        // Prune notifications (read and old)
        $notifCount = DB::table('notifications')
            ->where('created_at', '<', $cutoffDate)
            ->whereNotNull('read_at')
            ->delete();
        $this->line("- Removed {$notifCount} old read notifications.");

        $this->info('Pruning completed successfully.');
    }
}
