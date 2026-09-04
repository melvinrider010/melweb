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
use Illuminate\Support\Str;

class ContentController extends Controller
{
    // --- Sliders ---
    public function storeSlider(Request $request)
    {
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
        $slider->delete();
        return response()->json(['status' => 'success', 'message' => 'Slider deleted.']);
    }

    // --- Faculty ---
    public function storeFaculty(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'designation' => 'nullable|string',
            'department' => 'nullable|string',
            'qualification' => 'nullable|string',
            'profile' => 'nullable|string',
            'photoUrl' => 'nullable|string',
        ]);

        $faculty = Faculty::create([
            'id' => $request->input('id') ?: 'fac_' . Str::random(8),
            'name' => $validated['name'],
            'designation' => $validated['designation'] ?? null,
            'department' => $validated['department'] ?? null,
            'qualification' => $validated['qualification'] ?? null,
            'profile' => $validated['profile'] ?? null,
            'photo_url' => $validated['photoUrl'] ?? null,
        ]);

        return response()->json(['status' => 'success', 'faculty' => $faculty], 201);
    }

    public function destroyFaculty(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete();
        return response()->json(['status' => 'success', 'message' => 'Faculty member deleted.']);
    }

    // --- Documents ---
    public function storeDocument(Request $request)
    {
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
        $doc->delete();
        return response()->json(['status' => 'success', 'message' => 'Document deleted.']);
    }

    // --- Settings ---
    public function updateSettings(Request $request)
    {
        $data = $request->all();
        foreach ($data as $k => $v) {
            Setting::updateOrCreate(['key' => $k], ['value' => $v]);
        }
        return response()->json(['status' => 'success', 'settings' => Setting::all()->pluck('value', 'key')]);
    }

    // --- Logs ---
    public function logs()
    {
        $logs = ActivityLog::orderBy('created_at', 'desc')->take(100)->get();
        return response()->json($logs);
    }
}
