<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RecommendationService;
use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Facades\Auth;

class RecommendationController extends Controller
{
    protected $recommendationService;

    public function __construct(RecommendationService $recommendationService)
    {
        $this->recommendationService = $recommendationService;
    }

    /**
     * GET /api/recommendations
     */
    public function getRecommendations(Request $request)
    {
        $user = Auth::guard('sanctum')->user() ?: $request->user();

        if (!$user) {
            // Fallback for guests: return trending or newest
            return response()->json(
                Document::where('status', 'approved')
                    ->with(['user', 'university', 'category', 'department', 'educationLevel', 'subject', 'major'])
                    ->withCount(['comments', 'favorites', 'likes'])
                    ->orderBy('created_at', 'desc')
                    ->take(10)
                    ->get()
            );
        }

        $recommendations = $this->recommendationService->getRecommendations($user);

        return response()->json($recommendations);
    }

    /**
     * GET /api/home-feed
     * Provides all homepage sections in one call
     */
    public function getHomeFeed(Request $request)
    {
        $user = Auth::guard('sanctum')->user() ?: $request->user();

        $trending = $this->recommendationService->getTrending(10, [], $user);
        $newlyUploadedQuery = Document::where('status', 'approved')
            ->with(['user', 'university', 'category', 'department', 'educationLevel', 'subject', 'major'])
            ->withCount(['comments', 'favorites', 'likes'])
            ->orderBy('created_at', 'desc');

        if ($user) {
            $userId = $user->id;
            $newlyUploadedQuery->withExists(['favorites as is_favorited' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
            $newlyUploadedQuery->withExists(['likes as is_liked' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
        }

        $newlyUploaded = $newlyUploadedQuery->take(10)->get();

        $recommendations = [];
        $popularInDept = [];

        if ($user) {
            $recommendations = $this->recommendationService->getRecommendations($user, 10);
            if ($user->department_id) {
                $popularInDept = Document::where('status', 'approved')
                    ->where('department_id', $user->department_id)
                    ->with(['user', 'university', 'category', 'department', 'educationLevel', 'subject', 'major'])
                    ->withCount(['comments', 'favorites', 'likes'])
                    ->orderByDesc('view_count')
                    ->take(10)
                    ->get();
            }
        } else {
            // For guests, recommendations are just the trending ones
            $recommendations = $trending;
        }

        return response()->json([
            'trending' => $trending,
            'recommended' => $recommendations,
            'popular_in_department' => $popularInDept,
            'newly_uploaded' => $newlyUploaded
        ]);
    }

    /**
     * GET /api/trending
     */
    public function getTrending(Request $request)
    {
        $user = Auth::guard('sanctum')->user() ?: $request->user();
        $filters = $request->only(['department_id', 'major_id', 'education_level_id', 'subject_id']);
        $trending = $this->recommendationService->getTrending(20, $filters, $user);
        return response()->json($trending);
    }

    /**
     * GET /api/popular-in-department
     */
    public function getPopularInDepartment(Request $request)
    {
        $user = $request->user() ?: auth('sanctum')->user();
        if (!$user || !$user->department_id) {
            return response()->json([]);
        }

        $popular = Document::where('status', 'approved')
            ->where('department_id', $user->department_id)
            ->orderByDesc('view_count')
            ->take(10)
            ->get();

        return response()->json($popular);
    }

    /**
     * Force update statistics (for testing or manual trigger)
     */
    public function updateStats()
    {
        $this->recommendationService->updateTrendingScores();
        return response()->json(['message' => 'Statistics updated successfully']);
    }
}
