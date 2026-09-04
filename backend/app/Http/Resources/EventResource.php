<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'summary' => $this->summary,
            'event_date' => $this->event_date ? $this->event_date->format('Y-m-d') : null,
            'date' => $this->event_date ? $this->event_date->format('Y-m-d') : null, // legacy alias
            'end_date' => $this->end_date ? $this->end_date->format('Y-m-d') : null,
            'displayDate' => $this->display_date ?: ($this->event_date ? $this->event_date->format('F d, Y') : null),
            'time_range' => $this->time_range,
            'time' => $this->time_range, // legacy alias
            'location' => $this->location,
            'venue' => $this->location, // legacy alias
            'category' => $this->category,
            'level' => $this->level,
            'refNo' => $this->ref_no,
            'documentImage' => $this->document_image,
            'documentPdf' => $this->document_pdf,
            'signatory' => $this->signatory,
            'department' => $this->department,
            'content' => $this->content ?: [],
            'attachments' => $this->attachments ? $this->attachments->map(fn($a) => [
                'title' => $a->title,
                'url' => $a->url,
                'type' => $a->type,
            ]) : [],
            'subEvents' => SubEventResource::collection($this->whenLoaded('subEvents')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
