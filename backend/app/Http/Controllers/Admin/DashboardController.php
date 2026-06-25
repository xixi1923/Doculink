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
            'requests_count' => \App\Models\BookRequest::where('status', 'pending')->count(),
            'pending_subscriptions' => Subscription::where('status', 'pending')->count(),
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

        $pending_notifications = collect([]);

        // Add recent comments
        $recent_comments = \App\Models\Comment::with(['user', 'commentable'])->latest()->limit(5)->get()->map(function($item) {
            $bookTitle = $item->commentable->title ?? 'Resource';
            return [
                'id' => $item->id,
                'type' => 'comment',
                'title' => 'New Comment',
                'description' => ($item->user->name ?? 'User') . ' commented on "' . $bookTitle . '"',
                'link' => $item->commentable_type === 'App\\Models\\Book'
                    ? '/books/' . ($item->commentable->slug ?? $item->commentable_id)
                    : '/documents/' . $item->commentable_id,
                'created_at' => $item->created_at
            ];
        });
        $pending_notifications = $pending_notifications->concat($recent_comments);

        // Add pending book requests
        $book_requests = \App\Models\BookRequest::with('user')->where('status', 'pending')->latest()->limit(3)->get()->map(function($item) {
            return [
                'id' => $item->id,
                'type' => 'book_request',
                'title' => 'New Book Request',
                'description' => ($item->user->name ?? 'User') . ' requested "' . $item->title . '"',
                'link' => '/admin/book-requests',
                'created_at' => $item->created_at
            ];
        });
        $pending_notifications = $pending_notifications->concat($book_requests);

        // Add pending subscriptions
        $subs = Subscription::with('user')->where('status', 'pending')->latest()->limit(3)->get()->map(function($item) {
            return [
                'id' => $item->id,
                'type' => 'subscription',
                'title' => 'Payment Verification',
                'description' => ($item->user->name ?? 'User') . ' submitted a payment for ' . ($item->plan_type ?? 'Elite Node'),
                'link' => '/admin/subscriptions',
                'created_at' => $item->created_at
            ];
        });
        $pending_notifications = $pending_notifications->concat($subs);

        // Add pending documents
        $docs = Document::with('user')->where('status', 'pending')->latest()->limit(3)->get()->map(function($item) {
            return [
                'id' => $item->id,
                'type' => 'document',
                'title' => 'Document Audit',
                'description' => ($item->user->name ?? 'User') . ' uploaded "' . $item->title . '"',
                'link' => '/admin/documents',
                'created_at' => $item->created_at
            ];
        });
        $pending_notifications = $pending_notifications->concat($docs);

        return Response::json([
            'stats' => $stats,
            'recent_documents' => $recent_documents,
            'top_viewed_books' => $top_viewed_books,
            'notifications' => $pending_notifications->sortByDesc('created_at')->values()->all()
        ]);
    }
}
