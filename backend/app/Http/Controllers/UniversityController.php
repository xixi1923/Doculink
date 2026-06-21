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
        $university = University::withCount(['documents', 'users'])
            ->findOrFail($id);

        $documents = $university->documents()
            ->with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Calculate total downloads
        $totalDownloads = $university->documents()->sum('download_count');

        return response()->json([
            'university' => $university,
            'documents' => $documents,
            'stats' => [
                'total_documents' => $university->documents_count,
                'total_contributors' => $university->users_count,
                'total_downloads' => $totalDownloads,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'description' => 'nullable|string',
        ]);

        // If short_name is missing, try to generate it or use name
        if (!$request->has('short_name')) {
            $data = $request->all();
            $data['short_name'] = substr($request->name, 0, 10);
            $university = University::create($data);
        } else {
            $university = University::create($request->all());
        }

        return response()->json($university, 201);
    }

    public function update(Request $request, $id)
    {
        $university = University::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'short_name' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'description' => 'nullable|string',
        ]);

        $university->update($request->all());
        return response()->json($university);
    }

    public function destroy($id)
    {
        University::findOrFail($id)->delete();
        return response()->json(['message' => 'University deleted']);
    }
}
