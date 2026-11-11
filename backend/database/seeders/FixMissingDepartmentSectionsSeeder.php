<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Department;
use App\Models\DepartmentSection;

class FixMissingDepartmentSectionsSeeder extends Seeder
{
    /**
     * Seed missing sections for Department of Vocational Studies (B.Voc) and Department of BBA -TH.
     */
    public function run(): void
    {
        DB::beginTransaction();

        try {
            // 1. UPDATE AND SEED FOR DEPT-BVOC (Department of Vocational Studies)
            $bvocDept = Department::updateOrCreate(
                ['id' => 'dept-bvoc'],
                [
                    'name' => 'Department of Vocational Studies (B.Voc)',
                    'slug' => 'bvoc',
                    'short_description' => 'Industry-integrated vocational degrees designed with sector skill councils in Healthcare Technology and Media & Entertainment.',
                    'category' => 'Vocational Studies',
                    'description' => 'Industry-integrated vocational degrees designed with sector skill councils (Healthcare Technology and Media & Entertainment). Established to impart employment-oriented skill education under UGC B.Voc schemes.',
                    'banner_image' => '/assets/banner-college.jpg',
                    'programmes' => ['BVOC', 'bvoc-healthcare', 'bvoc-media-entertainment'],
                    'status' => 'published',
                    'display_order' => 11,
                    'seo_title' => "Department of Vocational Studies (B.Voc) | St. Philomena's College",
                    'seo_description' => "Explore UGC B.Voc programmes in Healthcare Technology and Media & Entertainment at St. Philomena's College (Autonomous), Mysuru."
                ]
            );

            $bvocSections = [
                [
                    'section_key' => 'about',
                    'title' => 'About the Department',
                    'type' => 'text',
                    'display_order' => 10,
                    'content' => [
                        'heading' => 'About the Department',
                        'subheading' => 'Skill-Based Education & Industrial Synergies',
                        'body' => "The Department of Vocational Studies (B.Voc) at St. Philomena's College (Autonomous) offers innovative, employment-driven undergraduate degree programmes designed under the University Grants Commission (UGC) National Skills Qualifications Framework (NSQF).\n\nWith customized curricula developed in active consultation with Sector Skill Councils, our streams in Healthcare Technology and Media & Entertainment blend high-calibre classroom rigor with extensive hospital rotations, broadcast studio productions, and corporate internships.",
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
                                'description' => 'To bridge academia and industry with skill-based vocational excellence, empowering students to become ethical, career-ready professionals.',
                                'icon' => 'Eye',
                                'badge' => 'Aspiration'
                            ],
                            [
                                'id' => 'card-mission',
                                'title' => 'Mission',
                                'subtitle' => 'Our Pedagogical Commitment',
                                'description' => 'To provide specialized professional training, hands-on clinical and studio internships, and entrepreneurial competencies in Healthcare Technology and Media & Entertainment.',
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
                        'subheading' => 'Vocational Degree Pathways (NSQF Level 7)',
                        'programCodes' => ['BVOC', 'bvoc-healthcare', 'bvoc-media-entertainment']
                    ]
                ],
                [
                    'section_key' => 'faculty',
                    'title' => 'Faculty Directory',
                    'type' => 'faculty',
                    'display_order' => 40,
                    'content' => [
                        'heading' => 'Faculty Members',
                        'subheading' => 'Scholars, Mentors & Industry Practitioners',
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
                        'subheading' => 'Equipped for Experiential & Production-Grade Training',
                        'items' => [
                            [
                                'id' => 'fac-0',
                                'title' => 'Media & Broadcast Production Studio',
                                'description' => 'Specialized studio suite equipped with multi-camera setups, chroma key green screens, acoustic treatment, sound design consoles, and non-linear video editing workstations.'
                            ],
                            [
                                'id' => 'fac-1',
                                'title' => 'Healthcare Simulation & Diagnostic Lab',
                                'description' => 'State-of-the-art diagnostic and clinical simulation laboratory featuring hematology analyzers, diagnostic microscopes, patient simulators, and hospital workflow workstations.'
                            ]
                        ]
                    ]
                ],
                [
                    'section_key' => 'documents',
                    'title' => 'Syllabus & Documents',
                    'type' => 'documents',
                    'display_order' => 60,
                    'content' => [
                        'heading' => 'Academic Documents & Syllabus',
                        'subheading' => 'Download Curriculum Scheme, Regulations, and Board of Studies Schemes',
                        'documents' => [
                            [
                                'title' => 'B.Voc Healthcare Technology - Syllabus Scheme',
                                'filename' => 'BVOC-HT.pdf',
                                'fileUrl' => '/assets/documents/historical/2026/BVOC-HT.pdf',
                                'type' => 'PDF',
                                'description' => 'Complete curriculum scheme, laboratory modules, and hospital rotation outlines for B.Voc Healthcare Technology.'
                            ],
                            [
                                'title' => 'B.Voc Media & Entertainment - Syllabus Scheme',
                                'filename' => 'BVOC-ME.pdf',
                                'fileUrl' => '/assets/documents/historical/2026/BVOC-ME.pdf',
                                'type' => 'PDF',
                                'description' => 'Curriculum framework, studio production guidelines, and evaluation schemes for B.Voc Media & Entertainment.'
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
                        'heading' => 'Events & Workshops',
                        'subheading' => 'Industry Seminars, Masterclasses & Exhibitions',
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
                        'email' => 'bvoc@stphilos.ac.in',
                        'phone' => '+91 821 4240900 / 912',
                        'office' => 'Vocational Studies Block, Ground Floor',
                        'workingHours' => 'Monday – Friday: 9:00 AM – 4:30 PM'
                    ]
                ]
            ];

            foreach ($bvocSections as $secDef) {
                // Published version
                DepartmentSection::updateOrCreate(
                    [
                        'id' => "sec-pub-dept-bvoc-{$secDef['section_key']}",
                    ],
                    [
                        'department_id' => 'dept-bvoc',
                        'section_key' => $secDef['section_key'],
                        'title' => $secDef['title'],
                        'type' => $secDef['type'],
                        'content' => $secDef['content'],
                        'display_order' => $secDef['display_order'],
                        'is_enabled' => true,
                        'version' => 'published',
                    ]
                );

                // Draft version
                DepartmentSection::updateOrCreate(
                    [
                        'id' => "sec-dft-dept-bvoc-{$secDef['section_key']}",
                    ],
                    [
                        'department_id' => 'dept-bvoc',
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

            // 2. SEED MISSING SECTIONS FOR DEPT-BBA-TH (Documents, Notices, Events)
            $bbathDept = Department::where('id', 'dept-bba-th')->first();
            if ($bbathDept) {
                $bbathDept->update([
                    'programmes' => ['BBA-TH', 'bba-thm']
                ]);
            }

            $bbathMissingSections = [
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
                                'title' => 'BBA Tourism & Hospitality Management - Autonomous Scheme',
                                'filename' => 'BBA-TH-FINAL.pdf',
                                'fileUrl' => '/assets/documents/historical/2026/BBA-TH-FINAL.pdf',
                                'type' => 'PDF',
                                'description' => 'Autonomous syllabus scheme, course regulations, and semester-wise evaluation parameters.'
                            ],
                            [
                                'title' => 'BBA-TH Semester II Syllabus & Course Scheme',
                                'filename' => 'BBA-TH-Semester-II.pdf',
                                'fileUrl' => '/wp-content/uploads/2022/05/BBA-TH-Semester-II.pdf',
                                'type' => 'PDF',
                                'description' => 'Detailed curriculum modules for Tourism & Hospitality Management.'
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
                        'subheading' => 'Internship Updates, Schedules & Circulars',
                        'limit' => 4
                    ]
                ],
                [
                    'section_key' => 'events',
                    'title' => 'Conferences & Department Events',
                    'type' => 'events',
                    'display_order' => 80,
                    'content' => [
                        'heading' => 'Events & Culinary Showcases',
                        'subheading' => 'Hospitality Conclaves, Tourism Summits & Food Fests',
                        'limit' => 3
                    ]
                ]
            ];

            foreach ($bbathMissingSections as $secDef) {
                DepartmentSection::updateOrCreate(
                    [
                        'id' => "sec-pub-dept-bba-th-{$secDef['section_key']}",
                    ],
                    [
                        'department_id' => 'dept-bba-th',
                        'section_key' => $secDef['section_key'],
                        'title' => $secDef['title'],
                        'type' => $secDef['type'],
                        'content' => $secDef['content'],
                        'display_order' => $secDef['display_order'],
                        'is_enabled' => true,
                        'version' => 'published',
                    ]
                );

                DepartmentSection::updateOrCreate(
                    [
                        'id' => "sec-dft-dept-bba-th-{$secDef['section_key']}",
                    ],
                    [
                        'department_id' => 'dept-bba-th',
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

            DB::commit();
            echo "Successfully seeded missing sections for dept-bvoc (9 sections) and dept-bba-th (9 sections total).\n";
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
