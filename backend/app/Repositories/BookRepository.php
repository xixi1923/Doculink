<?php

namespace App\Repositories;

use App\Models\Book;

class BookRepository extends BaseRepository
{
    public function __construct(Book $model)
    {
        parent::__construct($model);
    }
}
