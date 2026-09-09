<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use App\Models\ActivityLog;
use App\Http\Resources\NoticeResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class NoticeController extends Controller
{
    /**
     * Store a newly created notice.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Notice::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'nullable|string',
            'level' => 'nullable|string|in:all,ug,pg',
            'refNo' => 'nullable|string',
            'date' => 'required|date',
            'displayDate' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'summary' => 'nullable|string',
            'documentImage' => 'nullable|string',
            'content' => 'nullable|array',
            'signatory' => 'nullable|string',
            'department' => 'nullable|string',
            'link' => 'nullable|string',
            'downloadable' => 'nullable|boolean',
            'linked_event_id' => 'nullable|string',
            'linked_sub_event_id' => 'nullable|string',
        ]);

        $id = $request->input('id') ?: 'not_' . Str::random(8);
        $slug = $request->input('slug') ?: Str::slug($validated['title']) . '-' . Str::random(4);

        $notice = Notice::create([
            'id' => $id,
            'slug' => $slug,
            'type' => $validated['type'] ?? 'Notice',
            'level' => $validated['level'] ?? 'all',
            'title' => $validated['title'],
            'ref_no' => $validated['refNo'] ?? null,
            'date' => $validated['date'],
            'display_date' => $validated['displayDate'] ?? null,
            'category' => $validated['category'] ?? null,
            'tags' => $validated['tags'] ?? ['CIRCULAR'],
            'summary' => $validated['summary'] ?? null,
            'document_image' => $validated['documentImage'] ?? null,
            'content' => $validated['content'] ?? null,
            'signatory' => $validated['signatory'] ?? null,
            'department' => $validated['department'] ?? null,
            'link' => $validated['link'] ?? null,
            'downloadable' => $validated['downloadable'] ?? false,
            'linked_event_id' => $validated['linked_event_id'] ?? null,
            'linked_sub_event_id' => $validated['linked_sub_event_id'] ?? null,
        ]);

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?: 'admin@stphilos.ac.in',
            'action' => 'CREATE_NOTICE',
            'module' => 'Notices',
            'details' => "Published notice/circular '{$notice->title}'.",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Notice published successfully.',
            'notice' => new NoticeResource($notice),
        ], 201);
    }

    /**
     * Update an existing notice.
     */
    public function update(Request $request, $id)
    {
        $notice = Notice::where('id', $id)->orWhere('slug', $id)->firstOrFail();
        Gate::authorize('update', $notice);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'type' => 'nullable|string',
            'level' => 'nullable|string|in:all,ug,pg',
            'refNo' => 'nullable|string',
            'date' => 'sometimes|date',
            'displayDate' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'summary' => 'nullable|string',
            'documentImage' => 'nullable|string',
            'content' => 'nullable|array',
            'signatory' => 'nullable|string',
            'department' => 'nullable|string',
            'link' => 'nullable|string',
            'downloadable' => 'nullable|boolean',
        ]);

        $updateData = [];
        if (isset($validated['title'])) $updateData['title'] = $validated['title'];
        if (isset($validated['type'])) $updateData['type'] = $validated['type'];
        if (isset($validated['level'])) $updateData['level'] = $validated['level'];
        if (isset($validated['refNo'])) $updateData['ref_no'] = $validated['refNo'];
        if (isset($validated['date'])) $updateData['date'] = $validated['date'];
        if (isset($validated['displayDate'])) $updateData['display_date'] = $validated['displayDate'];
        if (isset($validated['category'])) $updateData['category'] = $validated['category'];
        if (isset($validated['tags'])) $updateData['tags'] = $validated['tags'];
        if (isset($validated['summary'])) $updateData['summary'] = $validated['summary'];
        if (isset($validated['documentImage'])) $updateData['document_image'] = $validated['documentImage'];
        if (isset($validated['content'])) $updateData['content'] = $validated['content'];
        if (isset($validated['signatory'])) $updateData['signatory'] = $validated['signatory'];
        if (isset($validated['department'])) $updateData['department'] = $validated['department'];
        if (isset($validated['link'])) $updateData['link'] = $validated['link'];
        if (isset($validated['downloadable'])) $updateData['downloadable'] = $validated['downloadable'];

        $notice->update($updateData);

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?: 'admin@stphilos.ac.in',
            'action' => 'UPDATE_NOTICE',
            'module' => 'Notices',
            'details' => "Updated notice '{$notice->title}'.",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Notice updated successfully.',
            'notice' => new NoticeResource($notice),
        ]);
    }

    /**
     * Remove the specified notice.
     */
    public function destroy(Request $request, $id)
    {
        $notice = Notice::where('id', $id)->orWhere('slug', $id)->firstOrFail();
        Gate::authorize('delete', $notice);

        $title = $notice->title;
        $notice->delete();

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?: 'admin@stphilos.ac.in',
            'action' => 'DELETE_NOTICE',
            'module' => 'Notices',
            'details' => "Deleted notice '{$title}'.",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Notice '{$title}' deleted successfully.",
        ]);
    }
}