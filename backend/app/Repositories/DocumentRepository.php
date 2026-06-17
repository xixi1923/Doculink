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
        $query = $this->model->newQuery();

        if (isset($filters['keyword'])) {
            $query->where('title', 'like', '%' . $filters['keyword'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['keyword'] . '%');
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['school'])) {
            $query->where('school', $filters['school']);
        }

        // Add more filters as per requirement

        return $query->with(['user', 'category'])->get();
    }
}
