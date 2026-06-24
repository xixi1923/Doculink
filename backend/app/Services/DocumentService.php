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

            $query->withExists(['likes as is_liked' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);

            // Load user with follow status
            $query->with(['user' => function($q) use ($userId) {
                $q->withExists(['followers as is_following' => function($f) use ($userId) {
                    $f->where('follower_id', $userId);
                }]);
            }]);
        }

        if (isset($filters['limit'])) {
            $query->limit((int)$filters['limit']);
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

        // Use putFileAs to ensure the filename is exactly what we want, not a subfolder
        Storage::disk('r2')->putFileAs('documents', $file, $filename);

        $publicUrl = rtrim(config('filesystems.disks.r2.url'), '/') . '/documents/' . $filename;

        $data['file_path'] = $publicUrl;
        $data['file_type'] = $file->getClientOriginalExtension();
        $data['file_size'] = number_format($file->getSize() / 1024 / 1024, 2) . ' MB';

        return $this->documentRepository->create($data);
    }

    public function getDocumentDetails($id)
    {
        $document = $this->documentRepository->findById($id, ['*'], ['user', 'category', 'university', 'comments.user']);

        if (Auth::check()) {
            $userId = Auth::id();
            $document->loadExists(['favorites as is_favorited' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
            $document->loadExists(['likes as is_liked' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
        }

        $document->loadCount(['comments', 'favorites', 'likes']);

        // Load related documents: same category, excluding self
        $document->related_documents = \App\Models\Document::where('category_id', $document->category_id)
            ->where('id', '!=', $id)
            ->where('status', 'approved')
            ->limit(5)
            ->get();

        return $document;
    }

    public function getTrendingDocuments()
    {
        $query = \App\Models\Document::with(['user', 'category', 'university'])
            ->where('status', 'approved')
            ->withCount(['comments', 'favorites']);

        if (Auth::check()) {
            $userId = Auth::id();
            $query->withExists(['favorites as is_favorited' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);

            $query->withExists(['likes as is_liked' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);

            $query->with(['user' => function ($q) use ($userId) {
                $q->withExists(['followers as is_following' => function ($f) use ($userId) {
                    $f->where('follower_id', $userId);
                }]);
            }]);
        }

        return $query->orderByDesc('view_count')
            ->orderByDesc('download_count')
            ->orderByDesc('created_at')
            ->limit(10)
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
