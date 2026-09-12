<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\Programme;
use App\Models\Notice;
use App\Models\Event;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Public listing of all active/published departments.
     */
    public function index(Request $request)
    {
        $query = Department::query();

        // For public requests, show published departments ordered by display_order
        if (!$request->boolean('include_all')) {
            $query->where('status', 'published');
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
     * Public / Preview detail view for a specific department.
     */
    public function show(Request $request, $slugOrId)
    {
        $raw = trim($slugOrId);
        $clean = preg_replace('/^dept[-_]/', '', strtolower($raw));
        $withPrefix = 'dept-' . $clean;

        $department = Department::where('slug', $raw)
            ->orWhere('id', $raw)
            ->orWhere('slug', $clean)
            ->orWhere('id', $withPrefix)
            ->first();

        if (!$department) {
            return response()->json([
                'message' => "Academic department '{$slugOrId}' could not be located."
            ], 404);
        }

        $isPreview = $request->boolean('preview');

        // Retrieve sections based on preview mode vs published mode
        if ($isPreview) {
            $sections = $department->draftSections()
                ->where('is_enabled', true)
                ->orderBy('display_order', 'asc')
                ->get();
            
            // Fallback to published sections if draft sections are empty
            if ($sections->isEmpty()) {
                $sections = $department->publishedSections()
                    ->orderBy('display_order', 'asc')
                    ->get();
            }
        } else {
            $sections = $department->publishedSections()
                ->orderBy('display_order', 'asc')
                ->get();
        }

        // Active Faculty Members for this Department
        $faculty = Faculty::where('department_id', $department->id)
            ->orWhere('department', $department->name)
            ->orWhere('department', 'like', "%{$department->name}%")
            ->where('status', 'active')
            ->orderBy('name', 'asc')
            ->get();

        // Programmes associated with this Department
        $programCodes = is_array($department->programmes) ? $department->programmes : [];
        $programmes = Programme::whereIn('code', $programCodes)
            ->orWhere(function ($q) use ($department) {
                $q->where('departments', 'like', "%{$department->id}%")
                  ->orWhere('departments', 'like', "%{$department->name}%");
            })
            ->get();

        // Notices for this Department
        $notices = Notice::where('department', $department->name)
            ->orWhere('department', $department->id)
            ->orderBy('date', 'desc')
            ->take(5)
            ->get();

        // Events for this Department
        $events = Event::where('department', $department->name)
            ->orWhere('department', $department->id)
            ->orderBy('event_date', 'desc')
            ->take(4)
            ->get();

        return response()->json([
            'department' => $department,
            'is_preview' => $isPreview,
            'sections' => $sections,
            'faculty' => $faculty,
            'programmes' => $programmes,
            'notices' => $notices,
            'events' => $events,
        ]);
    }
}
