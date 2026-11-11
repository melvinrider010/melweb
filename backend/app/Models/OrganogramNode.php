<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganogramNode extends Model
{
    use HasFactory;

    protected $table = 'organogram_nodes';

    // The primary key is non-incrementing string ID
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'organogram_version_id',
        'parent_id',
        'node_type',
        'title',
        'designation',
        'person_name',
        'description',
        'department_id',
        'display_order',
        'node_metadata',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'node_metadata' => 'array',
    ];

    public function version()
    {
        return $this->belongsTo(OrganogramVersion::class, 'organogram_version_id');
    }

    public function parent()
    {
        return $this->belongsTo(OrganogramNode::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(OrganogramNode::class, 'parent_id')->orderBy('display_order', 'asc');
    }
}
