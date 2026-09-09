<?php

namespace Tests\Feature;

use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_successful_login_returns_sanctum_token_and_user_data(): void
    {
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin.test@stphilos.ac.in',
            'password' => Hash::make('ValidSecurePassword123!'),
            'role' => UserRole::SUPER_ADMIN,
            'status' => 'Active',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin.test@stphilos.ac.in',
            'password' => 'ValidSecurePassword123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'token',
                'user' => ['id', 'name', 'email', 'role', 'status'],
            ])
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'email' => 'admin.test@stphilos.ac.in',
                    'role' => 'SUPER_ADMIN',
                ],
            ]);

        $this->assertNotEmpty($response->json('token'));
    }

    public function test_failed_login_with_invalid_credentials_returns_401(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin.test@stphilos.ac.in',
            'password' => Hash::make('CorrectPassword123!'),
            'role' => UserRole::SUPER_ADMIN,
            'status' => 'Active',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin.test@stphilos.ac.in',
            'password' => 'WrongPassword!',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'status' => 'error',
                'message' => 'Invalid admin credentials. Please check your email and password.',
            ]);
    }

    public function test_inactive_user_cannot_login_returns_403(): void
    {
        User::create([
            'name' => 'Deactivated User',
            'email' => 'inactive.test@stphilos.ac.in',
            'password' => Hash::make('Password123!'),
            'role' => UserRole::HOD_DEPARTMENT,
            'status' => 'Inactive',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'inactive.test@stphilos.ac.in',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'Your administrator account has been deactivated. Please contact the system administrator.',
            ]);
    }

    public function test_authenticated_user_can_retrieve_profile_via_me(): void
    {
        $user = User::create([
            'name' => 'BCA HOD',
            'email' => 'hod.bca.test@stphilos.ac.in',
            'password' => Hash::make('Password123!'),
            'role' => UserRole::HOD_DEPARTMENT,
            'department_id' => 'dept-bca',
            'status' => 'Active',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'email' => 'hod.bca.test@stphilos.ac.in',
                    'role' => 'HOD_DEPARTMENT',
                    'department_id' => 'dept-bca',
                ],
            ]);
    }

    public function test_unauthenticated_request_to_me_returns_401(): void
    {
        $response = $this->getJson('/api/v1/auth/me');
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_logout_and_revoke_session(): void
    {
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin.logout@stphilos.ac.in',
            'password' => Hash::make('Password123!'),
            'role' => UserRole::SUPER_ADMIN,
            'status' => 'Active',
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Successfully logged out.',
            ]);
    }
}