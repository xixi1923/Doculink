<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function homeStats()
    {
        $topUniversities = Document::select('university', DB::raw('count(*) as documents_count'))
            ->whereNotNull('university')
            ->groupBy('university')
            ->orderBy('documents_count', 'desc')
            ->limit(5)
            ->get();

        $totalDocs = Document::count();

        return response()->json([
            'top_universities' => $topUniversities,
            'total_docs' => $totalDocs
        ]);
    }
}
