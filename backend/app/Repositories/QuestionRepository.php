<?php

namespace App\Repositories;

use App\Models\Question;

class QuestionRepository extends BaseRepository
{
    public function __construct(Question $model)
    {
        parent::__construct($model);
    }
}
