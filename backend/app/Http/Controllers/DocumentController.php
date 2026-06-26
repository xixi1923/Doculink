<?php

namespace App\Http\Controllers;

use App\Services\DocumentService;
use App\Services\RecommendationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{
    protected $documentService;
    protected $recommendationService;

    public function __construct(DocumentService $documentService, RecommendationService $recommendationService)
    {
        $this->documentService = $documentService;
        $this->recommendationService = $recommendationService;
    }

    public function index(Request $request)
    {
        if ($request->has('search') && !empty($request->search) && Auth::check()) {
            \App\Models\SearchHistory::create([
                'user_id' => Auth::id(),
                'keyword' => $request->search
            ]);
        }
        return response()->json($this->documentService->getAllDocuments($request->all()));
    }

    public function getSearchHistory()
    {
        $history = \App\Models\SearchHistory::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json($history);
    }

    public function trending(Request $request)
    {
        $user = Auth::guard('sanctum')->user() ?: $request->user();
        $filters = $request->only(['department_id', 'major_id', 'education_level_id', 'subject_id']);
        return response()->json($this->recommendationService->getTrending(20, $filters, $user));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'university_id' => 'nullable|exists:universities,id',
            // Department can be an ID or names for auto-creation
            'department_id' => 'nullable|exists:departments,id',
            'department_full_name' => 'required_without:department_id|string|max:255',
            'department_short_name' => 'nullable|string|max:255',
            'education_level_id' => 'required|exists:education_levels,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'subject_name' => 'required_without:subject_id|string|max:255',
            'major_id' => 'nullable|exists:majors,id',
            'major_name' => 'nullable|string|max:255',
            'resource_level' => 'nullable|string|max:255',
            'file' => 'required|file|mimes:pdf,docx,pptx,jpg,jpeg,png|max:51200',
        ]);

        $data = $request->only([
            'title', 'description', 'category_id', 'university_id',
            'department_id', 'department_full_name', 'department_short_name',
            'education_level_id', 'subject_id', 'subject_name',
            'major_id', 'major_name', 'resource_level'
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

            // Use cache to throttle view counts (prevents double-counting in dev/rapid refreshes)
            $viewKey = 'doc_viewed_' . $id . '_' . request()->ip() . '_' . (Auth::id() ?: 'guest');
            if (!\Illuminate\Support\Facades\Cache::has($viewKey)) {
                $document->increment('view_count');
                \Illuminate\Support\Facades\Cache::put($viewKey, true, 60); // 1 minute cooldown
            }

            // Record view activity
            if (Auth::check()) {
                \App\Models\UserDocumentActivity::create([
                    'user_id' => Auth::id(),
                    'document_id' => $id,
                    'action' => 'view'
                ]);
                \App\Models\DocumentView::create([
                    'user_id' => Auth::id(),
                    'document_id' => $id
                ]);
            } else {
                \App\Models\DocumentView::create([
                    'user_id' => null,
                    'document_id' => $id
                ]);
            }

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

        // Record download activity
        if (Auth::check()) {
            \App\Models\UserDocumentActivity::create([
                'user_id' => Auth::id(),
                'document_id' => $id,
                'action' => 'download'
            ]);
        }

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

        if ($document->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
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
