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
        $query = \App\Models\Document::with(['user', 'category', 'university', 'department', 'educationLevel', 'subject', 'major'])
            ->where('status', 'approved');

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['university_id'])) {
            $query->where('university_id', $filters['university_id']);
        }

        if (isset($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        if (isset($filters['major_id'])) {
            $query->where('major_id', $filters['major_id']);
        }

        if (isset($filters['subject_id'])) {
            $query->where('subject_id', $filters['subject_id']);
        }

        if (isset($filters['education_level_id'])) {
            $query->where('education_level_id', $filters['education_level_id']);
        }

        if (isset($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
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

        return $query->withCount(['comments', 'favorites', 'likes'])
            ->orderBy('created_at', 'desc')
            ->paginate($filters['per_page'] ?? 12);
    }

    public function searchDocuments(array $filters)
    {
        return $this->documentRepository->search($filters);
    }

    public function uploadDocument(array $data, $file)
    {
        // Handle Department with normalization
        if (empty($data['department_id']) && !empty($data['department_full_name'])) {
            $fullName = ucwords(strtolower(trim($data['department_full_name'])));
            $department = \App\Models\Department::whereRaw('LOWER(department_full_name) = ?', [strtolower($fullName)])->first();

            if (!$department) {
                $department = \App\Models\Department::create([
                    'department_full_name' => $fullName,
                    'department_short_name' => !empty($data['department_short_name']) ? strtoupper(trim($data['department_short_name'])) : null
                ]);
            }
            $data['department_id'] = $department->id;
        }

        // Handle Subject with normalization
        if (empty($data['subject_id']) && !empty($data['subject_name'])) {
            $subjectName = ucwords(strtolower(trim($data['subject_name'])));
            $subject = \App\Models\Subject::whereRaw('LOWER(subject_name) = ?', [strtolower($subjectName)])->first();

            if (!$subject) {
                $subject = \App\Models\Subject::create(['subject_name' => $subjectName]);
            }
            $data['subject_id'] = $subject->id;
        }

        // Handle Major with normalization
        if (empty($data['major_id']) && !empty($data['major_name'])) {
            $majorName = ucwords(strtolower(trim($data['major_name'])));
            $major = \App\Models\Major::whereRaw('LOWER(major_name) = ?', [strtolower($majorName)])
                ->where('department_id', $data['department_id'] ?? null)
                ->first();

            if (!$major) {
                $major = \App\Models\Major::create([
                    'major_name' => $majorName,
                    'department_id' => $data['department_id'] ?? null
                ]);
            }
            $data['major_id'] = $major->id;
        }

        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        Storage::disk('r2')->putFileAs('documents', $file, $filename);
        $publicUrl = rtrim(config('filesystems.disks.r2.url'), '/') . '/documents/' . $filename;

        $data['file_path'] = $publicUrl;
        $data['file_type'] = $file->getClientOriginalExtension();
        $data['file_size'] = number_format($file->getSize() / 1024 / 1024, 2) . ' MB';

        return $this->documentRepository->create($data);
    }

    public function getDocumentDetails($id)
    {
        $document = $this->documentRepository->findById($id, ['*'], [
            'user', 'category', 'university', 'department', 'educationLevel',
            'subject', 'major', 'comments.user'
        ]);

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

        // 1. Related by Subject (Highest priority)
        $relatedBySubject = \App\Models\Document::where('subject_id', $document->subject_id)
            ->where('id', '!=', $id)
            ->where('status', 'approved')
            ->with(['user', 'documentType'])
            ->limit(5)
            ->get();

        // 2. Related by Major (if major exists)
        $relatedByMajor = collect();
        if ($document->major_id) {
            $relatedByMajor = \App\Models\Document::where('major_id', $document->major_id)
                ->where('id', '!=', $id)
                ->where('status', 'approved')
                ->whereNotIn('id', $relatedBySubject->pluck('id'))
                ->with(['user', 'documentType'])
                ->limit(5)
                ->get();
        }

        // 3. Related by Department (Fallback)
        $relatedByDepartment = \App\Models\Document::where('department_id', $document->department_id)
            ->where('id', '!=', $id)
            ->where('status', 'approved')
            ->whereNotIn('id', $relatedBySubject->pluck('id'))
            ->whereNotIn('id', $relatedByMajor->pluck('id'))
            ->with(['user', 'university'])
            ->limit(5)
            ->get();

        $document->related_documents = $relatedBySubject->concat($relatedByMajor)->concat($relatedByDepartment)->take(10);

        return $document;
    }

    public function getTrendingDocuments()
    {
        $query = \App\Models\Document::with(['user', 'category', 'university', 'department', 'subject'])
            ->where('status', 'approved')
            ->withCount(['comments', 'favorites', 'likes']);

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
