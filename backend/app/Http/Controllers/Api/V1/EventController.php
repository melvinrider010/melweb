<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Http\Resources\EventResource;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Get upcoming events (event itself is upcoming OR has upcoming sub-events).
     */
    public function upcoming(Request $request)
    {
        $query = Event::upcoming();

        if ($request->filled('level') && $request->level !== 'all') {
            $query->where(function ($q) use ($request) {
                $q->where('level', $request->level)->orWhere('level', 'all');
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', $s)
                  ->orWhere('description', 'like', $s)
                  ->orWhere('location', 'like', $s);
            });
        }

        $events = $query->get();

        // Sort by effective upcoming date (earliest relevant date)
        $today = now()->toDateString();
        $sorted = $events->sortBy(function ($event) use ($today) {
            $dates = [];
            if ($event->event_date && $event->event_date->format('Y-m-d') >= $today) {
                $dates[] = $event->event_date->format('Y-m-d');
            }
            if ($event->end_date && $event->end_date->format('Y-m-d') >= $today) {
                $dates[] = $event->end_date->format('Y-m-d');
            }
            foreach ($event->subEvents as $sub) {
                if ($sub->event_date && $sub->event_date->format('Y-m-d') >= $today) {
                    $dates[] = $sub->event_date->format('Y-m-d');
                }
            }
            return !empty($dates) ? min($dates) : ($event->event_date ? $event->event_date->format('Y-m-d') : '9999-12-31');
        })->values();

        return EventResource::collection($sorted);
    }

    /**
     * Get past / archived events.
     */
    public function past(Request $request)
    {
        $query = Event::past();

        if ($request->filled('level') && $request->level !== 'all') {
            $query->where(function ($q) use ($request) {
                $q->where('level', $request->level)->orWhere('level', 'all');
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', $s)
                  ->orWhere('description', 'like', $s)
                  ->orWhere('location', 'like', $s);
            });
        }

        $events = $query->get();

        return EventResource::collection($events);
    }

    /**
     * Get all events.
     */
    public function index(Request $request)
    {
        $events = Event::with(['subEvents', 'attachments'])->orderBy('event_date', 'desc')->get();
        return EventResource::collection($events);
    }

    /**
     * Get single event by id or slug.
     */
    public function show($id)
    {
        $event = Event::with(['subEvents', 'attachments'])
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        return new EventResource($event);
    }
}
