<?php

namespace App\Http\Controllers;

use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $data = $request->except(['logo', 'cover_image']);

        if (!$request->has('short_name')) {
            $data['short_name'] = substr($request->name, 0, 10);
        }

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('universities/logos', 'r2');
            $data['logo'] = Storage::disk('r2')->url($path);
        }

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('universities/covers', 'r2');
            $data['cover_image'] = Storage::disk('r2')->url($path);
        }

        $university = University::create($data);

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
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $data = $request->except(['logo', 'cover_image']);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists and is on R2
            if ($university->logo && str_contains($university->logo, config('filesystems.disks.r2.url'))) {
                $oldPath = str_replace(rtrim(config('filesystems.disks.r2.url'), '/') . '/', '', $university->logo);
                try {
                    Storage::disk('r2')->delete($oldPath);
                } catch (\Exception $e) {
                    \Log::warning("Failed to delete old logo: " . $e->getMessage());
                }
            }
            $path = $request->file('logo')->store('universities/logos', 'r2');
            $data['logo'] = Storage::disk('r2')->url($path);
        }

        if ($request->hasFile('cover_image')) {
            // Delete old cover if exists and is on R2
            if ($university->cover_image && str_contains($university->cover_image, config('filesystems.disks.r2.url'))) {
                $oldPath = str_replace(rtrim(config('filesystems.disks.r2.url'), '/') . '/', '', $university->cover_image);
                try {
                    Storage::disk('r2')->delete($oldPath);
                } catch (\Exception $e) {
                    \Log::warning("Failed to delete old cover: " . $e->getMessage());
                }
            }
            $path = $request->file('cover_image')->store('universities/covers', 'r2');
            $data['cover_image'] = Storage::disk('r2')->url($path);
        }

        $university->update($data);
        return response()->json($university);
    }

    public function destroy($id)
    {
        University::findOrFail($id)->delete();
        return response()->json(['message' => 'University deleted']);
    }
}
