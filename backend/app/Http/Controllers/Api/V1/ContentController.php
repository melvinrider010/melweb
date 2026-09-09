<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use App\Models\Media;
use App\Models\Document;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\Programme;
use App\Models\Setting;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    public function sliders()
    {
        $sliders = Slider::where('status', 'published')->orderBy('priority', 'asc')->get();
        return response()->json($sliders);
    }

    public function media(Request $request)
    {
        $query = Media::orderBy('created_at', 'desc');
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        return response()->json($query->get());
    }

    public function documents(Request $request)
    {
        $query = Document::orderBy('created_at', 'desc');

        if ($request->filled('category') && strtolower($request->category) !== 'all') {
            $cat = trim($request->category);
            $query->where('category', 'like', "%{$cat}%");
        }

        if ($request->filled('search')) {
            $s = '%' . trim($request->search) . '%';
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', $s)
                  ->orWhere('filename', 'like', $s)
                  ->orWhere('category', 'like', $s);
            });
        }

        if ($request->filled('year') && strtolower($request->year) !== 'all') {
            $query->where('year', $request->year);
        }

        if ($request->get('all') === 'true' || $request->get('per_page') === 'all') {
            return response()->json($query->get());
        }

        $perPage = max(1, min(100, (int) $request->get('per_page', 24)));
        return response()->json($query->paginate($perPage));
    }

    public function showDocument($id)
    {
        $document = Document::find($id);
        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }
        return response()->json($document);
    }

    public function faculty(Request $request)
    {
        $request->validate([
            'department_id' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:150',
            'programme_code' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:100',
            'search' => 'nullable|string|max:100',
            'include_inactive' => 'nullable|in:true,false,1,0',
        ]);

        $query = Faculty::with(['department', 'programmes'])->orderBy('name', 'asc');

        if (!$request->boolean('include_inactive')) {
            $query->where('status', 'active');
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        } elseif ($request->filled('department')) {
            $dept = $request->department;
            $query->where(function ($q) use ($dept) {
                $q->where('department_id', $dept)
                  ->orWhere('department', $dept)
                  ->orWhere('department', 'like', "%{$dept}%");
            });
        }

        if ($request->filled('category') && strtolower($request->category) !== 'all') {
            $category = $request->category;
            $query->whereHas('department', function ($dq) use ($category) {
                $dq->where('category', 'like', "%{$category}%");
            });
        }

        if ($request->filled('programme_code')) {
            $pCode = $request->programme_code;
            $query->whereHas('programmes', function ($pq) use ($pCode) {
                $pq->where('programmes.code', $pCode);
            });
        }

        if ($request->filled('search')) {
            $search = '%' . trim($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                  ->orWhere('designation', 'like', $search)
                  ->orWhere('qualification', 'like', $search)
                  ->orWhere('department', 'like', $search)
                  ->orWhereHas('department', function ($dq) use ($search) {
                      $dq->where('name', 'like', $search);
                  })
                  ->orWhereHas('programmes', function ($pq) use ($search) {
                      $pq->where('title', 'like', $search)
                        ->orWhere('code', 'like', $search);
                  });
            });
        }

        return response()->json($query->get());
    }

    public function showFaculty($id)
    {
        $faculty = Faculty::with(['department', 'programmes'])
            ->where('id', $id)
            ->first();

        if (!$faculty) {
            return response()->json(['message' => 'Faculty member not found.'], 404);
        }

        return response()->json($faculty);
    }

    public function departments()
    {
        $departments = Department::orderBy('name', 'asc')->get();
        return response()->json($departments);
    }

    public function programmes(Request $request)
    {
        $query = Programme::query();
        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }
        return response()->json($query->get());
    }

    public function settings()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }
}
