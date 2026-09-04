<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\SubEvent;
use App\Models\EventAttachment;
use App\Models\ActivityLog;
use App\Http\Resources\EventResource;
use App\Http\Resources\SubEventResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Create a new event.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'summary' => 'nullable|string',
            'event_date' => 'required|date',
            'end_date' => 'nullable|date',
            'displayDate' => 'nullable|string',
            'time_range' => 'nullable|string',
            'location' => 'nullable|string',
            'category' => 'nullable|string',
            'level' => 'nullable|string|in:all,ug,pg',
            'refNo' => 'nullable|string',
            'documentImage' => 'nullable|string',
            'documentPdf' => 'nullable|string',
            'signatory' => 'nullable|string',
            'department' => 'nullable|string',
            'content' => 'nullable|array',
            'subEvents' => 'nullable|array',
            'attachments' => 'nullable|array',
        ]);

        $id = $request->input('id') ?: 'evt_' . Str::random(8);
        $slug = $request->input('slug') ?: Str::slug($validated['title']) . '-' . Str::random(4);

        $event = Event::create([
            'id' => $id,
            'slug' => $slug,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? $validated['summary'] ?? null,
            'summary' => $validated['summary'] ?? $validated['description'] ?? null,
            'event_date' => $validated['event_date'],
            'end_date' => $validated['end_date'] ?? null,
            'display_date' => $validated['displayDate'] ?? null,
            'time_range' => $validated['time_range'] ?? '09:30 AM – 04:30 PM',
            'location' => $validated['location'] ?? 'College Campus',
            'category' => $validated['category'] ?? 'Conferences & Seminars',
            'level' => $validated['level'] ?? 'all',
            'ref_no' => $validated['refNo'] ?? null,
            'document_image' => $validated['documentImage'] ?? null,
            'document_pdf' => $validated['documentPdf'] ?? null,
            'signatory' => $validated['signatory'] ?? null,
            'department' => $validated['department'] ?? null,
            'content' => $validated['content'] ?? null,
        ]);

        if (!empty($validated['subEvents'])) {
            foreach ($validated['subEvents'] as $sub) {
                SubEvent::create([
                    'id' => $sub['id'] ?? 'sub_' . Str::random(8),
                    'event_id' => $event->id,
                    'title' => $sub['title'],
                    'description' => $sub['description'] ?? null,
                    'event_date' => $sub['event_date'] ?? $event->event_date,
                    'display_date' => $sub['displayDate'] ?? null,
                    'time_range' => $sub['time_range'] ?? '10:00 AM – 01:00 PM',
                    'location' => $sub['location'] ?? $event->location,
                ]);
            }
        }

        if (!empty($validated['attachments'])) {
            foreach ($validated['attachments'] as $att) {
                EventAttachment::create([
                    'event_id' => $event->id,
                    'title' => $att['title'],
                    'url' => $att['url'],
                    'type' => $att['type'] ?? 'image/jpeg',
                ]);
            }
        }

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?: 'admin@stphilos.ac.in',
            'action' => 'CREATE_EVENT',
            'module' => 'Events',
            'details' => "Created event '{$event->title}' and synced to Notice Board.",
        ]);

        $event->load(['subEvents', 'attachments']);
        return response()->json([
            'status' => 'success',
            'message' => 'Event created and synced successfully.',
            'event' => new EventResource($event),
        ], 201);
    }

    /**
     * Update an existing event.
     */
    public function update(Request $request, $id)
    {
        $event = Event::where('id', $id)->orWhere('slug', $id)->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'summary' => 'nullable|string',
            'event_date' => 'sometimes|date',
            'end_date' => 'nullable|date',
            'displayDate' => 'nullable|string',
            'time_range' => 'nullable|string',
            'location' => 'nullable|string',
            'category' => 'nullable|string',
            'level' => 'nullable|string|in:all,ug,pg',
            'refNo' => 'nullable|string',
            'documentImage' => 'nullable|string',
            'documentPdf' => 'nullable|string',
            'signatory' => 'nullable|string',
            'department' => 'nullable|string',
            'content' => 'nullable|array',
        ]);

        $updateData = [];
        if (isset($validated['title'])) $updateData['title'] = $validated['title'];
        if (isset($validated['description'])) $updateData['description'] = $validated['description'];
        if (isset($validated['summary'])) $updateData['summary'] = $validated['summary'];
        if (isset($validated['event_date'])) $updateData['event_date'] = $validated['event_date'];
        if (array_key_exists('end_date', $validated)) $updateData['end_date'] = $validated['end_date'];
        if (isset($validated['displayDate'])) $updateData['display_date'] = $validated['displayDate'];
        if (isset($validated['time_range'])) $updateData['time_range'] = $validated['time_range'];
        if (isset($validated['location'])) $updateData['location'] = $validated['location'];
        if (isset($validated['category'])) $updateData['category'] = $validated['category'];
        if (isset($validated['level'])) $updateData['level'] = $validated['level'];
        if (isset($validated['refNo'])) $updateData['ref_no'] = $validated['refNo'];
        if (isset($validated['documentImage'])) $updateData['document_image'] = $validated['documentImage'];
        if (isset($validated['documentPdf'])) $updateData['document_pdf'] = $validated['documentPdf'];
        if (isset($validated['signatory'])) $updateData['signatory'] = $validated['signatory'];
        if (isset($validated['department'])) $updateData['department'] = $validated['department'];
        if (isset($validated['content'])) $updateData['content'] = $validated['content'];

        $event->update($updateData);

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?: 'admin@stphilos.ac.in',
            'action' => 'UPDATE_EVENT',
            'module' => 'Events',
            'details' => "Updated event '{$event->title}'.",
        ]);

        $event->load(['subEvents', 'attachments']);
        return response()->json([
            'status' => 'success',
            'message' => 'Event updated successfully.',
            'event' => new EventResource($event),
        ]);
    }

    /**
     * Delete an event.
     */
    public function destroy(Request $request, $id)
    {
        $event = Event::where('id', $id)->orWhere('slug', $id)->firstOrFail();
        $title = $event->title;
        $event->delete();

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?: 'admin@stphilos.ac.in',
            'action' => 'DELETE_EVENT',
            'module' => 'Events',
            'details' => "Deleted event '{$title}' and unlinked notices.",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Event '{$title}' deleted successfully.",
        ]);
    }

    /**
     * Add a sub-event to an event (sub-event resurrection triggers here).
     */
    public function addSubEvent(Request $request, $eventId)
    {
        $event = Event::where('id', $eventId)->orWhere('slug', $eventId)->firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'displayDate' => 'nullable|string',
            'time_range' => 'nullable|string',
            'location' => 'nullable|string',
        ]);

        $subId = $request->input('id') ?: 'sub_' . Str::random(8);

        $subEvent = SubEvent::create([
            'id' => $subId,
            'event_id' => $event->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'event_date' => $validated['event_date'],
            'display_date' => $validated['displayDate'] ?? null,
            'time_range' => $validated['time_range'] ?? '10:00 AM – 01:00 PM',
            'location' => $validated['location'] ?? $event->location,
        ]);

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?: 'admin@stphilos.ac.in',
            'action' => 'ADD_SUB_EVENT',
            'module' => 'Events',
            'details' => "Added sub-event '{$subEvent->title}' on {$subEvent->event_date->format('Y-m-d')} to '{$event->title}'.",
        ]);

        $event->load(['subEvents', 'attachments']);
        return response()->json([
            'status' => 'success',
            'message' => "Sub-event '{$subEvent->title}' added successfully.",
            'subEvent' => new SubEventResource($subEvent),
            'event' => new EventResource($event),
        ], 201);
    }

    /**
     * Delete a sub-event.
     */
    public function destroySubEvent(Request $request, $id)
    {
        $subEvent = SubEvent::findOrFail($id);
        $title = $subEvent->title;
        $eventId = $subEvent->event_id;
        $subEvent->delete();

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?: 'admin@stphilos.ac.in',
            'action' => 'DELETE_SUB_EVENT',
            'module' => 'Events',
            'details' => "Deleted sub-event '{$title}'.",
        ]);

        $parent = Event::with(['subEvents', 'attachments'])->find($eventId);

        return response()->json([
            'status' => 'success',
            'message' => "Sub-event '{$title}' deleted successfully.",
            'event' => $parent ? new EventResource($parent) : null,
        ]);
    }
}
