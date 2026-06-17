<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['id', 'type', 'notifiable_type', 'notifiable_id', 'data', 'read_at'];

    public $incrementing = false;
    protected $keyType = 'string';
}
