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
            $directCount = Faculty::where('department_id', $d->id)->where('status', 'active')->count();
            $pivotCount = 0;
            if (\Illuminate\Support\Facades\Schema::hasTable('department_faculty')) {
                $pivotCount = $d->faculty()->where('faculty.status', 'active')->count();
            }
            $d->faculty_count = max($directCount, $pivotCount);
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

        // Support aliases like bba / management -> dept-management, bba-th -> dept-bba-th, commerce -> dept-commerce
        $aliasId = match ($clean) {
            'bba', 'management', 'b-ba' => 'dept-management',
            'bba-th', 'bbath', 'bba-thm', 'bbathm' => 'dept-bba-th',
            'bca' => 'dept-bca',
            'commerce', 'bcom', 'b-com' => 'dept-commerce',
            'english', 'ba-english' => 'dept-english',
            'kannada', 'ba-kannada' => 'dept-kannada',
            'hindi', 'ba-hindi' => 'dept-hindi',
            'malayalam', 'ba-malayalam' => 'dept-malayalam',
            'urdu', 'ba-urdu' => 'dept-urdu',
            'tamil', 'ba-tamil' => 'dept-tamil',
            'french', 'ba-french' => 'dept-french',
            'lang', 'languages', 'dept-languages' => 'dept-languages',
            'physics', 'bsc', 'b-sc', 'bsc-physics', 'ug-physics' => 'dept-physics',
            'history', 'ba', 'b-a', 'ba-history', 'ug-history' => 'dept-history',
            'social-work', 'bsw', 'b-sw', 'ug-social-work' => 'dept-social-work',
            'chemistry', 'bsc-chemistry', 'ug-chemistry' => 'dept-chemistry',
            'mathematics', 'maths', 'bsc-mathematics', 'ug-mathematics' => 'dept-mathematics',
            'botany', 'bsc-botany', 'ug-botany' => 'dept-botany',
            'zoology', 'bsc-zoology', 'ug-zoology' => 'dept-zoology',
            'environmental-science', 'bsc-environmental-science', 'ug-environmental-science' => 'dept-environmental-science',
            'computer-science', 'cs', 'bsc-computer-science', 'ug-computer-science' => 'dept-computer-science',
            'economics', 'ba-economics', 'ug-economics' => 'dept-economics',
            'sociology', 'ba-sociology', 'ug-sociology' => 'dept-sociology',
            'political-science', 'ba-political-science', 'ug-political-science' => 'dept-political-science',
            'criminology', 'cfs', 'criminology-and-forensic-science', 'bsc-criminology', 'ug-criminology' => 'dept-criminology',
            'journalism', 'mass-communication', 'journalism-and-mass-communication', 'ba-journalism', 'ug-journalism', 'journalism-mass-communication' => 'dept-journalism',
            'psychology', 'ba-psychology', 'bsc-psychology', 'ug-psychology' => 'dept-psychology',
            'christianity', 'ba-christianity', 'ug-christianity' => 'dept-christianity',
            'biotechnology', 'bsc-biotechnology', 'ug-biotechnology' => 'dept-biotechnology',
            'microbiology', 'bsc-microbiology', 'ug-microbiology' => 'dept-microbiology',
            'biochemistry', 'bsc-biochemistry', 'ug-biochemistry' => 'dept-biochemistry',
            'food-science', 'food-science-and-nutrition', 'food-science-nutrition', 'food-and-nutrition', 'bsc-food-science', 'ug-food-science' => 'dept-food-science',
            'bvoc', 'b-voc', 'vocational', 'vocational-studies', 'bvoc-healthcare', 'bvoc-media-entertainment', 'b-voc-healthcare-technology', 'b-voc-media-entertainment' => 'dept-bvoc',
            'environmental-studies', 'evs', 'ug-environmental-studies' => 'dept-environmental-studies',
            'life-skills', 'life_skills', 'lifeskills', 'ug-life-skills' => 'dept-life-skills',
            'iks', 'indian-knowledge-system', 'indian-knowledge-systems', 'ug-iks' => 'dept-iks',
            'pg-biochemistry', 'msc-biochemistry' => 'dept-pg-biochemistry',
            'pg-chemistry', 'msc-chemistry' => 'dept-pg-chemistry',
            'pg-commerce', 'mcom', 'm-com' => 'dept-pg-commerce',
            'pg-computer-science', 'msc-cs', 'msc-computer-science' => 'dept-pg-computer-science',
            'pg-cfs', 'pg-criminology', 'msc-cfs', 'msc-criminology' => 'dept-pg-cfs',
            'pg-english', 'ma-english' => 'dept-pg-english',
            'pg-journalism', 'ma-journalism', 'pg-journalism-and-mass-communication' => 'dept-pg-journalism',
            'pg-mathematics', 'msc-mathematics' => 'dept-pg-mathematics',
            'pg-physics', 'msc-physics' => 'dept-pg-physics',
            'pg-psychology', 'msc-psychology' => 'dept-pg-psychology',
            'pg-social-work', 'msw' => 'dept-pg-social-work',
            'pg-economics', 'ma-economics' => 'dept-pg-economics',
            'pg-food-science', 'msc-food-science', 'pg-food-science-and-nutrition' => 'dept-pg-food-science',
            'mca', 'master-of-computer-applications' => 'dept-mca',
            'mba', 'master-of-business-administration' => 'dept-mba',
            'pg-library', 'post-graduate-library' => 'dept-pg-library',
            default => null,
        };

        $department = Department::where('slug', $raw)
            ->orWhere('id', $raw)
            ->orWhere('slug', $clean)
            ->orWhere('id', $withPrefix)
            ->when($aliasId, fn($q) => $q->orWhere('id', $aliasId))
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
        $deptIds = [$department->id];
        if ($department->id === 'dept-languages') {
            $deptIds = array_merge($deptIds, [
                'dept-kannada', 'dept-hindi', 'dept-french', 
                'dept-malayalam', 'dept-urdu', 'dept-tamil'
            ]);
        } elseif ($department->id === 'dept-botany-zoology') {
            $deptIds = array_merge($deptIds, [
                'dept-botany', 'dept-zoology'
            ]);
        } elseif ($department->id === 'dept-management') {
            $deptIds[] = 'dept_bba';
        }

        $directFaculty = Faculty::where(function ($q) use ($department, $deptIds) {
            $q->whereIn('department_id', $deptIds)
              ->orWhere('department', $department->name)
              ->orWhere('department', 'like', "%{$department->name}%");
        })
        ->where('status', 'active')
        ->get();

        $pivotFaculty = collect();
        if (\Illuminate\Support\Facades\Schema::hasTable('department_faculty')) {
            $pivotFaculty = Faculty::whereHas('departments', function($q) use ($deptIds) {
                $q->whereIn('departments.id', $deptIds);
            })
            ->where('faculty.status', 'active')
            ->get();
        }

        $faculty = $directFaculty->concat($pivotFaculty)->unique('id')->sortBy('name')->values();

        // Programmes associated with this Department
        $programCodes = is_array($department->programmes) ? $department->programmes : [];
        if (empty($programCodes)) {
            $progSec = $sections->firstWhere('section_key', 'programs');
            if ($progSec && is_array($progSec->content) && !empty($progSec->content['programCodes'])) {
                $programCodes = $progSec->content['programCodes'];
            }
        }
        $upperCodes = array_map('strtoupper', $programCodes);
        $lowerCodes = array_map('strtolower', $programCodes);
        $strippedUpper = array_map(fn($c) => strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', $c)), $programCodes);
        $allCodes = array_values(array_unique(array_merge($programCodes, $upperCodes, $lowerCodes, $strippedUpper)));

        $programmes = Programme::where(function ($q) use ($allCodes, $department) {
            if (!empty($allCodes)) {
                $q->whereIn('code', $allCodes);
            }
            $q->orWhere('departments', 'like', "%{$department->id}%")
              ->orWhere('departments', 'like', "%{$department->name}%");
        })->get();

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
