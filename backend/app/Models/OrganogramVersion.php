<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganogramVersion extends Model
{
    use HasFactory;

    protected $table = 'organogram_versions';

    protected $fillable = [
        'organogram_id',
        'version_number',
        'status',
        'snapshot_data',
        'change_summary',
        'created_by',
        'published_by',
        'published_at',
    ];

    protected $casts = [
        'snapshot_data' => 'array',
        'published_at' => 'datetime',
    ];

    public function organogram()
    {
        return $this->belongsTo(Organogram::class, 'organogram_id');
    }

    public function nodes()
    {
        return $this->hasMany(OrganogramNode::class, 'organogram_version_id')->orderBy('display_order', 'asc');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function publisher()
    {
        return $this->belongsTo(User::class, 'published_by');
    }
}
