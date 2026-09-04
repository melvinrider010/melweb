<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notice extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'slug',
        'type',
        'level',
        'title',
        'ref_no',
        'date',
        'display_date',
        'category',
        'tags',
        'summary',
        'document_image',
        'content',
        'signatory',
        'department',
        'link',
        'downloadable',
        'linked_event_id',
        'linked_sub_event_id',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'tags' => 'array',
            'content' => 'array',
            'downloadable' => 'boolean',
        ];
    }

    public function linkedEvent(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'linked_event_id');
    }

    public function linkedSubEvent(): BelongsTo
    {
        return $this->belongsTo(SubEvent::class, 'linked_sub_event_id');
    }
}
