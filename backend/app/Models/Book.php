<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subtitle',
        'slug',
        'author',
        'description',
        'publisher',
        'isbn',
        'language',
        'cover_image',
        'file_path',
        'pdf_url',
        'category_id',
        'university_id',
        'tags',
        'book_type',
        'status',
        'file_size',
        'page_count',
        'is_featured',
        'uploaded_by',
        'view_count',
        'download_count',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_featured' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($book) {
            if (empty($book->slug)) {
                $book->slug = Str::slug($book->title) . '-' . Str::random(5);
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function university()
    {
        return $this->belongsTo(University::class);
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
        return $this->morphMany(Like::class, 'likeable');
    }
}
