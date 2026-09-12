<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\DepartmentSection;
use App\Models\Faculty;
use App\Models\Programme;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DepartmentController extends Controller
{
    /**
     * Admin listing of all departments with status, faculty counts, and audit details.
     */
    public function index(Request $request)
    {
        $query = Department::query();

        if ($request->filled('status') && strtolower($request->status) !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('category') && strtolower($request->category) !== 'all') {
            $query->where('category', 'like', "%{$request->category}%");
        }

        if ($request->filled('search')) {
            $search = '%' . trim($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                  ->orWhere('slug', 'like', $search)
                  ->orWhere('category', 'like', $search)
                  ->orWhere('short_description', 'like', $search);
            });
        }

        $departments = $query->withCount([
            'faculty' => function ($q) {
                $q->where('status', 'active');
            }
        ])
        ->orderBy('display_order', 'asc')
        ->orderBy('name', 'asc')
        ->get();

        $departments->each(function ($d) {
            $d->programmes_count = is_array($d->programmes) ? count($d->programmes) : 0;
        });

        return response()->json($departments);
    }

    /**
     * Admin detail view returning editable draft sections, faculty, and programmes.
     */
    public function show($id)
    {
        $department = Department::findOrFail($id);

        // Ensure draft sections exist; if not, clone from published sections
        $draftSections = $department->draftSections()->get();
        if ($draftSections->isEmpty()) {
            $published = $department->publishedSections()->get();
            foreach ($published as $p) {
                $draft = $p->replicate();
                $draft->id = "sec-dft-{$department->id}-{$p->section_key}-" . Str::random(6);
                $draft->version = 'draft';
                $draft->save();
            }
            $draftSections = $department->draftSections()->get();
        }

        // Assigned faculty
        $assignedFaculty = Faculty::where('department_id', $department->id)
            ->where('status', 'active')
            ->orderBy('name', 'asc')
            ->get();

        // All available faculty for linking
        $allFaculty = Faculty::where('status', 'active')
            ->select('id', 'name', 'designation', 'department_id', 'photo_url')
            ->orderBy('name', 'asc')
            ->get();

        // Programmes
        $programCodes = is_array($department->programmes) ? $department->programmes : [];
        $assignedProgrammes = Programme::whereIn('code', $programCodes)->get();
        $allProgrammes = Programme::select('code', 'title', 'level', 'degree')->get();

        return response()->json([
            'department' => $department,
            'sections' => $draftSections,
            'assigned_faculty' => $assignedFaculty,
            'all_faculty' => $allFaculty,
            'assigned_programmes' => $assignedProgrammes,
            'all_programmes' => $allProgrammes,
        ]);
    }

    /**
     * Create a new department.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:100|unique:departments,slug',
            'category' => 'nullable|string|max:100',
            'head' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'banner_image' => 'nullable|string',
            'programmes' => 'nullable|array',
            'status' => 'nullable|in:draft,published,unpublished',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['name']);
        // Ensure slug uniqueness
        $baseSlug = $slug;
        $counter = 1;
        while (Department::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $deptId = 'dept-' . $slug;

        $user = $request->user();
        $userName = $user ? $user->name : 'Administrator';

        $department = Department::create([
            'id' => $deptId,
            'name' => $validated['name'],
            'slug' => $slug,
            'category' => $validated['category'] ?? 'Science',
            'head' => $validated['head'] ?? null,
            'short_description' => $validated['short_description'] ?? null,
            'description' => $validated['description'] ?? null,
            'banner_image' => $validated['banner_image'] ?? '/assets/banner-college.jpg',
            'programmes' => $validated['programmes'] ?? [],
            'status' => $validated['status'] ?? 'draft',
            'seo_title' => $validated['seo_title'] ?? "{$validated['name']} | St. Philomena's College",
            'seo_description' => $validated['seo_description'] ?? null,
            'display_order' => Department::max('display_order') + 1,
            'published_at' => ($validated['status'] ?? '') === 'published' ? now() : null,
            'published_by' => ($validated['status'] ?? '') === 'published' ? $userName : null,
            'last_updated_by' => $userName,
        ]);

        // Create initial default sections in both draft & published
        $defaultSections = [
            ['key' => 'about', 'title' => 'About the Department', 'type' => 'text', 'order' => 10, 'content' => ['heading' => 'About the Department', 'body' => $department->description ?: 'Information regarding the department.']],
            ['key' => 'vision_mission', 'title' => 'Vision & Mission', 'type' => 'cards', 'order' => 20, 'content' => ['heading' => 'Vision & Mission', 'cards' => []]],
            ['key' => 'programs', 'title' => 'Academic Programmes', 'type' => 'programs', 'order' => 30, 'content' => ['heading' => 'Programmes Offered']],
            ['key' => 'faculty', 'title' => 'Faculty Directory', 'type' => 'faculty', 'order' => 40, 'content' => ['heading' => 'Faculty Members']],
            ['key' => 'facilities', 'title' => 'Laboratories & Infrastructure', 'type' => 'facilities', 'order' => 50, 'content' => ['heading' => 'Facilities', 'items' => []]],
            ['key' => 'documents', 'title' => 'Syllabus & Documents', 'type' => 'documents', 'order' => 60, 'content' => ['heading' => 'Documents & Syllabus', 'documents' => []]],
            ['key' => 'contact', 'title' => 'Contact Department', 'type' => 'contact', 'order' => 70, 'content' => ['heading' => 'Contact Us', 'email' => "{$slug}@stphilos.ac.in"]],
        ];

        foreach ($defaultSections as $s) {
            foreach (['published', 'draft'] as $v) {
                DepartmentSection::create([
                    'id' => "sec-{$v}-{$deptId}-{$s['key']}",
                    'department_id' => $deptId,
                    'section_key' => $s['key'],
                    'title' => $s['title'],
                    'type' => $s['type'],
                    'content' => $s['content'],
                    'display_order' => $s['order'],
                    'is_enabled' => true,
                    'version' => $v,
                ]);
            }
        }

        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $user?->id,
            'user_email' => $user?->email ?? 'admin@stphilos.ac.in',
            'action' => 'CREATE_DEPARTMENT',
            'module' => 'Departmental Pages',
            'details' => "Created department {$department->name} ({$department->id})",
        ]);

        return response()->json(['status' => 'success', 'department' => $department], 201);
    }

    /**
     * Update department general fields.
     */
    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:100|unique:departments,slug,' . $id,
            'category' => 'nullable|string|max:100',
            'head' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'banner_image' => 'nullable|string',
            'programmes' => 'nullable|array',
            'status' => 'nullable|in:draft,published,unpublished',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);

        $user = $request->user();
        $userName = $user ? $user->name : 'Administrator';

        $department->update([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'category' => $validated['category'] ?? $department->category,
            'head' => $validated['head'] ?? $department->head,
            'short_description' => $validated['short_description'] ?? $department->short_description,
            'description' => $validated['description'] ?? $department->description,
            'banner_image' => $validated['banner_image'] ?? $department->banner_image,
            'programmes' => $validated['programmes'] ?? $department->programmes,
            'status' => $validated['status'] ?? $department->status,
            'seo_title' => $validated['seo_title'] ?? $department->seo_title,
            'seo_description' => $validated['seo_description'] ?? $department->seo_description,
            'display_order' => $validated['display_order'] ?? $department->display_order,
            'last_updated_by' => $userName,
        ]);

        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $user?->id,
            'user_email' => $user?->email ?? 'admin@stphilos.ac.in',
            'action' => 'UPDATE_DEPARTMENT',
            'module' => 'Departmental Pages',
            'details' => "Updated department general info for {$department->name} ({$department->id})",
        ]);

        return response()->json(['status' => 'success', 'department' => $department]);
    }

    /**
     * Save draft state of department sections.
     */
    public function saveDraft(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $validated = $request->validate([
            'general' => 'nullable|array',
            'sections' => 'required|array',
            'faculty_ids' => 'nullable|array',
            'program_codes' => 'nullable|array',
        ]);

        $user = $request->user();
        $userName = $user ? $user->name : 'Administrator';

        // Update general fields if provided
        if (!empty($validated['general'])) {
            $gen = $validated['general'];
            $department->update([
                'name' => $gen['name'] ?? $department->name,
                'slug' => $gen['slug'] ?? $department->slug,
                'short_description' => $gen['short_description'] ?? $department->short_description,
                'category' => $gen['category'] ?? $department->category,
                'head' => $gen['head'] ?? $department->head,
                'banner_image' => $gen['banner_image'] ?? $department->banner_image,
                'seo_title' => $gen['seo_title'] ?? $department->seo_title,
                'seo_description' => $gen['seo_description'] ?? $department->seo_description,
                'last_updated_by' => $userName,
            ]);
        }

        // Update assigned programmes if provided
        if (isset($validated['program_codes'])) {
            $department->programmes = $validated['program_codes'];
            $department->save();
        }

        // Update faculty assignments if provided
        if (isset($validated['faculty_ids'])) {
            // Unset previous faculty
            Faculty::where('department_id', $department->id)->update(['department_id' => null]);
            // Set new assigned faculty
            Faculty::whereIn('id', $validated['faculty_ids'])->update(['department_id' => $department->id]);
        }

        // Wipe current draft sections and replace with new draft sections
        DepartmentSection::where('department_id', $department->id)
            ->where('version', 'draft')
            ->delete();

        foreach ($validated['sections'] as $idx => $sec) {
            DepartmentSection::create([
                'id' => $sec['id'] ?: ('sec-dft-' . Str::random(10)),
                'department_id' => $department->id,
                'section_key' => $sec['section_key'] ?? ('custom_' . Str::random(6)),
                'title' => $sec['title'] ?? 'Section',
                'type' => $sec['type'] ?? 'text',
                'content' => $sec['content'] ?? null,
                'display_order' => $sec['display_order'] ?? ($idx + 1),
                'is_enabled' => $sec['is_enabled'] ?? true,
                'version' => 'draft',
            ]);
        }

        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $user?->id,
            'user_email' => $user?->email ?? 'admin@stphilos.ac.in',
            'action' => 'SAVE_DEPARTMENT_DRAFT',
            'module' => 'Departmental Pages',
            'details' => "Saved draft sections for {$department->name} ({$department->id})",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Draft saved successfully.',
            'sections' => $department->draftSections()->get(),
            'department' => $department,
        ]);
    }

    /**
     * Publish current draft sections to live public website.
     */
    public function publish(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $user = $request->user();
        $userName = $user ? $user->name : 'Administrator';

        // Retrieve current draft sections
        $draftSections = $department->draftSections()->get();

        if ($draftSections->isEmpty()) {
            return response()->json(['message' => 'No draft sections found to publish.'], 422);
        }

        // Wipe current published sections
        DepartmentSection::where('department_id', $department->id)
            ->where('version', 'published')
            ->delete();

        // Copy each draft section to published version
        foreach ($draftSections as $d) {
            $pub = $d->replicate();
            $pub->id = "sec-pub-{$department->id}-{$d->section_key}-" . Str::random(6);
            $pub->version = 'published';
            $pub->save();
        }

        // Mark department as published
        $department->update([
            'status' => 'published',
            'published_at' => now(),
            'published_by' => $userName,
            'last_updated_by' => $userName,
        ]);

        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $user?->id,
            'user_email' => $user?->email ?? 'admin@stphilos.ac.in',
            'action' => 'PUBLISH_DEPARTMENT',
            'module' => 'Departmental Pages',
            'details' => "Published department page for {$department->name} ({$department->id})",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Department '{$department->name}' published successfully.",
            'department' => $department,
            'published_sections' => $department->publishedSections()->get(),
        ]);
    }

    /**
     * Unpublish department.
     */
    public function unpublish(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $user = $request->user();
        $userName = $user ? $user->name : 'Administrator';

        $department->update([
            'status' => 'unpublished',
            'last_updated_by' => $userName,
        ]);

        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $user?->id,
            'user_email' => $user?->email ?? 'admin@stphilos.ac.in',
            'action' => 'UNPUBLISH_DEPARTMENT',
            'module' => 'Departmental Pages',
            'details' => "Unpublished department page for {$department->name} ({$department->id})",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Department '{$department->name}' has been unpublished.",
            'department' => $department,
        ]);
    }

    /**
     * Delete department and all associated sections.
     */
    public function destroy(Request $request, $id)
    {
        $department = Department::findOrFail($id);
        $name = $department->name;

        $department->sections()->delete();
        $department->delete();

        $user = $request->user();
        ActivityLog::create([
            'id' => 'log_' . Str::random(10),
            'user_id' => $user?->id,
            'user_email' => $user?->email ?? 'admin@stphilos.ac.in',
            'action' => 'DELETE_DEPARTMENT',
            'module' => 'Departmental Pages',
            'details' => "Deleted department {$name} ({$id})",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Department '{$name}' deleted successfully.",
        ]);
    }
}
