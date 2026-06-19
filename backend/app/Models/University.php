<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'image',
        'students_count',
        'rating',
        'description',
    ];

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
