<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title', 'author', 'publisher', 'isbn', 'year',
        'description', 'cover_image', 'book_category_id'
    ];

    public function category()
    {
        return $this->belongsTo(BookCategory::class, 'book_category_id');
    }
}
