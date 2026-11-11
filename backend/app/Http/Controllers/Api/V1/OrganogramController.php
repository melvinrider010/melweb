<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Organogram;
use App\Models\OrganogramVersion;

class OrganogramController extends Controller
{
    /**
     * Get the latest published organogram for the public website.
     */
    public function published()
    {
        $organogram = Organogram::with(['publishedVersion.nodes'])->first();

        if (!$organogram || !$organogram->publishedVersion) {
            return response()->json([
                'success' => false,
                'message' => 'No published organogram found.',
                'data' => null
            ], 404);
        }

        $version = $organogram->publishedVersion;
        $nodes = $version->nodes()->orderBy('display_order', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $organogram->id,
                'title' => $organogram->title,
                'description' => $organogram->description,
                'layout_settings' => $organogram->layout_settings,
                'version' => [
                    'id' => $version->id,
                    'version_number' => $version->version_number,
                    'published_at' => $version->published_at ? $version->published_at->toIso8601String() : null,
                    'change_summary' => $version->change_summary,
                ],
                'nodes' => $nodes->map(function ($node) {
                    return [
                        'id' => preg_replace('/^v\d+_/', '', $node->id),
                        'parent_id' => $node->parent_id ? preg_replace('/^v\d+_/', '', $node->parent_id) : null,
                        'node_type' => $node->node_type,
                        'title' => $node->title,
                        'designation' => $node->designation,
                        'person_name' => $node->person_name,
                        'description' => $node->description,
                        'department_id' => $node->department_id,
                        'display_order' => $node->display_order,
                        'node_metadata' => $node->node_metadata ?: [],
                    ];
                }),
            ]
        ]);
    }
}
