<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDocumentActivity extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $table = 'user_document_activity';

    protected $fillable = [
        'user_id',
        'document_id',
        'action',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}
