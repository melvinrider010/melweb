<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Event;
use App\Models\Faculty;
use App\Models\Slider;
use App\Enums\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RbacAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $bcaHod;
    private User $physicsHod;
    private User $iqacManager;
    private User $academicManager;

    protected function setUp(): void
    {
        parent::setUp();

        $this->superAdmin = User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@stphilos.ac.in',
            'password' => Hash::make('Password123!'),
            'role' => UserRole::SUPER_ADMIN,
            'status' => 'Active',
        ]);

        $this->bcaHod = User::create([
            'name' => 'BCA HOD',
            'email' => 'hod.bca@stphilos.ac.in',
            'password' => Hash::make('Password123!'),
            'role' => UserRole::HOD_DEPARTMENT,
            'department_id' => 'dept-bca',
            'status' => 'Active',
        ]);

        $this->physicsHod = User::create([
            'name' => 'Physics HOD',
            'email' => 'hod.physics@stphilos.ac.in',
            'password' => Hash::make('Password123!'),
            'role' => UserRole::HOD_DEPARTMENT,
            'department_id' => 'dept-physics',
            'status' => 'Active',
        ]);

        $this->iqacManager = User::create([
            'name' => 'IQAC Coordinator',
            'email' => 'iqac@stphilos.ac.in',
            'password' => Hash::make('Password123!'),
            'role' => UserRole::IQAC_MANAGER,
            'status' => 'Active',
        ]);

        $this->academicManager = User::create([
            'name' => 'Academic Editor',
            'email' => 'academics@stphilos.ac.in',
            'password' => Hash::make('Password123!'),
            'role' => UserRole::ACADEMIC_MANAGER,
            'status' => 'Active',
        ]);
    }

    public function test_super_admin_can_access_user_management(): void
    {
        $response = $this->actingAs($this->superAdmin, 'sanctum')->getJson('/api/v1/admin/users');
        $response->assertStatus(200);
    }

    public function test_hod_cannot_access_user_management(): void
    {
        $response = $this->actingAs($this->bcaHod, 'sanctum')->getJson('/api/v1/admin/users');
        $response->assertStatus(403);
    }

    public function test_iqac_cannot_access_user_management(): void
    {
        $response = $this->actingAs($this->iqacManager, 'sanctum')->getJson('/api/v1/admin/users');
        $response->assertStatus(403);
    }

    public function test_academic_manager_cannot_access_user_management(): void
    {
        $response = $this->actingAs($this->academicManager, 'sanctum')->getJson('/api/v1/admin/users');
        $response->assertStatus(403);
    }

    public function test_super_admin_can_manage_any_department_event(): void
    {
        $event = Event::create([
            'id' => 'evt_test_physics',
            'slug' => 'physics-symposium-2026',
            'title' => 'Physics Symposium 2026',
            'event_date' => '2026-10-15',
            'department' => 'Department of Physics',
        ]);

        $response = $this->actingAs($this->superAdmin, 'sanctum')->putJson("/api/v1/admin/events/{$event->id}", [
            'title' => 'Physics Symposium 2026 - Updated by SuperAdmin',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('event.title', 'Physics Symposium 2026 - Updated by SuperAdmin');
    }

    public function test_hod_can_update_own_department_event(): void
    {
        $event = Event::create([
            'id' => 'evt_test_bca',
            'slug' => 'bca-hackathon-2026',
            'title' => 'BCA Hackathon 2026',
            'event_date' => '2026-11-20',
            'department' => 'Department of Computer Applications (BCA / MCA)',
        ]);

        $response = $this->actingAs($this->bcaHod, 'sanctum')->putJson("/api/v1/admin/events/{$event->id}", [
            'title' => 'BCA Hackathon 2026 - Updated by HOD',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('event.title', 'BCA Hackathon 2026 - Updated by HOD');
    }

    public function test_hod_cannot_update_other_department_event_enforcing_department_isolation(): void
    {
        $physicsEvent = Event::create([
            'id' => 'evt_test_physics_2',
            'slug' => 'physics-expo-2026',
            'title' => 'Physics Expo 2026',
            'event_date' => '2026-12-05',
            'department' => 'Department of Physics',
        ]);

        $response = $this->actingAs($this->bcaHod, 'sanctum')->putJson("/api/v1/admin/events/{$physicsEvent->id}", [
            'title' => 'Malicious Modification by Unauthorized HOD',
        ]);

        $response->assertStatus(403);
    }

    public function test_hod_can_create_and_delete_own_department_faculty(): void
    {
        $response = $this->actingAs($this->bcaHod, 'sanctum')->postJson('/api/v1/admin/faculty', [
            'name' => 'Prof. Computer Science',
            'designation' => 'Assistant Professor',
            'department' => 'Department of Computer Applications (BCA / MCA)',
            'qualification' => 'MCA, Ph.D',
        ]);

        $response->assertStatus(201);
        $facultyId = $response->json('faculty.id');

        $updateResponse = $this->actingAs($this->bcaHod, 'sanctum')->putJson("/api/v1/admin/faculty/{$facultyId}", [
            'name' => 'Prof. Computer Science (Updated)',
            'department' => 'Department of Computer Applications (BCA / MCA)',
        ]);
        $updateResponse->assertStatus(200)
            ->assertJsonPath('faculty.name', 'Prof. Computer Science (Updated)');

        $deleteResponse = $this->actingAs($this->bcaHod, 'sanctum')->deleteJson("/api/v1/admin/faculty/{$facultyId}");
        $deleteResponse->assertStatus(200);
    }

    public function test_hod_cannot_create_or_delete_other_department_faculty(): void
    {
        $createResponse = $this->actingAs($this->bcaHod, 'sanctum')->postJson('/api/v1/admin/faculty', [
            'name' => 'Prof. Physics Expert',
            'designation' => 'Professor',
            'department' => 'Department of Physics',
            'qualification' => 'M.Sc, Ph.D',
        ]);

        $createResponse->assertStatus(403);

        $physicsFaculty = Faculty::create([
            'id' => 'fac_phys_99',
            'name' => 'Prof. Physics Existing',
            'department' => 'Department of Physics',
        ]);

        $updateResponse = $this->actingAs($this->bcaHod, 'sanctum')->putJson("/api/v1/admin/faculty/{$physicsFaculty->id}", [
            'name' => 'Unauthorized Name Update',
            'department' => 'Department of Physics',
        ]);
        $updateResponse->assertStatus(403);

        $deleteResponse = $this->actingAs($this->bcaHod, 'sanctum')->deleteJson("/api/v1/admin/faculty/{$physicsFaculty->id}");
        $deleteResponse->assertStatus(403);
    }

    public function test_public_can_view_faculty_and_single_faculty(): void
    {
        $bcaDept = \App\Models\Department::create([
            'id' => 'dept-bca-test',
            'name' => 'Department of Computer Applications',
        ]);

        $bcaProg = \App\Models\Programme::create([
            'code' => 'BCA-TEST',
            'title' => 'Bachelor of Computer Applications',
            'level' => 'ug',
        ]);

        $faculty = Faculty::create([
            'id' => 'fac_public_sample',
            'name' => 'Dr. Sample Faculty',
            'department_id' => 'dept-bca-test',
            'department' => 'Department of Computer Applications',
            'qualification' => 'Ph.D in Computer Applications',
            'status' => 'active',
        ]);

        $faculty->programmes()->attach('BCA-TEST');

        // 1. General list
        $listResponse = $this->getJson('/api/v1/faculty');
        $listResponse->assertStatus(200);

        // 2. Department filter
        $deptResponse = $this->getJson('/api/v1/faculty?department_id=dept-bca-test');
        $deptResponse->assertStatus(200)
            ->assertJsonPath('0.name', 'Dr. Sample Faculty')
            ->assertJsonPath('0.programmes.0.code', 'BCA-TEST');

        // 3. Programme filter
        $progResponse = $this->getJson('/api/v1/faculty?programme_code=BCA-TEST');
        $progResponse->assertStatus(200)
            ->assertJsonPath('0.name', 'Dr. Sample Faculty');

        // 4. Single faculty lookup
        $singleResponse = $this->getJson("/api/v1/faculty/{$faculty->id}");
        $singleResponse->assertStatus(200)
            ->assertJsonPath('name', 'Dr. Sample Faculty')
            ->assertJsonPath('department_id', 'dept-bca-test');
    }

    public function test_super_admin_can_manage_sliders_and_settings(): void
    {
        $sliderResponse = $this->actingAs($this->superAdmin, 'sanctum')->postJson('/api/v1/admin/sliders', [
            'title' => 'Welcome to St. Philomena',
            'image' => '/assets/sliders/slide1.webp',
        ]);
        $sliderResponse->assertStatus(201);

        $settingsResponse = $this->actingAs($this->superAdmin, 'sanctum')->postJson('/api/v1/admin/settings', [
            'site_title' => 'St. Philomena College Mysuru',
        ]);
        $settingsResponse->assertStatus(200);
    }

    public function test_non_super_admin_cannot_manage_sliders_or_settings(): void
    {
        $sliderResponse = $this->actingAs($this->bcaHod, 'sanctum')->postJson('/api/v1/admin/sliders', [
            'title' => 'Unauthorized Slider',
            'image' => '/assets/sliders/slide1.webp',
        ]);
        $sliderResponse->assertStatus(403);

        $settingsResponse = $this->actingAs($this->iqacManager, 'sanctum')->postJson('/api/v1/admin/settings', [
            'site_title' => 'Malicious Setting Change',
        ]);
        $settingsResponse->assertStatus(403);
    }

    public function test_unauthenticated_requests_to_admin_endpoints_return_401(): void
    {
        $this->getJson('/api/v1/admin/users')->assertStatus(401);
        $this->postJson('/api/v1/admin/events', [])->assertStatus(401);
        $this->postJson('/api/v1/admin/notices', [])->assertStatus(401);
        $this->postJson('/api/v1/admin/faculty', [])->assertStatus(401);
        $this->postJson('/api/v1/admin/sliders', [])->assertStatus(401);
        $this->postJson('/api/v1/admin/settings', [])->assertStatus(401);
        $this->getJson('/api/v1/admin/logs')->assertStatus(401);
    }

    public function test_public_can_view_documents_with_pagination_and_filters(): void
    {
        \App\Models\Document::create([
            'id' => 'doc_test_1',
            'title' => 'BCA NEP Syllabus 2026',
            'filename' => 'bca-nep-syllabus-2026.pdf',
            'original_url' => '/assets/documents/bca-syllabus.pdf',
            'local_path' => 'assets/documents/bca-syllabus.pdf',
            'category' => 'Syllabus',
            'year' => '2025-2026',
            'extension' => 'pdf',
        ]);

        \App\Models\Document::create([
            'id' => 'doc_test_2',
            'title' => 'Annual Examination Schedule 2026',
            'filename' => 'exam-schedule-2026.pdf',
            'original_url' => '/assets/documents/exam-schedule.pdf',
            'local_path' => 'assets/documents/exam-schedule.pdf',
            'category' => 'Examination',
            'year' => '2025-2026',
            'extension' => 'pdf',
        ]);

        // 1. Paginated list
        $response = $this->getJson('/api/v1/documents?per_page=10');
        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page', 'total', 'last_page']);

        // 2. Category filter
        $catResponse = $this->getJson('/api/v1/documents?category=Syllabus');
        $catResponse->assertStatus(200)
            ->assertJsonPath('data.0.title', 'BCA NEP Syllabus 2026');

        // 3. Search query
        $searchResponse = $this->getJson('/api/v1/documents?search=Examination');
        $searchResponse->assertStatus(200)
            ->assertJsonPath('data.0.title', 'Annual Examination Schedule 2026');

        // 4. Single lookup
        $singleResponse = $this->getJson('/api/v1/documents/doc_test_1');
        $singleResponse->assertStatus(200)
            ->assertJsonPath('title', 'BCA NEP Syllabus 2026');

        // 5. 404 for nonexistent document
        $this->getJson('/api/v1/documents/nonexistent_id')->assertStatus(404);
    }
}