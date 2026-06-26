<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id',
        'trending_score',
        'recommendation_score',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}
