<?php

namespace App\Http\Controllers;

use App\Services\DocumentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{
    protected $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    public function index(Request $request)
    {
        return response()->json($this->documentService->getAllDocuments($request->all()));
    }

    public function trending()
    {
        return response()->json($this->documentService->getTrendingDocuments());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'university_id' => 'nullable|exists:universities,id',
            'file' => 'required|file|mimes:pdf,docx,pptx,jpg,jpeg,png|max:51200',
        ]);

        $data = $request->only(['title', 'description', 'subject', 'course_code', 'category_id', 'university_id', 'tags']);
        $data['user_id'] = Auth::id();
        $data['status'] = 'pending';

        $document = $this->documentService->uploadDocument($data, $request->file('file'));

        return response()->json($document, 201);
    }

    public function show($id)
    {
        try {
            $document = $this->documentService->getDocumentDetails($id);
            $document->increment('view_count');

            // If user is logged in, we already loaded is_favorited and is_liked via withExists in the service

            return response()->json($document);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'trace' => $e->getTrace()
            ], 500);
        }
    }

    public function comment(Request $request, $id)
    {
        $request->validate(['content' => 'required|string', 'parent_id' => 'nullable|exists:comments,id']);
        $comment = $this->documentService->addComment($id, Auth::id(), $request->content, $request->parent_id);

        // Trigger notification
        $document = \App\Models\Document::find($id);
        if ($document && $document->user_id !== Auth::id()) {
            \App\Models\Notification::create([
                'user_id' => $document->user_id,
                'type' => 'document_comment',
                'title' => 'New Comment',
                'message' => Auth::user()->name . ' commented on your document: ' . $document->title,
                'related_id' => $document->id,
                'related_type' => 'document'
            ]);
        }

        return response()->json($comment->load('user'), 201);
    }

    public function download($id)
    {
        $document = $this->documentService->getDocumentDetails($id);
        $document->increment('download_count');
        return response()->json(['url' => $document->file_path]);
    }

    public function getUserDocuments($userId)
    {
        $documents = \App\Models\Document::where('user_id', $userId)
            ->with(['category', 'university'])
            ->withCount(['comments', 'favorites'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($documents);
    }

    public function destroy($id)
    {
        $document = \App\Models\Document::findOrFail($id);

        if ($document->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete from R2
        $path = parse_url($document->file_path, PHP_URL_PATH);
        $path = ltrim($path, '/');
        if (\Illuminate\Support\Facades\Storage::disk('r2')->exists($path)) {
            \Illuminate\Support\Facades\Storage::disk('r2')->delete($path);
        }

        $document->delete();

        return response()->json(['message' => 'Document deleted successfully']);
    }
}
