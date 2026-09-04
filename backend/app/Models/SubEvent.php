<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubEvent extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'event_id',
        'title',
        'description',
        'event_date',
        'display_date',
        'time_range',
        'location',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date:Y-m-d',
        ];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(EventAttachment::class, 'sub_event_id');
    }
}
