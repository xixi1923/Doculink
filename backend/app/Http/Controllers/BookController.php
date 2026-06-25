<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with('category', 'uploader');

        // If not admin, only show published
        if (!auth()->user() || auth()->user()->role !== 'admin') {
            $query->where('status', 'published');
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                  ->orWhere('author', 'like', "%$search%")
                  ->orWhere('isbn', 'like', "%$search%");
            });
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('book_type')) {
            $query->where('book_type', $request->book_type);
        }

        if ($request->has('sort')) {
            if ($request->sort === 'newest') $query->orderBy('created_at', 'desc');
            if ($request->sort === 'popular') $query->orderBy('view_count', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate(12);
    }

    public function show($idOrSlug)
    {
        $book = Book::with(['category', 'uploader'])
            ->where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->firstOrFail();

        $book->increment('view_count');

        // Related books
        $related = Book::where('category_id', $book->category_id)
            ->where('id', '!=', $book->id)
            ->where('status', 'published')
            ->limit(4)
            ->get();

        return response()->json([
            'book' => $book,
            'related' => $related
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'university_id' => 'nullable|exists:universities,id',
                'author' => 'required|string',
                'book_type' => 'required|in:free,premium',
                'status' => 'required|in:published,draft,archived',
                'cover_image' => 'nullable|string',
                'pdf_url' => 'required|string',
                'file_path' => 'required|string',
                'file_size' => 'nullable|string',
                'page_count' => 'nullable',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => 'Validation Failed', 'errors' => $validator->errors()], 422);
            }

            $data = $request->all();
            $data['uploaded_by'] = Auth::id();

            // Handle tags
            if ($request->has('tags') && is_string($request->tags)) {
                $data['tags'] = array_map('trim', explode(',', $request->tags));
            }

            $book = Book::create($data);
            return response()->json(['message' => 'Book uploaded successfully', 'book' => $book]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Book Store Error: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $book = Book::findOrFail($id);

            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'category_id' => 'sometimes|required|exists:categories,id',
                'university_id' => 'nullable|exists:universities,id',
                'author' => 'sometimes|required|string',
                'book_type' => 'sometimes|required|in:free,premium',
                'status' => 'sometimes|required|in:published,draft,archived',
                'cover_image' => 'nullable|string',
                'pdf_url' => 'nullable|string',
                'file_path' => 'nullable|string',
                'page_count' => 'nullable',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => 'Validation Failed', 'errors' => $validator->errors()], 422);
            }

            $data = $request->all();

            // Handle tags
            if ($request->has('tags') && is_string($request->tags)) {
                $data['tags'] = array_map('trim', explode(',', $request->tags));
            }

            $book->update($data);
            return response()->json(['message' => 'Book updated successfully', 'book' => $book]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Book Update Error: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        // Delete files
        if ($book->file_path) {
            Storage::disk('r2')->delete($book->file_path);
        }
        if ($book->cover_image && str_contains($book->cover_image, 'r2')) {
            $oldPath = parse_url($book->cover_image, PHP_URL_PATH);
            Storage::disk('r2')->delete(ltrim($oldPath, '/'));
        }
        $book->delete();
        return response()->json(['message' => 'Book deleted successfully']);
    }

    public function categories()
    {
        return Category::all();
    }

    public function download($id)
    {
        $book = Book::findOrFail($id);
        $user = Auth::user();

        if ($book->book_type === 'premium' && !$user->is_premium) {
            return response()->json(['message' => 'Premium subscription required'], 403);
        }

        $book->increment('download_count');
        // Logic to return file download
        return Storage::disk('r2')->download($book->file_path, \Illuminate\Support\Str::slug($book->title) . '.pdf');
    }

    private function formatBytes($bytes, $precision = 2) {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }

    private function estimatePdfPages($path) {
        // Simple way to get page count without external libs
        $stream = fopen($path, "rb");
        $content = fread($stream, filesize($path));
        fclose($stream);
        if (preg_match("/\/Count\s+(\d+)/", $content, $m)) {
            return (int)$m[1];
        }
        return 0; // Fallback
    }
}
