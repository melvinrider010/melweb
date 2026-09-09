<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use App\Http\Resources\UserResource;
use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;

class UserController extends Controller
{
    /**
     * Display a listing of users (SUPER_ADMIN only).
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', User::class);

        $users = User::orderBy('id', 'asc')->get();
        return UserResource::collection($users);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', new Enum(UserRole::class)],
            'department_id' => 'nullable|string|max:100',
            'departmentId' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Active,Inactive',
        ]);

        $deptId = $validated['department_id'] ?? $validated['departmentId'] ?? null;

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'department_id' => $deptId,
            'status' => $validated['status'] ?? 'Active',
        ]);

        $roleLabel = $user->role instanceof UserRole ? $user->role->value : (string)$user->role;

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()->id,
            'user_email' => $request->user()->email,
            'action' => 'CREATE_USER',
            'module' => 'Users',
            'details' => "Created admin user '{$user->name}' ({$user->email}) with role '{$roleLabel}'.",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully.',
            'user' => new UserResource($user),
        ], 201);
    }

    /**
     * Update user.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        Gate::authorize('update', $user);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => ['sometimes', new Enum(UserRole::class)],
            'department_id' => 'nullable|string|max:100',
            'departmentId' => 'nullable|string|max:100',
            'status' => 'sometimes|string|in:Active,Inactive',
        ]);

        if (isset($validated['name'])) $user->name = $validated['name'];
        if (isset($validated['email'])) $user->email = $validated['email'];
        if (!empty($validated['password'])) $user->password = Hash::make($validated['password']);
        if (isset($validated['role'])) $user->role = $validated['role'];
        if (array_key_exists('department_id', $validated) || array_key_exists('departmentId', $validated)) {
            $user->department_id = $validated['department_id'] ?? $validated['departmentId'] ?? null;
        }
        if (isset($validated['status'])) $user->status = $validated['status'];

        $user->save();

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()->id,
            'user_email' => $request->user()->email,
            'action' => 'UPDATE_USER',
            'module' => 'Users',
            'details' => "Updated user '{$user->name}' ({$user->email}).",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User updated successfully.',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Delete user.
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);
        Gate::authorize('delete', $user);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete currently logged in administrator.'], 422);
        }

        $email = $user->email;
        $user->delete();

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()->id,
            'user_email' => $request->user()->email,
            'action' => 'DELETE_USER',
            'module' => 'Users',
            'details' => "Deleted user account '{$email}'.",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully.',
        ]);
    }
}