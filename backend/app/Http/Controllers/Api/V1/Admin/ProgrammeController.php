<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProgrammeController extends Controller
{
    /**
     * Helper to find a programme by code or id flexibly.
     */
    protected function findProgramme($code)
    {
        $clean = trim($code);
        $normalized = strtoupper(str_replace(['.', '-', '_', ' '], '', $clean));
        
        return Programme::where('code', $clean)
            ->orWhere('code', strtoupper($clean))
            ->orWhere('code', strtolower($clean))
            ->orWhereRaw("UPPER(REPLACE(REPLACE(REPLACE(code, '.', ''), '-', ''), ' ', '')) = ?", [$normalized])
            ->first();
    }

    /**
     * Admin listing of programmes.
     */
    public function index(Request $request)
    {
        $query = Programme::query();

        if ($request->filled('level') && strtolower($request->level) !== 'all') {
            $query->where('level', strtolower($request->level));
        }

        if ($request->filled('status') && strtolower($request->status) !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = '%' . trim($request->search) . '%';
            $query->where(function ($q) use ($s) {
                $q->where('code', 'like', $s)
                  ->orWhere('title', 'like', $s)
                  ->orWhere('degree', 'like', $s);
            });
        }

        $programmes = $query->orderBy('level', 'asc')->orderBy('title', 'asc')->get();

        return response()->json($programmes);
    }

    /**
     * Toggle Honeycomb showcase status (HEX ON / OFF).
     */
    public function toggleHoneycomb(Request $request, $code)
    {
        $programme = $this->findProgramme($code);

        if (!$programme) {
            return response()->json([
                'status' => 'error',
                'message' => "Programme '{$code}' not found."
            ], 404);
        }

        // Toggle the boolean value
        $programme->is_featured_honeycomb = !$programme->is_featured_honeycomb;
        $programme->save();

        // Audit log
        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?? 'admin@stphilos.ac.in',
            'action' => 'TOGGLE_PROGRAMME_HONEYCOMB',
            'module' => 'Programmes',
            'details' => "Toggled Honeycomb for '{$programme->title}' ({$programme->code}) to " . ($programme->is_featured_honeycomb ? 'ON' : 'OFF'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Honeycomb visibility for {$programme->code} set to " . ($programme->is_featured_honeycomb ? 'ON' : 'OFF'),
            'programme' => $programme,
            'is_featured_honeycomb' => (bool)$programme->is_featured_honeycomb
        ]);
    }

    /**
     * Toggle individual programme live status (LIVE ON / OFF).
     */
    public function toggleStatus(Request $request, $code)
    {
        $programme = $this->findProgramme($code);

        if (!$programme) {
            return response()->json([
                'status' => 'error',
                'message' => "Programme '{$code}' not found."
            ], 404);
        }

        $currentStatus = $programme->status ?: 'published';
        $programme->status = ($currentStatus === 'published') ? 'draft' : 'published';
        $programme->save();

        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?? 'admin@stphilos.ac.in',
            'action' => 'TOGGLE_PROGRAMME_STATUS',
            'module' => 'Programmes',
            'details' => "Toggled status for '{$programme->title}' ({$programme->code}) to {$programme->status}",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Status for {$programme->code} set to {$programme->status}",
            'programme' => $programme,
            'status' => $programme->status
        ]);
    }

    /**
     * Bulk update programme status by stream (UG/PG).
     */
    public function bulkStatus(Request $request)
    {
        $validated = $request->validate([
            'stream' => 'required|string|in:ug,pg,all',
            'status' => 'required|string|in:published,draft'
        ]);

        $query = Programme::query();
        if ($validated['stream'] !== 'all') {
            $query->where('level', strtolower($validated['stream']));
        }

        $updatedCount = $query->update(['status' => $validated['status']]);

        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?? 'admin@stphilos.ac.in',
            'action' => 'BULK_PROGRAMME_STATUS',
            'module' => 'Programmes',
            'details' => "Bulk updated {$validated['stream']} programmes status to {$validated['status']} ({$updatedCount} records)",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Bulk updated {$updatedCount} programmes to {$validated['status']}",
            'updated_count' => $updatedCount
        ]);
    }

    /**
     * Create a new programme.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:programmes,code',
            'title' => 'required|string',
            'level' => 'required|string|in:ug,pg',
            'degree' => 'nullable|string',
            'duration' => 'nullable|string',
            'eligibility' => 'nullable|string',
            'overview' => 'nullable|string',
            'departments' => 'nullable|array',
            'pdf_link' => 'nullable|string',
            'outcomes' => 'nullable|string',
            'status' => 'nullable|string|in:published,draft',
            'is_featured_honeycomb' => 'nullable|boolean',
        ]);

        $programme = Programme::create([
            'code' => strtoupper(trim($validated['code'])),
            'title' => $validated['title'],
            'level' => strtolower($validated['level']),
            'degree' => $validated['degree'] ?? null,
            'duration' => $validated['duration'] ?? '3 Years / 4 Years (NEP 2020)',
            'eligibility' => $validated['eligibility'] ?? null,
            'overview' => $validated['overview'] ?? null,
            'departments' => $validated['departments'] ?? null,
            'pdf_link' => $validated['pdf_link'] ?? null,
            'outcomes' => $validated['outcomes'] ?? null,
            'status' => $validated['status'] ?? 'published',
            'is_featured_honeycomb' => $validated['is_featured_honeycomb'] ?? true,
        ]);

        return response()->json([
            'status' => 'success',
            'programme' => $programme
        ], 201);
    }

    /**
     * Update an existing programme.
     */
    public function update(Request $request, $code)
    {
        $programme = $this->findProgramme($code);

        if (!$programme) {
            return response()->json(['status' => 'error', 'message' => "Programme '{$code}' not found."], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'level' => 'sometimes|required|string|in:ug,pg',
            'degree' => 'nullable|string',
            'duration' => 'nullable|string',
            'eligibility' => 'nullable|string',
            'overview' => 'nullable|string',
            'departments' => 'nullable|array',
            'pdf_link' => 'nullable|string',
            'outcomes' => 'nullable|string',
            'status' => 'nullable|string|in:published,draft',
            'is_featured_honeycomb' => 'nullable|boolean',
        ]);

        $programme->update($validated);

        return response()->json([
            'status' => 'success',
            'programme' => $programme
        ]);
    }

    /**
     * Delete a programme.
     */
    public function destroy(Request $request, $code)
    {
        $programme = $this->findProgramme($code);

        if (!$programme) {
            return response()->json(['status' => 'error', 'message' => "Programme '{$code}' not found."], 404);
        }

        $programme->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Programme {$code} deleted."
        ]);
    }
}
