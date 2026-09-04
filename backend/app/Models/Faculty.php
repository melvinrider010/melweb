<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'faculty';

    protected $fillable = [
        'id',
        'name',
        'designation',
        'department',
        'qualification',
        'source_url',
        'source_verified',
        'profile',
        'photo_url',
    ];

    protected function casts(): array
    {
        return [
            'source_verified' => 'boolean',
        ];
    }
}
