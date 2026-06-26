<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class DocumentManagementController extends Controller
{
    public function index()
    {
        $documents = Document::with(['user', 'category', 'department', 'subject'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Response::json($documents);
    }

    public function approve(int $id)
    {
        $document = Document::findOrFail($id);
        $document->update(['status' => 'approved']);

        return Response::json(['message' => 'Document approved', 'document' => $document]);
    }

    public function reject(int $id)
    {
        $document = Document::findOrFail($id);
        $document->update(['status' => 'rejected']);

        return Response::json(['message' => 'Document rejected', 'document' => $document]);
    }

    public function destroy(int $id)
    {
        $document = Document::findOrFail($id);
        $document->delete();

        return Response::json(['message' => 'Document deleted']);
    }
}
