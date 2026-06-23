<?php

namespace App\Services;

use App\Repositories\DocumentRepository;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class DocumentService
{
    protected $documentRepository;

    public function __construct(DocumentRepository $documentRepository)
    {
        $this->documentRepository = $documentRepository;
    }

    public function getAllDocuments($filters = [])
    {
        $query = \App\Models\Document::with(['user', 'category', 'university']);

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['university_id'])) {
            $query->where('university_id', $filters['university_id']);
        }

        if (isset($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('subject', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (Auth::check()) {
            $userId = Auth::id();
            $query->withExists(['favorites as is_favorited' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);

            // Load user with follow status
            $query->with(['user' => function($q) use ($userId) {
                $q->withExists(['followers as is_following' => function($f) use ($userId) {
                    $f->where('follower_id', $userId);
                }]);
            }]);
        }

        return $query->withCount(['comments', 'favorites'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function searchDocuments(array $filters)
    {
        return $this->documentRepository->search($filters);
    }

    public function uploadDocument(array $data, $file)
    {
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = 'documents/' . $filename;

        Storage::disk('r2')->put($path, file_get_contents($file));

        $publicUrl = rtrim(config('filesystems.disks.r2.url'), '/') . '/' . $path;

        $data['file_path'] = $publicUrl;
        $data['file_type'] = $file->getClientOriginalExtension();
        $data['file_size'] = number_format($file->getSize() / 1024 / 1024, 2) . ' MB';

        return $this->documentRepository->create($data);
    }

    public function getDocumentDetails($id)
    {
        $userId = Auth::id();
        $query = \App\Models\Document::with([
            'user' => function($q) {
                $q->withCount('documents');
            },
            'category',
            'university',
            'comments' => function($q) use ($userId) {
                $q->with(['user']);
                $q->withCount('likes');
                if ($userId) {
                    $q->withExists(['likes as is_liked' => function($l) use ($userId) {
                        $l->where('user_id', $userId);
                    }]);
                }
            },
            'comments.replies' => function($q) use ($userId) {
                $q->with(['user']);
                $q->withCount('likes');
                if ($userId) {
                    $q->withExists(['likes as is_liked' => function($l) use ($userId) {
                        $l->where('user_id', $userId);
                    }]);
                }
            }
        ])->withCount(['likes', 'comments', 'favorites']);

        if ($userId) {
            $query->withExists(['likes as is_liked' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
            $query->withExists(['favorites as is_favorited' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
        }

        return $query->findOrFail($id);
    }

    public function getTrendingDocuments($limit = 10)
    {
        $query = \App\Models\Document::with(['user', 'category', 'university']);

        if (Auth::check()) {
            $userId = Auth::id();
            $query->withExists(['likes as is_liked' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
            $query->withExists(['favorites as is_favorited' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);

            // Load user with follow status
            $query->with(['user' => function($q) use ($userId) {
                $q->withExists(['followers as is_following' => function($f) use ($userId) {
                    $f->where('follower_id', $userId);
                }]);
            }]);
        }

        return $query->withCount(['comments', 'likes', 'favorites'])
            ->orderBy('view_count', 'desc')
            ->orderBy('likes_count', 'desc')
            ->limit($limit)
            ->get();
    }

    public function addComment($documentId, $userId, $content, $parentId = null)
    {
        $document = $this->documentRepository->findById($documentId);
        return $document->comments()->create([
            'user_id' => $userId,
            'content' => $content,
            'parent_id' => $parentId
        ]);
    }
}
