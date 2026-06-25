<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Question extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'content', 'user_id', 'category_id', 'views', 'image_path', 'is_public'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($question) {
            $question->slug = Str::slug($question->title) . '-' . uniqid();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
