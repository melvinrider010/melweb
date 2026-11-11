<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Organogram;
use App\Models\OrganogramVersion;
use App\Models\OrganogramNode;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OrganogramController extends Controller
{
    /**
     * Check authorization: Only super admins, academic managers, and IQAC coordinators.
     */
    protected function authorizeAdmin()
    {
        $user = Auth::user();
        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        $roleVal = $user->role instanceof \BackedEnum ? $user->role->value : (string)$user->role;
        $allowedRoles = ['SUPER_ADMIN', 'ACADEMIC_MANAGER', 'IQAC_MANAGER'];
        if (!in_array($roleVal, $allowedRoles)) {
            abort(403, 'Unauthorized. Only college administrators have permission to edit the organogram.');
        }

        return $user;
    }

    /**
     * Get complete editor workspace data (current working draft, published version, layout).
     */
    public function getEditorData()
    {
        $this->authorizeAdmin();

        $organogram = Organogram::with(['publishedVersion'])->first();

        if (!$organogram) {
            return response()->json([
                'success' => false,
                'message' => 'No organogram found. Please run the database seeder.',
            ], 404);
        }

        // Check if there is an active draft version
        $workingVersion = OrganogramVersion::where('organogram_id', $organogram->id)
            ->where('status', 'draft')
            ->latest()
            ->first();

        // If no draft exists, fork one from the current published version
        if (!$workingVersion && $organogram->publishedVersion) {
            $pub = $organogram->publishedVersion;
            $workingVersion = OrganogramVersion::create([
                'organogram_id' => $organogram->id,
                'version_number' => $pub->version_number . '-draft',
                'status' => 'draft',
                'change_summary' => 'Working draft based on Version ' . $pub->version_number,
                'created_by' => Auth::id(),
                'snapshot_data' => $pub->snapshot_data,
            ]);
        }

        // Ensure working version has nodes populated from published version if empty
        if ($workingVersion && $workingVersion->nodes()->count() === 0 && $organogram->publishedVersion) {
            $pubNodes = $organogram->publishedVersion->nodes()->get();
            $cleanNodes = [];
            foreach ($pubNodes as $pn) {
                $cleanId = preg_replace('/^v\d+_/', '', $pn->id);
                $cleanParentId = $pn->parent_id ? preg_replace('/^v\d+_/', '', $pn->parent_id) : null;
                $cleanNodes[] = [
                    'id' => "v{$workingVersion->id}_{$cleanId}",
                    'organogram_version_id' => $workingVersion->id,
                    'parent_id' => $cleanParentId ? "v{$workingVersion->id}_{$cleanParentId}" : null,
                    'node_type' => $pn->node_type,
                    'title' => $pn->title,
                    'designation' => $pn->designation,
                    'person_name' => $pn->person_name,
                    'description' => $pn->description,
                    'department_id' => $pn->department_id,
                    'display_order' => $pn->display_order,
                    'node_metadata' => is_array($pn->node_metadata) ? json_encode($pn->node_metadata) : $pn->node_metadata,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            if (!empty($cleanNodes)) {
                DB::table('organogram_nodes')->insert($cleanNodes);
            }
        }

        // Retrieve nodes of working version
        $nodes = $workingVersion ? $workingVersion->nodes()->orderBy('display_order', 'asc')->get() : [];

        return response()->json([
            'success' => true,
            'data' => [
                'organogram' => [
                    'id' => $organogram->id,
                    'title' => $organogram->title,
                    'description' => $organogram->description,
                    'status' => $organogram->status,
                    'layout_settings' => $organogram->layout_settings,
                ],
                'published_version' => $organogram->publishedVersion ? [
                    'id' => $organogram->publishedVersion->id,
                    'version_number' => $organogram->publishedVersion->version_number,
                    'published_at' => $organogram->publishedVersion->published_at ? $organogram->publishedVersion->published_at->toIso8601String() : null,
                ] : null,
                'working_version' => $workingVersion ? [
                    'id' => $workingVersion->id,
                    'version_number' => $workingVersion->version_number,
                    'status' => $workingVersion->status,
                    'change_summary' => $workingVersion->change_summary,
                    'updated_at' => $workingVersion->updated_at->toIso8601String(),
                ] : null,
                'nodes' => $nodes->map(function ($n) {
                    return [
                        'id' => preg_replace('/^v\d+_/', '', $n->id),
                        'parent_id' => $n->parent_id ? preg_replace('/^v\d+_/', '', $n->parent_id) : null,
                        'node_type' => $n->node_type,
                        'title' => $n->title,
                        'designation' => $n->designation,
                        'person_name' => $n->person_name,
                        'description' => $n->description,
                        'department_id' => $n->department_id,
                        'display_order' => $n->display_order,
                        'node_metadata' => $n->node_metadata ?: [],
                    ];
                }),
                'total_versions' => OrganogramVersion::where('organogram_id', $organogram->id)->count(),
            ]
        ]);
    }

    /**
     * Validate hierarchical tree integrity:
     * - Checks for duplicate IDs
     * - Checks for non-existent parent IDs
     * - Prevents a node being its own parent
     * - Traverses ancestors to detect cycles
     */
    protected function validateHierarchy(array $nodes): array
    {
        $idMap = [];
        $errors = [];

        // 1. Check duplicate IDs & populate map
        foreach ($nodes as $n) {
            $id = $n['id'] ?? null;
            if (!$id) {
                $errors[] = "A node is missing an identifier.";
                continue;
            }
            if (isset($idMap[$id])) {
                $errors[] = "Duplicate node identifier detected: {$id}.";
            }
            $idMap[$id] = $n;
        }

        // 2. Validate parents and cycle prevention
        foreach ($nodes as $n) {
            $id = $n['id'];
            $parentId = $n['parent_id'] ?? null;

            if ($parentId !== null && $parentId !== '') {
                if ($parentId === $id) {
                    $errors[] = "Node '{$n['title']}' cannot be its own parent.";
                    continue;
                }

                if (!isset($idMap[$parentId])) {
                    $errors[] = "Node '{$n['title']}' references non-existent parent '{$parentId}'.";
                    continue;
                }

                // Detect cycle via upward traversal
                $visited = [$id => true];
                $curr = $parentId;
                while ($curr !== null && $curr !== '') {
                    if (isset($visited[$curr])) {
                        $errors[] = "Circular relationship detected involving node '{$n['title']}'.";
                        break;
                    }
                    $visited[$curr] = true;
                    $curr = $idMap[$curr]['parent_id'] ?? null;
                }
            }
        }

        return $errors;
    }

    /**
     * Save an in-progress working draft without altering the public published organogram.
     */
    public function saveDraft(Request $request)
    {
        $user = $this->authorizeAdmin();

        $request->validate([
            'title' => 'nullable|string|max:255',
            'layout_settings' => 'nullable|array',
            'change_summary' => 'nullable|string|max:1000',
            'nodes' => 'required|array|min:1',
        ]);

        $nodes = $request->input('nodes');
        $hierarchyErrors = $this->validateHierarchy($nodes);
        if (!empty($hierarchyErrors)) {
            return response()->json([
                'success' => false,
                'message' => 'Hierarchy validation failed.',
                'errors' => $hierarchyErrors,
            ], 422);
        }

        $organogram = Organogram::firstOrFail();

        DB::beginTransaction();
        try {
            // Update title and layout settings
            if ($request->has('title')) {
                $organogram->title = $request->input('title');
            }
            if ($request->has('layout_settings')) {
                $organogram->layout_settings = array_merge(
                    $organogram->layout_settings ?: [],
                    $request->input('layout_settings')
                );
            }
            $organogram->updated_by = $user->id;
            $organogram->save();

            // Find or create current draft version
            $draft = OrganogramVersion::where('organogram_id', $organogram->id)
                ->where('status', 'draft')
                ->latest()
                ->first();

            if (!$draft) {
                $lastVersion = OrganogramVersion::where('organogram_id', $organogram->id)->count();
                $draft = OrganogramVersion::create([
                    'organogram_id' => $organogram->id,
                    'version_number' => ($lastVersion + 1) . '.0-draft',
                    'status' => 'draft',
                    'change_summary' => $request->input('change_summary', 'Autosaved working draft'),
                    'created_by' => $user->id,
                ]);
            } else {
                $draft->change_summary = $request->input('change_summary', $draft->change_summary);
                $draft->touch();
            }

            // Sync nodes for this draft version
            // Delete old nodes for this draft and recreate
            OrganogramNode::where('organogram_version_id', $draft->id)->delete();

            $cleanNodes = [];
            foreach ($nodes as $index => $node) {
                $rawId = $node['id'] ?: ('node_' . Str::random(8));
                $cleanId = preg_replace('/^v\d+_/', '', $rawId);
                $cleanParentId = (!empty($node['parent_id'])) ? preg_replace('/^v\d+_/', '', $node['parent_id']) : null;

                $cleanNode = [
                    'id' => "v{$draft->id}_{$cleanId}",
                    'organogram_version_id' => $draft->id,
                    'parent_id' => $cleanParentId ? "v{$draft->id}_{$cleanParentId}" : null,
                    'node_type' => $node['node_type'] ?? 'administration',
                    'title' => $node['title'] ?? 'Untitled Node',
                    'designation' => $node['designation'] ?? null,
                    'person_name' => $node['person_name'] ?? null,
                    'description' => $node['description'] ?? null,
                    'department_id' => $node['department_id'] ?? null,
                    'display_order' => isset($node['display_order']) ? (int) $node['display_order'] : $index,
                    'node_metadata' => is_array($node['node_metadata'] ?? null) ? json_encode($node['node_metadata']) : ($node['node_metadata'] ?: json_encode([])),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $cleanNodes[] = $cleanNode;
            }

            DB::table('organogram_nodes')->insert($cleanNodes);

            // Store snapshot
            $draft->update([
                'snapshot_data' => [
                    'organogram_title' => $organogram->title,
                    'layout_settings' => $organogram->layout_settings,
                    'nodes' => $cleanNodes,
                ]
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Draft saved successfully.',
                'data' => [
                    'draft_id' => $draft->id,
                    'version_number' => $draft->version_number,
                    'updated_at' => $draft->updated_at->toIso8601String(),
                    'nodes_count' => count($cleanNodes),
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to save draft: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Publish the working draft as the new official public version.
     */
    public function publish(Request $request)
    {
        $user = $this->authorizeAdmin();

        $request->validate([
            'change_summary' => 'required|string|max:1000',
            'nodes' => 'nullable|array',
            'layout_settings' => 'nullable|array',
            'title' => 'nullable|string|max:255',
        ]);

        $organogram = Organogram::with('publishedVersion')->firstOrFail();

        // If nodes passed in request, validate them
        if ($request->has('nodes') && is_array($request->input('nodes'))) {
            $hierarchyErrors = $this->validateHierarchy($request->input('nodes'));
            if (!empty($hierarchyErrors)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot publish: hierarchy integrity validation failed.',
                    'errors' => $hierarchyErrors,
                ], 422);
            }
        }

        DB::beginTransaction();
        try {
            // First, ensure latest nodes and settings are written into a draft
            if ($request->has('nodes')) {
                // Save incoming payload first
                $this->saveDraft($request);
            }

            $draft = OrganogramVersion::where('organogram_id', $organogram->id)
                ->where('status', 'draft')
                ->latest()
                ->first();

            if (!$draft) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active draft found to publish.',
                ], 404);
            }

            // Calculate new version number: e.g. 1.0 -> 1.1
            $lastPub = $organogram->publishedVersion;
            $nextVersionNumber = '1.0';
            if ($lastPub) {
                $parts = explode('.', $lastPub->version_number);
                $major = (int) ($parts[0] ?? 1);
                $minor = (int) ($parts[1] ?? 0);
                $nextVersionNumber = $major . '.' . ($minor + 1);
            }

            // Mark draft as published
            $draft->update([
                'version_number' => $nextVersionNumber,
                'status' => 'published',
                'change_summary' => $request->input('change_summary'),
                'published_by' => $user->id,
                'published_at' => now(),
            ]);

            // Archive the previous published version
            if ($lastPub && $lastPub->id !== $draft->id) {
                $lastPub->update(['status' => 'archived']);
            }

            // Update main organogram pointer
            $organogram->update([
                'current_published_version_id' => $draft->id,
                'status' => 'published',
                'updated_by' => $user->id,
            ]);

            // Create audit log
            ActivityLog::create([
                'id' => 'log_' . Str::random(8),
                'user_id' => $user->id,
                'user_email' => $user->email,
                'action' => 'ORGANOGRAM_PUBLISHED',
                'module' => 'Organogram',
                'details' => sprintf(
                    "Published Organogram Version %s with %d nodes. Summary: %s",
                    $nextVersionNumber,
                    $draft->nodes()->count(),
                    $request->input('change_summary')
                ),
                'ip_address' => $request->ip(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Organogram Version {$nextVersionNumber} published successfully to the official college website.",
                'data' => [
                    'version_id' => $draft->id,
                    'version_number' => $nextVersionNumber,
                    'published_at' => $draft->published_at->toIso8601String(),
                    'publisher' => $user->name,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to publish organogram: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retrieve full version history.
     */
    public function getVersions()
    {
        $this->authorizeAdmin();

        $organogram = Organogram::firstOrFail();
        $versions = OrganogramVersion::where('organogram_id', $organogram->id)
            ->with(['creator:id,name', 'publisher:id,name'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $versions->map(function ($v) use ($organogram) {
                return [
                    'id' => $v->id,
                    'version_number' => $v->version_number,
                    'status' => $v->status,
                    'is_current_published' => $v->id === $organogram->current_published_version_id,
                    'change_summary' => $v->change_summary,
                    'created_by' => $v->creator ? $v->creator->name : 'System',
                    'published_by' => $v->publisher ? $v->publisher->name : null,
                    'published_at' => $v->published_at ? $v->published_at->toIso8601String() : null,
                    'created_at' => $v->created_at->toIso8601String(),
                ];
            })
        ]);
    }

    /**
     * Restore a previous version into a new working draft.
     */
    public function restoreVersion(Request $request, $versionId)
    {
        $user = $this->authorizeAdmin();

        $organogram = Organogram::firstOrFail();
        $targetVersion = OrganogramVersion::where('organogram_id', $organogram->id)
            ->where('id', $versionId)
            ->firstOrFail();

        DB::beginTransaction();
        try {
            // Delete any existing active working draft to prevent collision
            OrganogramVersion::where('organogram_id', $organogram->id)
                ->where('status', 'draft')
                ->delete();

            // Create new draft from target version's snapshot
            $newDraft = OrganogramVersion::create([
                'organogram_id' => $organogram->id,
                'version_number' => $targetVersion->version_number . '-restored-draft',
                'status' => 'draft',
                'change_summary' => "Restored snapshot from Version {$targetVersion->version_number}",
                'created_by' => $user->id,
                'snapshot_data' => $targetVersion->snapshot_data,
            ]);

            // Replicate nodes from the target version
            $targetNodes = $targetVersion->nodes()->get();
            $cleanNodes = [];
            foreach ($targetNodes as $tn) {
                $cleanId = preg_replace('/^v\d+_/', '', $tn->id);
                $cleanParentId = $tn->parent_id ? preg_replace('/^v\d+_/', '', $tn->parent_id) : null;
                $cleanNodes[] = [
                    'id' => "v{$newDraft->id}_{$cleanId}",
                    'organogram_version_id' => $newDraft->id,
                    'parent_id' => $cleanParentId ? "v{$newDraft->id}_{$cleanParentId}" : null,
                    'node_type' => $tn->node_type,
                    'title' => $tn->title,
                    'designation' => $tn->designation,
                    'person_name' => $tn->person_name,
                    'description' => $tn->description,
                    'department_id' => $tn->department_id,
                    'display_order' => $tn->display_order,
                    'node_metadata' => is_array($tn->node_metadata) ? json_encode($tn->node_metadata) : $tn->node_metadata,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            DB::table('organogram_nodes')->insert($cleanNodes);

            ActivityLog::create([
                'id' => 'log_' . Str::random(8),
                'user_id' => $user->id,
                'user_email' => $user->email,
                'action' => 'ORGANOGRAM_VERSION_RESTORED',
                'module' => 'Organogram',
                'details' => "Restored draft from historical Version {$targetVersion->version_number}",
                'ip_address' => $request->ip(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Version {$targetVersion->version_number} has been restored as the active working draft.",
                'data' => [
                    'draft_id' => $newDraft->id,
                    'version_number' => $newDraft->version_number,
                    'nodes_count' => count($cleanNodes),
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore version: ' . $e->getMessage(),
            ], 500);
        }
    }
}
