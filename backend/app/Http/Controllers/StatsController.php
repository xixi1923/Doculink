<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function homeStats()
    {
        $topUniversities = University::withCount('documents')
            ->orderBy('documents_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($uni) {
                return [
                    'university' => $uni->short_name ?: $uni->name,
                    'documents_count' => $uni->documents_count
                ];
            });

        $totalDocs = Document::count();

        return response()->json([
            'top_universities' => $topUniversities,
            'total_docs' => $totalDocs
        ]);
    }
}
