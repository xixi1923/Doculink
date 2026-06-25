<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\User;
use App\Models\Category;
use App\Models\Book;
use App\Models\University;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Carbon\Carbon;

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

            // New Stats for Books & Subscriptions
            'free_books' => Book::where('book_type', 'free')->count(),
            'premium_books' => Book::where('book_type', 'premium')->count(),
            'active_subscribers' => User::where('is_premium', true)
                ->where('premium_until', '>', Carbon::now())
                ->count(),
            'monthly_revenue' => Subscription::where('status', 'approved')
                ->where('created_at', '>=', Carbon::now()->startOfMonth())
                ->sum('amount'),
            'total_revenue' => Subscription::where('status', 'approved')->sum('amount'),
        ];

        $recent_documents = Document::with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        $top_viewed_books = Book::orderBy('view_count', 'desc')
            ->limit(5)
            ->get(['id', 'title', 'view_count', 'author']);

        return Response::json([
            'stats' => $stats,
            'recent_documents' => $recent_documents,
            'top_viewed_books' => $top_viewed_books,
        ]);
    }
}
