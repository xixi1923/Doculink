<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'firebase_uid',
        'name',
        'email',
        'password',
        'avatar',
        'bio',
        'university_id',
        'major',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function books()
    {
        return $this->hasMany(Book::class, 'uploaded_by');
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function downloadLogs()
    {
        return $this->hasMany(DownloadLog::class);
    }
}
