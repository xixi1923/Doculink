<?php

namespace App\Http\Controllers;

use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UniversityController extends Controller
{
    public function index()
    {
        return response()->json(University::withCount(['documents', 'books'])->get());
    }

    public function show($id)
    {
        $university = University::withCount(['documents', 'users', 'books'])
            ->findOrFail($id);

        $documents = $university->documents()
            ->with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $books = $university->books()
            ->with(['category'])
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Calculate total downloads
        $totalDocDownloads = $university->documents()->sum('download_count');
        $totalBookDownloads = $university->books()->sum('download_count');
        $totalDownloads = $totalDocDownloads + $totalBookDownloads;

        return response()->json([
            'university' => $university,
            'documents' => $documents,
            'books' => $books,
            'stats' => [
                'total_documents' => $university->documents_count,
                'total_books' => $university->books_count,
                'total_contributors' => $university->users_count,
                'total_downloads' => $totalDownloads,
            ]
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'short_name' => 'nullable|string|max:50',
                'location' => 'nullable|string|max:255',
                'website' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'logo' => 'nullable|string',
                'cover_image' => 'nullable|string',
            ]);

            if (empty($validated['short_name'])) {
                $validated['short_name'] = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $validated['name'] ?? 'UNI'), 0, 4));
            }

            $university = University::create($validated);
            return response()->json($university, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create university', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $university = University::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'short_name' => 'nullable|string|max:50',
                'location' => 'nullable|string|max:255',
                'website' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'logo' => 'nullable|string',
                'cover_image' => 'nullable|string',
            ]);

            $university->update($validated);
            return response()->json($university);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update university', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        University::findOrFail($id)->delete();
        return response()->json(['message' => 'University deleted']);
    }
}
