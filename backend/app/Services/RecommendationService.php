<?php

namespace App\Services;

use App\Models\Document;
use App\Models\DocumentStatistic;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class RecommendationService
{
    /**
     * Calculate and update trending scores for all documents.
     * Use chunking to handle large datasets efficiently.
     */
    public function updateTrendingScores()
    {
        Document::chunk(200, function ($documents) {
            foreach ($documents as $document) {
                $ageInDays = Carbon::parse($document->created_at)->diffInDays(now());

                $score = (
                    ($document->view_count * 1) +
                    ($document->download_count * 3) +
                    ($document->like_count * 5) +
                    ($document->save_count * 2)
                ) / ($ageInDays + 1);

                DocumentStatistic::updateOrCreate(
                    ['document_id' => $document->id],
                    ['trending_score' => $score]
                );
            }
        });
    }

    /**
     * Get recommended documents for a specific user.
     * Optimized to filter candidates in the database instead of loading everything into memory.
     */
    public function getRecommendations(User $user, $limit = 10)
    {
        $userInterests = $this->getUserInterests($user);

        // Find documents that match AT LEAST ONE of the user's profile metadata or interests
        // This drastically reduces the candidate pool from 100% of DB to ~5-10%
        $query = Document::where('status', 'approved')
            ->where('user_id', '!=', $user->id) // Issue 3: Exclude own documents
            ->where(function($q) use ($user, $userInterests) {
                // Profile matches
                if ($user->department_id) $q->orWhere('department_id', $user->department_id);
                if ($user->major_id) $q->orWhere('major_id', $user->major_id);
                if ($user->education_level_id) $q->orWhere('education_level_id', $user->education_level_id);

                // Interest matches (from history)
                if (!empty($userInterests['subjects'])) $q->orWhereIn('subject_id', $userInterests['subjects']);
                if (!empty($userInterests['majors'])) $q->orWhereIn('major_id', $userInterests['majors']);
            });

        // Limit candidates for scoring to ensure scalability
        $candidates = $query->with(['user', 'university', 'category', 'department', 'educationLevel', 'subject', 'major', 'statistics'])
            ->withCount(['comments', 'favorites', 'likes'])
            ->latest()
            ->limit(200) // Only score the 200 most recent relevant documents
            ->get();

        if ($candidates->isEmpty()) {
            // Fallback: Return trending documents if no personalized matches found
            return $this->getTrending($limit, [], $user);
        }

        // Add user-specific status if logged in
        if ($user) {
            $userId = $user->id;
            $candidates->each(function($doc) use ($userId) {
                $doc->loadExists(['favorites as is_favorited' => function($q) use ($userId) {
                    $q->where('user_id', $userId);
                }]);
                $doc->loadExists(['likes as is_liked' => function($q) use ($userId) {
                    $q->where('user_id', $userId);
                }]);
            });
        }

        return $candidates->map(function ($document) use ($user, $userInterests) {
                $score = 0;

                // 1. Department Match (30)
                if ($user->department_id && $document->department_id == $user->department_id) {
                    $score += 30;
                }

                // 2. Education Level Match (20)
                if ($user->education_level_id && $document->education_level_id == $user->education_level_id) {
                    $score += 20;
                }

                // 3. Subject Match (20)
                if ($document->subject_id && in_array($document->subject_id, $userInterests['subjects'])) {
                    $score += 20;
                }

                // 4. Major Match / User History Similarity (20)
                if ($user->major_id && $document->major_id == $user->major_id) {
                    $score += 20;
                } elseif ($document->major_id && in_array($document->major_id, $userInterests['majors'])) {
                    $score += 20;
                }

                // 5. Trending Score (10)
                $trendingScore = $document->statistics ? $document->statistics->trending_score : 0;
                // Normalize trending score to max 10
                $score += min(10, $trendingScore);

                $document->recommendation_score = $score;
                return $document;
            })
            ->sortByDesc('recommendation_score')
            ->take($limit)
            ->values();
    }

    /**
     * Get trending documents with metadata filtering capabilities.
     */
    public function getTrending($limit = 10, array $filters = [], $user = null)
    {
        $query = Document::where('documents.status', 'approved')
            ->join('document_statistics', 'documents.id', '=', 'document_statistics.document_id')
            ->with(['user', 'university', 'category', 'department', 'educationLevel', 'subject', 'major'])
            ->withCount(['comments', 'favorites', 'likes']);

        if ($user) {
            $query->where('documents.user_id', '!=', $user->id);
        }

        if (!empty($filters['department_id'])) {
            $query->where('documents.department_id', $filters['department_id']);
        }

        if (!empty($filters['major_id'])) {
            $query->where('documents.major_id', $filters['major_id']);
        }

        if (!empty($filters['education_level_id'])) {
            $query->where('documents.education_level_id', $filters['education_level_id']);
        }

        if (!empty($filters['subject_id'])) {
            $query->where('documents.subject_id', $filters['subject_id']);
        }

        if ($user) {
            $userId = $user->id;
            $query->withExists(['favorites as is_favorited' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
            $query->withExists(['likes as is_liked' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
        }

        return $query->orderByDesc('document_statistics.trending_score')
            ->orderByDesc('documents.view_count')
            ->select('documents.*', 'document_statistics.trending_score')
            ->take($limit)
            ->get();
    }

    /**
     * Helper to get user interests from history based purely on structured metadata.
     */
    private function getUserInterests(User $user)
    {
        $viewedDocIds = $user->documentActivities()
            ->where('action', 'view')
            ->pluck('document_id');

        $viewedDocs = Document::whereIn('id', $viewedDocIds)->get();

        $subjects = $viewedDocs->pluck('subject_id')->unique()->filter()->toArray();
        $majors = $viewedDocs->pluck('major_id')->unique()->filter()->toArray();

        return [
            'subjects' => $subjects,
            'majors' => $majors,
        ];
    }
}
