<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NoticeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'type' => $this->type,
            'level' => $this->level,
            'title' => $this->title,
            'refNo' => $this->ref_no,
            'date' => $this->date ? $this->date->format('Y-m-d') : null,
            'displayDate' => $this->display_date ?: ($this->date ? $this->date->format('F d, Y') : null),
            'category' => $this->category,
            'tags' => $this->tags ?: ['CIRCULAR'],
            'summary' => $this->summary,
            'documentImage' => $this->document_image,
            'content' => $this->content ?: [],
            'signatory' => $this->signatory,
            'department' => $this->department,
            'link' => $this->link,
            'downloadable' => (bool)$this->downloadable,
            'linked_event_id' => $this->linked_event_id,
            'linked_sub_event_id' => $this->linked_sub_event_id,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
