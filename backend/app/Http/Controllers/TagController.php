<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function index(Request $request)
    {
        $tags = Tag::withCount('documents')
            ->orderBy('documents_count', 'desc')
            ->paginate(20);

        return response()->json($tags);
    }

    public function show($id)
    {
        $tag = Tag::with(['documents'])
            ->withCount('documents')
            ->findOrFail($id);

        $documents = $tag->documents()
            ->with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'tag' => $tag,
            'documents' => $documents
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
        ]);

        $tag = Tag::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json($tag, 201);
    }

    public function update(Request $request, $id)
    {
        $tag = Tag::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:tags,name,' . $id,
        ]);

        $tag->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json($tag);
    }

    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();

        return response()->json(['message' => 'Tag deleted successfully']);
    }
}
