<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'category',
        'head',
        'description',
        'programmes',
    ];

    protected function casts(): array
    {
        return [
            'programmes' => 'array',
        ];
    }

    public function faculty()
    {
        return $this->hasMany(Faculty::class, 'department_id', 'id')->where('status', 'active');
    }
}
