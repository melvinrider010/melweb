<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventAttachment extends Model
{
    protected $fillable = [
        'event_id',
        'sub_event_id',
        'title',
        'url',
        'type',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function subEvent(): BelongsTo
    {
        return $this->belongsTo(SubEvent::class, 'sub_event_id');
    }
}
