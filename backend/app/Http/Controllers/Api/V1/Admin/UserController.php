<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of users (SUPER_ADMIN only).
     */
    public function index(Request $request)
    {
        if ($request->user()->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized. Super Admin access required.'], 403);
        }

        $users = User::orderBy('id', 'asc')->get();
        return UserResource::collection($users);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        if ($request->user()->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized. Super Admin access required.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
            'status' => 'nullable|string|in:Active,Inactive',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'status' => $validated['status'] ?? 'Active',
        ]);

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()->id,
            'user_email' => $request->user()->email,
            'action' => 'CREATE_USER',
            'module' => 'Users',
            'details' => "Created admin user '{$user->name}' ({$user->email}) with role '{$user->role}'.",
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
        if ($request->user()->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized. Super Admin access required.'], 403);
        }

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|string',
            'status' => 'sometimes|string|in:Active,Inactive',
        ]);

        if (isset($validated['name'])) $user->name = $validated['name'];
        if (isset($validated['email'])) $user->email = $validated['email'];
        if (!empty($validated['password'])) $user->password = Hash::make($validated['password']);
        if (isset($validated['role'])) $user->role = $validated['role'];
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
        if ($request->user()->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized. Super Admin access required.'], 403);
        }

        $user = User::findOrFail($id);

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
