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
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        return response()->json($query->get());
    }

    public function faculty(Request $request)
    {
        $query = Faculty::orderBy('name', 'asc');
        if ($request->filled('department')) {
            $query->where('department', $request->department);
        }
        return response()->json($query->get());
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
