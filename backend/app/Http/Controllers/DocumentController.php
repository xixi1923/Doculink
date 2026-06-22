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
        $document = $this->documentService->getDocumentDetails($id);
        $document->increment('view_count');

        if (Auth::check()) {
            $document->is_favorited = $document->favorites()->where('user_id', Auth::id())->exists();
        } else {
            $document->is_favorited = false;
        }

        return response()->json($document);
    }

    public function comment(Request $request, $id)
    {
        $request->validate(['content' => 'required|string']);
        $comment = $this->documentService->addComment($id, Auth::id(), $request->content);
        return response()->json($comment->load('user'), 201);
    }

    public function download($id)
    {
        $document = $this->documentService->getDocumentDetails($id);
        $document->increment('download_count');
        return response()->json(['url' => $document->file_path]);
    }
}
