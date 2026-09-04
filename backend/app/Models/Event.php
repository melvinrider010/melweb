<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'slug',
        'title',
        'description',
        'summary',
        'event_date',
        'end_date',
        'display_date',
        'time_range',
        'location',
        'category',
        'level',
        'ref_no',
        'document_image',
        'document_pdf',
        'signatory',
        'department',
        'content',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
            'content' => 'array',
        ];
    }

    public function subEvents(): HasMany
    {
        return $this->hasMany(SubEvent::class, 'event_id')->orderBy('event_date', 'asc');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(EventAttachment::class, 'event_id');
    }

    public function notices(): HasMany
    {
        return $this->hasMany(Notice::class, 'linked_event_id');
    }

    /**
     * Scope: Upcoming Events (event itself is future OR has future sub-events)
     */
    public function scopeUpcoming(Builder $query, ?string $today = null): Builder
    {
        $today = $today ?: now()->toDateString();

        return $query->where(function ($q) use ($today) {
            $q->where('event_date', '>=', $today)
              ->orWhere(function ($q2) use ($today) {
                  $q2->whereNotNull('end_date')
                     ->where('end_date', '>=', $today);
              })
              ->orWhereHas('subEvents', function ($subQ) use ($today) {
                  $subQ->where('event_date', '>=', $today);
              });
        })->with(['subEvents', 'attachments']);
    }

    /**
     * Scope: Past / Archived Events
     */
    public function scopePast(Builder $query, ?string $today = null): Builder
    {
        $today = $today ?: now()->toDateString();

        return $query->where(function ($q) use ($today) {
            $q->where(function ($q2) use ($today) {
                $q2->whereNull('end_date')->where('event_date', '<', $today);
            })->orWhere(function ($q3) use ($today) {
                $q3->whereNotNull('end_date')->where('end_date', '<', $today);
            });
        })->whereDoesntHave('subEvents', function ($subQ) use ($today) {
            $subQ->where('event_date', '>=', $today);
        })->with(['subEvents', 'attachments'])
          ->orderBy('event_date', 'desc');
    }
}
