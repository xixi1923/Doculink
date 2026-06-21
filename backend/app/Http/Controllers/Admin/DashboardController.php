<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\User;
use App\Models\Category;
use App\Models\Book;
use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'users_count' => User::count(),
            'documents_count' => Document::count(),
            'categories_count' => Category::count(),
            'books_count' => Book::count(),
            'universities_count' => University::count(),
            'approved_documents' => Document::where('status', 'approved')->count(),
            'pending_documents' => Document::where('status', 'pending')->count(),
            'rejected_documents' => Document::where('status', 'rejected')->count(),
        ];

        $recent_documents = Document::with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        return Response::json([
            'stats' => $stats,
            'recent_documents' => $recent_documents,
        ]);
    }
}
