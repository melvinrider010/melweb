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
        'slug',
        'short_description',
        'category',
        'head',
        'description',
        'banner_image',
        'programmes',
        'status',
        'display_order',
        'seo_title',
        'seo_description',
        'published_at',
        'published_by',
        'last_updated_by',
    ];

    protected function casts(): array
    {
        return [
            'programmes' => 'array',
            'display_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function faculty()
    {
        return $this->hasMany(Faculty::class, 'department_id', 'id')->where('status', 'active');
    }

    public function sections()
    {
        return $this->hasMany(DepartmentSection::class, 'department_id', 'id');
    }

    public function publishedSections()
    {
        return $this->hasMany(DepartmentSection::class, 'department_id', 'id')
            ->where('version', 'published')
            ->where('is_enabled', true)
            ->orderBy('display_order', 'asc');
    }

    public function draftSections()
    {
        return $this->hasMany(DepartmentSection::class, 'department_id', 'id')
            ->where('version', 'draft')
            ->orderBy('display_order', 'asc');
    }
}
