<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'file_path',
        'file_type',
        'file_size',
        'category_id',
        'university_id',
        'department_id',
        'education_level_id',
        'subject_id',
        'major_id',
        'user_id',
        'resource_level',
        'status',
        'view_count',
        'download_count',
        'like_count',
        'save_count',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function educationLevel()
    {
        return $this->belongsTo(EducationLevel::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function major()
    {
        return $this->belongsTo(Major::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function savedByUsers()
    {
        return $this->hasMany(SavedDocument::class);
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function documentLikes()
    {
        return $this->hasMany(DocumentLike::class);
    }

    public function views()
    {
        return $this->hasMany(DocumentView::class);
    }

    public function statistics()
    {
        return $this->hasOne(DocumentStatistic::class);
    }

    public function activities()
    {
        return $this->hasMany(UserDocumentActivity::class);
    }
}
