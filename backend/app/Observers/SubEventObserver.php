<?php

namespace App\Observers;

use App\Models\SubEvent;
use App\Models\Notice;

class SubEventObserver
{
    /**
     * Handle the SubEvent "created" event.
     */
    public function created(SubEvent $subEvent): void
    {
        $parent = $subEvent->event;
        if (!$parent) {
            return;
        }

        $notice = Notice::where('linked_event_id', $parent->id)->first();
        if ($notice) {
            $formattedSubDate = $subEvent->event_date ? $subEvent->event_date->format('Y-m-d') : '';
            $subSnippet = " (Includes Sub-Event: {$subEvent->title} on {$formattedSubDate})";
            if (!str_contains($notice->summary, $subEvent->title)) {
                $notice->update([
                    'summary' => ($parent->summary ?: $parent->description) . $subSnippet,
                    'linked_sub_event_id' => $subEvent->id,
                ]);
            }
        }
    }

    /**
     * Handle the SubEvent "deleted" event.
     */
    public function deleted(SubEvent $subEvent): void
    {
        $parent = $subEvent->event;
        if ($parent) {
            $notice = Notice::where('linked_event_id', $parent->id)->first();
            if ($notice && $notice->linked_sub_event_id === $subEvent->id) {
                $notice->update([
                    'summary' => $parent->summary ?: $parent->description,
                    'linked_sub_event_id' => null,
                ]);
            }
        }
    }
}
