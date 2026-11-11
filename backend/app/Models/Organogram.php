<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organogram extends Model
{
    use HasFactory;

    protected $table = 'organograms';

    protected $fillable = [
        'title',
        'description',
        'status',
        'layout_settings',
        'current_published_version_id',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'layout_settings' => 'array',
    ];

    public function versions()
    {
        return $this->hasMany(OrganogramVersion::class, 'organogram_id')->orderBy('created_at', 'desc');
    }

    public function publishedVersion()
    {
        return $this->belongsTo(OrganogramVersion::class, 'current_published_version_id');
    }

    public function latestDraftVersion()
    {
        return $this->hasOne(OrganogramVersion::class, 'organogram_id')
                    ->where('status', 'draft')
                    ->latest();
    }
}
