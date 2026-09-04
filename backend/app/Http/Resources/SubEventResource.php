<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubEventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_id' => $this->event_id,
            'title' => $this->title,
            'description' => $this->description,
            'event_date' => $this->event_date ? $this->event_date->format('Y-m-d') : null,
            'date' => $this->event_date ? $this->event_date->format('Y-m-d') : null,
            'displayDate' => $this->display_date ?: ($this->event_date ? $this->event_date->format('F d, Y') : null),
            'time_range' => $this->time_range,
            'time' => $this->time_range,
            'location' => $this->location,
            'venue' => $this->location,
            'attachments' => $this->attachments ? $this->attachments->map(fn($a) => [
                'title' => $a->title,
                'url' => $a->url,
                'type' => $a->type,
            ]) : [],
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
