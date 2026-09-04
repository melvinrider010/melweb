<?php

namespace App\Observers;

use App\Models\Event;
use App\Models\Notice;

class EventObserver
{
    /**
     * Handle the Event "created" event.
     * Auto-generates a corresponding linked Notice.
     */
    public function created(Event $event): void
    {
        $categoryTag = strtoupper(preg_replace('/[^A-Za-z]/', '', explode(' ', $event->category ?? '')[0] ?? ''));
        $tags = ['EVENT'];
        if ($categoryTag) {
            $tags[] = $categoryTag;
        }
        if ($event->level && $event->level !== 'all') {
            $tags[] = strtoupper($event->level);
        }

        Notice::updateOrCreate(
            ['id' => "notice-evt-{$event->id}"],
            [
                'slug' => $event->slug,
                'type' => 'Event',
                'level' => $event->level ?: 'all',
                'title' => $event->title,
                'ref_no' => $event->ref_no,
                'date' => $event->event_date,
                'display_date' => $event->display_date ?: $event->event_date->format('F d, Y'),
                'category' => $event->category,
                'tags' => $tags,
                'summary' => $event->description ?: $event->summary,
                'document_image' => $event->document_image,
                'content' => $event->content,
                'signatory' => $event->signatory,
                'department' => $event->department,
                'link' => "/news-events/{$event->id}",
                'linked_event_id' => $event->id,
                'linked_sub_event_id' => null,
                'downloadable' => !empty($event->document_pdf),
            ]
        );
    }

    /**
     * Handle the Event "updated" event.
     */
    public function updated(Event $event): void
    {
        $notice = Notice::where('linked_event_id', $event->id)->first();
        if ($notice) {
            $categoryTag = strtoupper(preg_replace('/[^A-Za-z]/', '', explode(' ', $event->category ?? '')[0] ?? ''));
            $tags = ['EVENT'];
            if ($categoryTag) {
                $tags[] = $categoryTag;
            }
            if ($event->level && $event->level !== 'all') {
                $tags[] = strtoupper($event->level);
            }

            $notice->update([
                'slug' => $event->slug,
                'level' => $event->level ?: 'all',
                'title' => $event->title,
                'ref_no' => $event->ref_no,
                'date' => $event->event_date,
                'display_date' => $event->display_date ?: $event->event_date->format('F d, Y'),
                'category' => $event->category,
                'tags' => $tags,
                'summary' => $event->description ?: $event->summary,
                'document_image' => $event->document_image,
                'content' => $event->content,
                'signatory' => $event->signatory,
                'department' => $event->department,
                'link' => "/news-events/{$event->id}",
                'downloadable' => !empty($event->document_pdf),
            ]);
        }
    }

    /**
     * Handle the Event "deleted" event.
     */
    public function deleted(Event $event): void
    {
        Notice::where('linked_event_id', $event->id)->delete();
    }
}
