<?php

namespace App\Repositories;

use App\Models\University;

class UniversityRepository extends BaseRepository
{
    public function __construct(University $model)
    {
        parent::__construct($model);
    }
}
