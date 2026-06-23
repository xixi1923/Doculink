<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypingIndicator extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'user_id',
        'typing_at',
    ];

    protected $casts = [
        'typing_at' => 'datetime',
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
