<?php

namespace App\Services;

use App\Models\Document;
use App\Models\DocumentStatistic;
use App\Models\User;
use Carbon\Carbon;

class RecommendationService
{
    /**
     * Calculate and update trending scores for all documents.
     */
    public function updateTrendingScores()
    {
        $documents = Document::all();

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
    }

    /**
     * Get recommended documents for a specific user.
     */
    public function getRecommendations(User $user, $limit = 10)
    {
        $userInterests = $this->getUserInterests($user);

        return Document::where('status', 'approved')
            ->with(['department', 'educationLevel', 'subject', 'major', 'statistics', 'documentType'])
            ->get()
            ->map(function ($document) use ($user, $userInterests) {
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
    public function getTrending($limit = 10, array $filters = [])
    {
        $query = Document::where('status', 'approved')
            ->join('document_statistics', 'documents.id', '=', 'document_statistics.document_id')
            ->with(['department', 'educationLevel', 'subject', 'major', 'documentType']);

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

        return $query->orderByDesc('document_statistics.trending_score')
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
