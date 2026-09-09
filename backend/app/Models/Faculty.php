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
        'department_id',
        'status',
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

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'id');
    }

    public function programmes()
    {
        return $this->belongsToMany(Programme::class, 'faculty_programme', 'faculty_id', 'programme_code', 'id', 'code');
    }
}
