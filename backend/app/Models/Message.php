<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['conversation_id', 'sender_id', 'receiver_id', 'message', 'read_at'];

    protected $appends = ['type'];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function reads()
    {
        return $this->hasMany(MessageRead::class);
    }

    public function attachments()
    {
        return $this->hasMany(MessageAttachment::class);
    }

    /**
     * Determine the message type based on content
     */
    public function type(): Attribute
    {
        return new Attribute(
            get: function () {
                if ($this->attachments && $this->attachments->count() > 0) {
                    $firstAttachment = $this->attachments->first();
                    if ($firstAttachment->file_type && str_starts_with($firstAttachment->file_type, 'image/')) {
                        return 'image';
                    } elseif ($firstAttachment->file_type && str_starts_with($firstAttachment->file_type, 'video/')) {
                        return 'video';
                    }
                    return 'file';
                }
                return 'text';
            }
        );
    }
}
