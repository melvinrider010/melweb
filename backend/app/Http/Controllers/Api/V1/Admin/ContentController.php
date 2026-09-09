<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use App\Models\Document;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\Programme;
use App\Models\Setting;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class ContentController extends Controller
{
    // --- Sliders ---
    public function storeSlider(Request $request)
    {
        Gate::authorize('create', Slider::class);

        $validated = $request->validate([
            'title' => 'required|string',
            'category' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'required|string',
            'ctaText' => 'nullable|string',
            'ctaLink' => 'nullable|string',
            'status' => 'nullable|string',
            'priority' => 'nullable|integer',
        ]);

        $slider = Slider::create([
            'id' => $request->input('id') ?: 'sld_' . Str::random(8),
            'title' => $validated['title'],
            'category' => $validated['category'] ?? null,
            'subtitle' => $validated['subtitle'] ?? null,
            'description' => $validated['description'] ?? null,
            'image' => $validated['image'],
            'cta_text' => $validated['ctaText'] ?? null,
            'cta_link' => $validated['ctaLink'] ?? null,
            'status' => $validated['status'] ?? 'published',
            'priority' => $validated['priority'] ?? 1,
        ]);

        return response()->json(['status' => 'success', 'slider' => $slider], 201);
    }

    public function destroySlider(Request $request, $id)
    {
        $slider = Slider::findOrFail($id);
        Gate::authorize('delete', $slider);

        $slider->delete();
        return response()->json(['status' => 'success', 'message' => 'Slider deleted.']);
    }

    // --- Faculty ---
    public function storeFaculty(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|string',
            'name' => 'required|string',
            'designation' => 'nullable|string',
            'department' => 'nullable|string',
            'qualification' => 'nullable|string',
            'profile' => 'nullable|string',
            'photoUrl' => 'nullable|string',
            'source_url' => 'nullable|string',
        ]);

        $id = $request->input('id');
        if ($id && ($existing = Faculty::find($id))) {
            Gate::authorize('update', $existing);
            $existing->update([
                'name' => $validated['name'],
                'designation' => $validated['designation'] ?? $existing->designation,
                'department' => $validated['department'] ?? $existing->department,
                'qualification' => $validated['qualification'] ?? $existing->qualification,
                'profile' => $validated['profile'] ?? $existing->profile,
                'photo_url' => $validated['photoUrl'] ?? $existing->photo_url,
                'source_url' => $validated['source_url'] ?? $existing->source_url,
            ]);

            ActivityLog::create([
                'id' => 'log_' . Str::random(10),
                'user_id' => $request->user()?->id,
                'user_email' => $request->user()?->email ?? 'admin@stphilos.ac.in',
                'action' => 'UPDATE_FACULTY',
                'module' => 'Faculty',
                'details' => "Updated faculty {$existing->name} ({$existing->id})",
            ]);

            return response()->json(['status' => 'success', 'faculty' => $existing], 200);
        }

        Gate::authorize('create', [Faculty::class, $validated['department'] ?? null]);

        $faculty = Faculty::create([
            'id' => $id ?: 'fac_' . Str::random(8),
            'name' => $validated['name'],
            'designation' => $validated['designation'] ?? null,
            'department' => $validated['department'] ?? null,
            'qualification' => $validated['qualification'] ?? null,
            'profile' => $validated['profile'] ?? null,
            'photo_url' => $validated['photoUrl'] ?? null,
            'source_url' => $validated['source_url'] ?? null,
        ]);

        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?? 'admin@stphilos.ac.in',
            'action' => 'CREATE_FACULTY',
            'module' => 'Faculty',
            'details' => "Created faculty {$faculty->name} ({$faculty->id}) in department " . ($faculty->department ?? 'Unassigned'),
        ]);

        return response()->json(['status' => 'success', 'faculty' => $faculty], 201);
    }

    public function updateFaculty(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);
        Gate::authorize('update', $faculty);

        $validated = $request->validate([
            'name' => 'required|string',
            'designation' => 'nullable|string',
            'department' => 'nullable|string',
            'qualification' => 'nullable|string',
            'profile' => 'nullable|string',
            'photoUrl' => 'nullable|string',
            'source_url' => 'nullable|string',
        ]);

        $faculty->update([
            'name' => $validated['name'],
            'designation' => $validated['designation'] ?? $faculty->designation,
            'department' => $validated['department'] ?? $faculty->department,
            'qualification' => $validated['qualification'] ?? $faculty->qualification,
            'profile' => $validated['profile'] ?? $faculty->profile,
            'photo_url' => $validated['photoUrl'] ?? $faculty->photo_url,
            'source_url' => $validated['source_url'] ?? $faculty->source_url,
        ]);

        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?? 'admin@stphilos.ac.in',
            'action' => 'UPDATE_FACULTY',
            'module' => 'Faculty',
            'details' => "Updated faculty {$faculty->name} ({$faculty->id})",
        ]);

        return response()->json(['status' => 'success', 'faculty' => $faculty]);
    }

    public function destroyFaculty(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);
        Gate::authorize('delete', $faculty);

        $facultyName = $faculty->name;
        $facultyId = $faculty->id;
        $faculty->delete();

        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?? 'admin@stphilos.ac.in',
            'action' => 'DELETE_FACULTY',
            'module' => 'Faculty',
            'details' => "Deleted faculty {$facultyName} ({$facultyId})",
        ]);

        return response()->json(['status' => 'success', 'message' => 'Faculty member deleted.']);
    }

    // --- Documents ---
    public function storeDocument(Request $request)
    {
        Gate::authorize('create', Document::class);

        $validated = $request->validate([
            'title' => 'required|string',
            'filename' => 'required|string',
            'originalUrl' => 'nullable|string',
            'localPath' => 'nullable|string',
            'category' => 'nullable|string',
            'year' => 'nullable|string',
        ]);

        $doc = Document::create([
            'id' => $request->input('id') ?: 'doc_' . Str::random(8),
            'title' => $validated['title'],
            'filename' => $validated['filename'],
            'original_url' => $validated['originalUrl'] ?? null,
            'local_path' => $validated['localPath'] ?? null,
            'category' => $validated['category'] ?? 'Other',
            'year' => $validated['year'] ?? null,
        ]);

        return response()->json(['status' => 'success', 'document' => $doc], 201);
    }

    public function destroyDocument(Request $request, $id)
    {
        $doc = Document::findOrFail($id);
        Gate::authorize('delete', $doc);

        $doc->delete();
        return response()->json(['status' => 'success', 'message' => 'Document deleted.']);
    }

    // --- Settings ---
    public function updateSettings(Request $request)
    {
        Gate::authorize('update', Setting::class);

        $data = $request->all();
        foreach ($data as $k => $v) {
            Setting::updateOrCreate(['key' => $k], ['value' => $v]);
        }
        return response()->json(['status' => 'success', 'settings' => Setting::all()->pluck('value', 'key')]);
    }

    // --- Logs ---
    public function logs(Request $request)
    {
        Gate::authorize('viewAny', ActivityLog::class);

        $logs = ActivityLog::orderBy('created_at', 'desc')->take(100)->get();
        return response()->json($logs);
    }
}