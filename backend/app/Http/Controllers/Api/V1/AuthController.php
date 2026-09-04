<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle admin login and issue Sanctum Bearer token.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid admin credentials. Please check your email and password.',
            ], 401);
        }

        if ($user->status !== 'Active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Your administrator account has been deactivated. Please contact the system administrator.',
            ], 403);
        }

        // Revoke old tokens if single active session is preferred
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('admin-api-token')->plainTextToken;

        // Log login activity
        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $user->id,
            'user_email' => $user->email,
            'action' => 'AUTH_LOGIN',
            'module' => 'Authentication',
            'details' => "Administrator {$user->name} logged into the CMS portal.",
        ]);

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Logout and revoke current token.
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $request->user()->currentAccessToken()->delete();

            ActivityLog::create([
                'id' => 'log_' . Str::random(8),
                'user_id' => $user->id,
                'user_email' => $user->email,
                'action' => 'AUTH_LOGOUT',
                'module' => 'Authentication',
                'details' => "Administrator {$user->name} logged out.",
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out.',
        ]);
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user' => new UserResource($request->user()),
        ]);
    }
}
