<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'firebase_uid',
        'username',
        'name',
        'email',
        'password',
        'avatar',
        'bio',
        'university_id',
        'major',
        'school',
        'affiliation',
        'country',
        'academic_title',
        'research_interests',
        'social_links',
        'role',
        'status',
        'is_premium',
        'premium_until',
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
            'research_interests' => 'array',
            'social_links' => 'array',
            'is_premium' => 'boolean',
            'premium_until' => 'datetime',
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

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id');
    }

    public function followings()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id');
    }

    /**
     * Users that this user has blocked
     */
    public function blockedUsers()
    {
        return $this->hasMany(UserBlock::class, 'blocker_id');
    }

    /**
     * Users that have blocked this user
     */
    public function blockedByUsers()
    {
        return $this->hasMany(UserBlock::class, 'blocked_id');
    }

    /**
     * Check if user is blocked by another user
     */
    public function isBlockedBy($userId)
    {
        return $this->blockedByUsers()->where('blocker_id', $userId)->exists();
    }

    /**
     * Check if user has blocked another user
     */
    public function hasBlocked($userId)
    {
        return $this->blockedUsers()->where('blocked_id', $userId)->exists();
    }
}
