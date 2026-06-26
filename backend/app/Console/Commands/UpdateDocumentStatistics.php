<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\RecommendationService;

class UpdateDocumentStatistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'docs:update-stats';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update trending and recommendation scores for documents';

    /**
     * Execute the console command.
     */
    public function handle(RecommendationService $recommendationService)
    {
        $this->info('Starting document statistics update...');
        $recommendationService->updateTrendingScores();
        $this->info('Document statistics updated successfully.');
    }
}
