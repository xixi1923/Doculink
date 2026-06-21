<?php

namespace App\Repositories;

use App\Models\Document;
use Illuminate\Database\Eloquent\Collection;

class DocumentRepository extends BaseRepository
{
    public function __construct(Document $model)
    {
        parent::__construct($model);
    }

    public function search(array $filters): Collection
    {
        $query = $this->model->newQuery()->where('status', 'approved');

        if (isset($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('subject', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['university_id'])) {
            $query->where('university_id', $filters['university_id']);
        }

        return $query->with(['user', 'category', 'university'])->get();
    }
}
