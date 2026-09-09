<?php

namespace Tests\Feature;

use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    private User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');

        $this->adminUser = User::create([
            'name' => 'Upload Admin',
            'email' => 'uploader@stphilos.ac.in',
            'password' => Hash::make('Password123!'),
            'role' => UserRole::SUPER_ADMIN,
            'status' => 'Active',
        ]);
    }

    public function test_unauthenticated_user_cannot_upload_files(): void
    {
        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->postJson('/api/v1/admin/media', [
            'file' => $file,
        ]);

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_upload_valid_image_or_pdf(): void
    {
        $imageFile = UploadedFile::fake()->image('campus_view.jpg', 800, 600);

        $response = $this->actingAs($this->adminUser, 'sanctum')->postJson('/api/v1/admin/media', [
            'file' => $imageFile,
            'category' => 'campus',
            'alt_text' => 'Campus Main Block',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'url',
                'media' => ['id', 'filename', 'original_url', 'local_path', 'category'],
            ])
            ->assertJson([
                'status' => 'success',
                'message' => 'File uploaded successfully.',
            ]);

        $filename = $response->json('media.filename');
        $this->assertNotEmpty($filename);
        $this->assertStringEndsWith('.jpg', $filename);
        Storage::disk('public')->assertExists('uploads/media/' . $filename);
    }

    public function test_upload_of_prohibited_php_file_is_strictly_rejected(): void
    {
        $maliciousFile = UploadedFile::fake()->create('shell.php', 10, 'application/x-php');

        $response = $this->actingAs($this->adminUser, 'sanctum')->postJson('/api/v1/admin/media', [
            'file' => $maliciousFile,
        ]);

        $response->assertStatus(422);
    }

    public function test_upload_of_prohibited_executable_or_html_is_rejected(): void
    {
        $exeFile = UploadedFile::fake()->create('payload.exe', 50, 'application/x-msdownload');
        $responseExe = $this->actingAs($this->adminUser, 'sanctum')->postJson('/api/v1/admin/media', [
            'file' => $exeFile,
        ]);
        $responseExe->assertStatus(422);

        $htmlFile = UploadedFile::fake()->create('xss.html', 10, 'text/html');
        $responseHtml = $this->actingAs($this->adminUser, 'sanctum')->postJson('/api/v1/admin/media', [
            'file' => $htmlFile,
        ]);
        $responseHtml->assertStatus(422);
    }

    public function test_upload_exceeding_size_limit_is_rejected(): void
    {
        // 16MB exceeds 15MB limit
        $oversizedFile = UploadedFile::fake()->create('huge_file.pdf', 16384, 'application/pdf');

        $response = $this->actingAs($this->adminUser, 'sanctum')->postJson('/api/v1/admin/media', [
            'file' => $oversizedFile,
        ]);

        $response->assertStatus(422);
    }
}