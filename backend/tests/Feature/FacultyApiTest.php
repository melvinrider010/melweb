<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class FacultyApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Point to the live database file for this reconciliation test
        Config::set('database.connections.sqlite.database', database_path('database.sqlite'));
        DB::purge('sqlite');
        DB::reconnect('sqlite');
    }

    public function test_faculty_endpoint_returns_exact_184_active_canonical_faculty(): void
    {
        $response = $this->getJson('/api/v1/faculty');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertIsArray($data);
        $this->assertCount(184, $data);

        foreach ($data as $faculty) {
            $this->assertEquals('active', $faculty['status']);
            $this->assertNotEmpty($faculty['id']);
            $this->assertNotEmpty($faculty['name']);
            $this->assertArrayHasKey('department', $faculty);
            $this->assertArrayHasKey('programmes', $faculty);
        }
    }

    public function test_faculty_endpoint_includes_inactive_when_requested(): void
    {
        $response = $this->getJson('/api/v1/faculty?include_inactive=true');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertIsArray($data);
        $this->assertCount(593, $data);
    }

    public function test_bca_programme_filter_returns_exact_count(): void
    {
        $response = $this->getJson('/api/v1/faculty?programme_code=BCA');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertCount(12, $data);
        foreach ($data as $f) {
            $this->assertEquals('active', $f['status']);
            $codes = array_column($f['programmes'], 'code');
            $this->assertContains('BCA', $codes);
        }
    }

    public function test_mca_programme_filter_returns_exact_count(): void
    {
        $response = $this->getJson('/api/v1/faculty?programme_code=MCA');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertCount(14, $data);
        foreach ($data as $f) {
            $this->assertEquals('active', $f['status']);
            $codes = array_column($f['programmes'], 'code');
            $this->assertContains('MCA', $codes);
        }
    }

    public function test_bvoc_programme_returns_zero_active_faculty(): void
    {
        $response = $this->getJson('/api/v1/faculty?programme_code=BVOC');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertCount(0, $data);
    }

    public function test_msc_cs_programme_returns_zero_active_faculty(): void
    {
        $response = $this->getJson('/api/v1/faculty?programme_code=MSC-CS');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertCount(0, $data);
    }

    public function test_show_faculty_returns_canonical_member(): void
    {
        $response = $this->getJson('/api/v1/faculty/fac_thomas_gunaseelan');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertEquals('fac_thomas_gunaseelan', $data['id']);
        $this->assertEquals('active', $data['status']);
        $this->assertEquals('dept-physics', $data['department_id']);
        $codes = array_column($data['programmes'], 'code');
        $this->assertContains('BSC', $codes);
        $this->assertContains('MSC-PHY', $codes);
    }

    public function test_show_faculty_returns_404_for_invalid_id(): void
    {
        $response = $this->getJson('/api/v1/faculty/fac_non_existent_id');
        $response->assertStatus(404);
    }

    public function test_faculty_division_category_filtering(): void
    {
        $response = $this->getJson('/api/v1/faculty?category=Science');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertNotEmpty($data);
        foreach ($data as $f) {
            $category = $f['department']['category'] ?? '';
            $this->assertStringContainsStringIgnoringCase('Science', $category);
        }
    }
}