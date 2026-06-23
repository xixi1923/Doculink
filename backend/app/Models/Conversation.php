<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conversation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'status',
        'ended_at',
    ];

    protected $casts = [
        'ended_at' => 'datetime',
    ];

    public function participants()
    {
        return $this->hasMany(ConversationParticipant::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'conversation_participants');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Check if conversation is ended
     */
    public function isEnded()
    {
        return $this->status === 'ended';
    }

    /**
     * Mark conversation as ended
     */
    public function end()
    {
        return $this->update([
            'status' => 'ended',
            'ended_at' => now(),
        ]);
    }

    /**
     * Reopen a conversation
     */
    public function reopen()
    {
        return $this->update([
            'status' => 'active',
            'ended_at' => null,
        ]);
    }
}

