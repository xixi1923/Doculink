<?php

namespace App\Http\Controllers;

use App\Services\DocumentService;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    protected $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    public function index()
    {
        return response()->json($this->documentService->getAllDocuments());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'file' => 'required|file|mimes:pdf,docx,pptx,jpg,png|max:10240',
        ]);

        $data = $request->only(['title', 'description', 'subject', 'school', 'university', 'major', 'grade', 'semester', 'category_id']);
        $data['user_id'] = auth()->id();

        $document = $this->documentService->uploadDocument($data, $request->file('file'));

        return response()->json($document, 201);
    }

    public function show($id)
    {
        return response()->json($this->documentService->getDocumentDetails($id));
    }
}
