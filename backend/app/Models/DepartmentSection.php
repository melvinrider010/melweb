<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepartmentSection extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'department_id',
        'section_key',
        'title',
        'type',
        'content',
        'display_order',
        'is_enabled',
        'version',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'is_enabled' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'id');
    }
}
