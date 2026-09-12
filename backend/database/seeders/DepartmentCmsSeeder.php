<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Department;
use App\Models\DepartmentSection;

class DepartmentCmsSeeder extends Seeder
{
    /**
     * Seed authentic departmental pages and their modular sections.
     */
    public function run(): void
    {
        $hierarchyPath = base_path('../src/data/academicsHierarchyData.json');
        $deptsJsonPath = base_path('../src/data/departments.json');
        $manifestPath = base_path('../src/data/departmentAssetsManifest.json');

        if (!File::exists($hierarchyPath)) {
            $this->command->error("Hierarchy data not found at: {$hierarchyPath}");
            return;
        }

        $hierarchy = json_decode(File::get($hierarchyPath), true) ?: [];
        $rawDepts = $hierarchy['departments'] ?? [];

        $departmentsJson = File::exists($deptsJsonPath) ? (json_decode(File::get($deptsJsonPath), true) ?: []) : [];
        $deptJsonMap = [];
        foreach ($departmentsJson as $dj) {
            $deptJsonMap[$dj['id']] = $dj;
            if (!empty($dj['slug'])) {
                $deptJsonMap[$dj['slug']] = $dj;
            }
        }

        $manifests = File::exists($manifestPath) ? (json_decode(File::get($manifestPath), true) ?: []) : [];
        $manifestMap = [];
        foreach ($manifests as $m) {
            $manifestMap[$m['deptId']] = $m;
        }

        $now = now();

        DB::beginTransaction();

        foreach ($rawDepts as $idx => $d) {
            $deptId = $d['id'];
            $cleanSlug = strtolower($d['slug'] ?? str_replace('dept-', '', $deptId));
            $cleanSlug = preg_replace('/[^a-z0-9]+/', '-', $cleanSlug);
            $cleanSlug = trim($cleanSlug, '-');

            $djMatch = $deptJsonMap[$deptId] ?? $deptJsonMap[$cleanSlug] ?? [];
            $manifest = $manifestMap[$deptId] ?? null;

            $bannerImage = $manifest['bannerRelPath'] ?? $djMatch['photoUrl'] ?? '/assets/banner-college.jpg';
            $allPrograms = array_unique(array_merge($d['ugProgrammes'] ?? [], $d['pgProgrammes'] ?? []));

            $shortDesc = $d['description'] ?? $djMatch['description'] ?? "Academic department offering cutting-edge undergraduate and postgraduate curricula.";
            if (strlen($shortDesc) > 300) {
                $shortDesc = substr($shortDesc, 0, 297) . '...';
            }

            // 1. Upsert Department
            $department = Department::updateOrCreate(
                ['id' => $deptId],
                [
                    'name' => $d['name'],
                    'slug' => $cleanSlug,
                    'short_description' => $shortDesc,
                    'category' => $d['category'] ?? 'Science',
                    'head' => $d['head'] ?? null,
                    'description' => $d['description'] ?? $djMatch['description'] ?? '',
                    'banner_image' => $bannerImage,
                    'programmes' => array_values($allPrograms),
                    'status' => 'published',
                    'display_order' => $idx + 1,
                    'seo_title' => "{$d['name']} | St. Philomena's College (Autonomous), Mysuru",
                    'seo_description' => "Explore {$d['name']} at St. Philomena's College. Programmes, distinguished faculty, curriculum, research labs, and academic excellence.",
                    'published_at' => $now,
                    'published_by' => 'System Migration',
                    'last_updated_by' => 'System Migration',
                ]
            );

            // 2. Define Standard Authentic Sections for this Department
            $sectionsDefinitions = [
                [
                    'section_key' => 'about',
                    'title' => 'About the Department',
                    'type' => 'text',
                    'display_order' => 10,
                    'content' => [
                        'heading' => 'About the Department',
                        'subheading' => 'Academic Legacy & Intellectual Rigour',
                        'body' => ($d['description'] ?? '') . "\n\n" . ($d['history'] ?? ''),
                        'badge' => 'Overview'
                    ]
                ],
                [
                    'section_key' => 'vision_mission',
                    'title' => 'Vision & Mission',
                    'type' => 'cards',
                    'display_order' => 20,
                    'content' => [
                        'heading' => 'Our Vision & Mission',
                        'subheading' => 'Foundational Principles Inspiring Excellence',
                        'cards' => [
                            [
                                'id' => 'card-vision',
                                'title' => 'Vision',
                                'subtitle' => 'Our Long-Term Aspiration',
                                'description' => $d['vision'] ?? 'To inspire and nurture intellectual excellence, human values, and social responsibility.',
                                'icon' => 'Eye',
                                'badge' => 'Aspiration'
                            ],
                            [
                                'id' => 'card-mission',
                                'title' => 'Mission',
                                'subtitle' => 'Our Pedagogical Commitment',
                                'description' => $d['mission'] ?? 'To impart quality higher education through rigorous academics, research, and holistic development.',
                                'icon' => 'Target',
                                'badge' => 'Commitment'
                            ]
                        ]
                    ]
                ],
                [
                    'section_key' => 'programs',
                    'title' => 'Academic Programmes',
                    'type' => 'programs',
                    'display_order' => 30,
                    'content' => [
                        'heading' => 'Programmes Offered',
                        'subheading' => 'Undergraduate & Postgraduate Degree Pathways',
                        'programCodes' => array_values($allPrograms)
                    ]
                ],
                [
                    'section_key' => 'faculty',
                    'title' => 'Faculty Directory',
                    'type' => 'faculty',
                    'display_order' => 40,
                    'content' => [
                        'heading' => 'Faculty Members',
                        'subheading' => 'Scholars, Mentors & Research Guides',
                        'layout' => 'grid'
                    ]
                ],
                [
                    'section_key' => 'facilities',
                    'title' => 'Laboratories & Infrastructure',
                    'type' => 'facilities',
                    'display_order' => 50,
                    'content' => [
                        'heading' => 'Department Facilities & Laboratories',
                        'subheading' => 'Equipped for Experiential & Analytical Learning',
                        'items' => array_map(function ($fac, $fIdx) {
                            return [
                                'id' => "fac-{$fIdx}",
                                'title' => is_array($fac) ? ($fac['title'] ?? 'Facility') : $fac,
                                'description' => is_array($fac) ? ($fac['description'] ?? '') : 'Specialized laboratory facility equipped with modern apparatus and instructional aids.'
                            ];
                        }, $d['facilities'] ?? [], array_keys($d['facilities'] ?? []))
                    ]
                ],
                [
                    'section_key' => 'documents',
                    'title' => 'Syllabus & Documents',
                    'type' => 'documents',
                    'display_order' => 60,
                    'content' => [
                        'heading' => 'Academic Documents & Syllabus',
                        'subheading' => 'Download Curriculum Scheme, Handbooks, and Regulations',
                        'documents' => [
                            [
                                'title' => "{$d['name']} - Autonomous Syllabus Scheme",
                                'filename' => "{$cleanSlug}-syllabus.pdf",
                                'fileUrl' => $manifest['syllabusRelPath'] ?? "/assets/departments/{$deptId}/syllabus/{$cleanSlug}-official-syllabus.pdf",
                                'type' => 'PDF',
                                'description' => 'Complete semester-wise curriculum structure and evaluation schemes.'
                            ]
                        ]
                    ]
                ],
                [
                    'section_key' => 'notices',
                    'title' => 'Department Notices & Announcements',
                    'type' => 'notices',
                    'display_order' => 70,
                    'content' => [
                        'heading' => 'Department Notices',
                        'subheading' => 'Latest Academic Announcements & Circulars',
                        'limit' => 4
                    ]
                ],
                [
                    'section_key' => 'events',
                    'title' => 'Conferences & Department Events',
                    'type' => 'events',
                    'display_order' => 80,
                    'content' => [
                        'heading' => 'Events & Seminars',
                        'subheading' => 'Workshops, Guest Lectures, and Symposia',
                        'limit' => 3
                    ]
                ],
                [
                    'section_key' => 'contact',
                    'title' => 'Contact Department',
                    'type' => 'contact',
                    'display_order' => 90,
                    'content' => [
                        'heading' => 'Get in Touch',
                        'email' => "{$cleanSlug}@stphilos.ac.in",
                        'phone' => '+91 821 4240900 / 912',
                        'office' => 'Main Academic Block, Ground Floor',
                        'workingHours' => 'Monday – Friday: 9:00 AM – 4:30 PM'
                    ]
                ]
            ];

            // 3. Populate both Published and Draft versions of sections
            foreach ($sectionsDefinitions as $secDef) {
                // Published version
                DepartmentSection::updateOrCreate(
                    [
                        'id' => "sec-pub-{$deptId}-{$secDef['section_key']}",
                    ],
                    [
                        'department_id' => $deptId,
                        'section_key' => $secDef['section_key'],
                        'title' => $secDef['title'],
                        'type' => $secDef['type'],
                        'content' => $secDef['content'],
                        'display_order' => $secDef['display_order'],
                        'is_enabled' => true,
                        'version' => 'published',
                    ]
                );

                // Draft version (initially identical to published)
                DepartmentSection::updateOrCreate(
                    [
                        'id' => "sec-dft-{$deptId}-{$secDef['section_key']}",
                    ],
                    [
                        'department_id' => $deptId,
                        'section_key' => $secDef['section_key'],
                        'title' => $secDef['title'],
                        'type' => $secDef['type'],
                        'content' => $secDef['content'],
                        'display_order' => $secDef['display_order'],
                        'is_enabled' => true,
                        'version' => 'draft',
                    ]
                );
            }
        }

        DB::commit();

        $this->command->info("Successfully migrated and seeded all " . count($rawDepts) . " departments with authentic section-based CMS content.");
    }
}
