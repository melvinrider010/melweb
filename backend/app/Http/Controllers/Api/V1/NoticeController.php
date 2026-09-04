<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use App\Http\Resources\NoticeResource;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    /**
     * Get notices list with optional filters.
     */
    public function index(Request $request)
    {
        $query = Notice::orderBy('date', 'desc');

        if ($request->filled('level') && $request->level !== 'all') {
            $query->where(function ($q) use ($request) {
                $q->where('level', $request->level)->orWhere('level', 'all');
            });
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', $s)
                  ->orWhere('summary', 'like', $s)
                  ->orWhere('ref_no', 'like', $s)
                  ->orWhere('department', 'like', $s);
            });
        }

        $notices = $query->get();

        return NoticeResource::collection($notices);
    }

    /**
     * Get single notice by ID or slug.
     */
    public function show($id)
    {
        $notice = Notice::with(['linkedEvent.subEvents', 'linkedEvent.attachments', 'linkedSubEvent'])
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        return new NoticeResource($notice);
    }
}
