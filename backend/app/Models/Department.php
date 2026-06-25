<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_full_name',
        'department_short_name',
    ];

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
