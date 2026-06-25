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
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'university_id' => 'nullable|exists:universities,id',
            'department_id' => 'nullable|exists:departments,id',
            'department_full_name' => 'nullable|string|max:255',
            'department_short_name' => 'nullable|string|max:255',
            'education_level_id' => 'nullable|exists:education_levels,id',
            'resource_level' => 'nullable|string|max:255',
            'subject' => 'nullable|string|max:255',
            'tags' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,docx,pptx,jpg,jpeg,png|max:51200',
        ]);

        $data = $request->only([
            'title', 'description', 'subject', 'category_id', 'university_id',
            'department_id', 'department_full_name', 'department_short_name',
            'education_level_id', 'resource_level', 'tags'
        ]);
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

            // Load uploader stats to make the sidebar dynamic
            $user = $document->user;
            if ($user) {
                $totalUploads = $user->documents()->count() + $user->books()->count();
                $totalDownloads = $user->documents()->sum('download_count');
                $totalViews = $user->documents()->sum('view_count');
                $totalLikes = \App\Models\Like::whereIn('likeable_id', $user->documents()->pluck('id'))
                    ->where('likeable_type', \App\Models\Document::class)
                    ->count();
                $totalComments = \App\Models\Comment::whereIn('commentable_id', $user->documents()->pluck('id'))
                    ->where('commentable_type', 'App\Models\Document')
                    ->count();

                $user->stats = [
                    'total_uploads' => $totalUploads,
                    'total_downloads' => (int) $totalDownloads,
                    'total_views' => (int) $totalViews,
                    'total_likes' => (int) $totalLikes,
                    'total_comments' => (int) $totalComments,
                ];
            }

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

        // Create download log
        \App\Models\DownloadLog::create([
            'user_id' => Auth::id(),
            'document_id' => $id,
            'downloaded_at' => now(),
        ]);

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
