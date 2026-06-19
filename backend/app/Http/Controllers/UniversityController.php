<?php

namespace App\Http\Controllers;

use App\Models\University;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    public function index()
    {
        return response()->json(University::withCount('documents')->get());
    }

    public function show($id)
    {
        $university = University::withCount('documents')
            ->findOrFail($id);

        // Get documents for this university
        $documents = $university->documents()
            ->with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->limit(4)
            ->get();

        return response()->json([
            'university' => $university,
            'documents' => $documents,
            // Categories could be dynamic too based on documents
            'categories' => [
                ['name' => 'Exam Papers', 'icon' => '📝', 'color' => 'bg-teal-50', 'count' => '1,200+ Files'],
                ['name' => 'Lecture Notes', 'icon' => '📚', 'color' => 'bg-purple-50', 'count' => '3,450+ Files'],
                ['name' => 'Summaries', 'icon' => '📋', 'color' => 'bg-blue-50', 'count' => '890+ Files'],
                ['name' => 'Assignments', 'icon' => '✍️', 'color' => 'bg-teal-50', 'count' => '2,100+ Files'],
            ]
        ]);
    }
}
