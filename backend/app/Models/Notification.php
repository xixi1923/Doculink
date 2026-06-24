<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Schema;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'related_id',
        'related_type',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isRead(): bool
    {
        if (Schema::hasColumn($this->getTable(), 'is_read')) {
            return (bool) $this->getAttribute('is_read');
        }

        return $this->getAttribute('read_at') !== null;
    }

    public function markAsRead(): void
    {
        if (!$this->isRead()) {
            $data = Schema::hasColumn($this->getTable(), 'is_read')
                ? ['is_read' => true]
                : ['read_at' => now()];

            $this->update($data);
        }
    }
}
