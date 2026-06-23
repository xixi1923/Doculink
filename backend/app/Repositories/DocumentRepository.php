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

    public function all(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->model->with($relations)->withCount(['comments', 'favorites'])->get($columns);
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

        if (\Illuminate\Support\Facades\Auth::check()) {
            $query->withExists(['favorites as is_favorited' => function($q) {
                $q->where('user_id', \Illuminate\Support\Facades\Auth::id());
            }]);
        }

        return $query->with(['user', 'category', 'university'])
            ->withCount(['comments', 'favorites'])
            ->get();
    }
}
