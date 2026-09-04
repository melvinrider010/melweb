<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    public $incrementing = false;
    protected $primaryKey = 'code';
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'level',
        'title',
        'degree',
        'duration',
        'eligibility',
        'overview',
        'departments',
        'pdf_link',
        'outcomes',
        'source_url',
        'source_verified',
    ];

    protected function casts(): array
    {
        return [
            'departments' => 'array',
            'source_verified' => 'boolean',
        ];
    }
}
