<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'description',
        'cover_image',
        'file_path',
        'isbn',
        'publisher',
        'publication_year',
        'category_id',
        'university_id',
        'department_id',
        'education_level_id',
        'subject',
        'resource_level',
        'uploaded_by',
        'view_count',
        'download_count',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function educationLevel()
    {
        return $this->belongsTo(EducationLevel::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'book_id');
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
