<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organogram;
use App\Models\OrganogramVersion;
use App\Models\OrganogramNode;
use Illuminate\Support\Facades\DB;

class OrganogramSeeder extends Seeder
{
    public function run(): void
    {
        DB::beginTransaction();
        try {
            // 1. Create or update root Organogram
            $organogram = Organogram::updateOrCreate(
                ['id' => 1],
                [
                    'title' => "St. Philomena's College (Autonomous) Administrative Organogram",
                    'description' => "Official organizational hierarchy and governance matrix of St. Philomena's College (Autonomous), Bannimantap, Mysuru.",
                    'status' => 'published',
                    'layout_settings' => [
                        'direction' => 'top-to-bottom', // 'top-to-bottom' or 'left-to-right'
                        'connectorStyle' => 'elbow', // 'elbow', 'curved', 'straight'
                        'spacing' => 'comfortable', // 'compact', 'comfortable', 'custom'
                        'theme' => 'stphilos-official',
                        'gridPattern' => 'dots',
                        'showGrid' => true,
                    ],
                    'created_by' => 1,
                    'updated_by' => 1,
                ]
            );

            // 2. Create Initial Published Version 1.0
            $version = OrganogramVersion::updateOrCreate(
                [
                    'organogram_id' => $organogram->id,
                    'version_number' => '1.0'
                ],
                [
                    'status' => 'published',
                    'change_summary' => 'Initial authentic institutional baseline organogram.',
                    'created_by' => 1,
                    'published_by' => 1,
                    'published_at' => now(),
                ]
            );

            // Update current published version pointer
            $organogram->update(['current_published_version_id' => $version->id]);

            // 3. Define Authentic Institutional Nodes
            $nodesData = [
                // Apex Tier 1
                [
                    'id' => 'node_mdes',
                    'parent_id' => null,
                    'node_type' => 'governance',
                    'title' => 'MYSORE DIOCESAN EDUCATIONAL SOCIETY (MDES)',
                    'designation' => 'Apex Governing Society',
                    'description' => 'The apex educational trust governing Catholic institutions across Mysuru Diocese.',
                    'display_order' => 1,
                    'node_metadata' => [
                        'shape' => 'pill',
                        'bg_color' => '#0B1F4E',
                        'text_color' => '#FFFFFF',
                        'border_color' => '#C9A84C',
                        'badge' => 'Apex Body',
                    ]
                ],

                // Tier 2: Governing Body
                [
                    'id' => 'node_governing_body',
                    'parent_id' => 'node_mdes',
                    'node_type' => 'governance',
                    'title' => 'Governing Body',
                    'designation' => 'Statutory Autonomous Board',
                    'description' => 'Statutory body constituted under UGC Autonomous guidelines directing policy and development.',
                    'display_order' => 2,
                    'node_metadata' => [
                        'shape' => 'rounded',
                        'bg_color' => '#005b7f',
                        'text_color' => '#FFFFFF',
                        'border_color' => '#0B1F4E',
                    ]
                ],

                // Tier 3: Rector
                [
                    'id' => 'node_rector',
                    'parent_id' => 'node_governing_body',
                    'node_type' => 'management',
                    'title' => 'Rector',
                    'designation' => 'Executive Head & Campus Spiritual Leader',
                    'description' => 'Representative of the MDES President steering institutional identity and campus oversight.',
                    'display_order' => 3,
                    'node_metadata' => [
                        'shape' => 'rounded',
                        'bg_color' => '#005b7f',
                        'text_color' => '#FFFFFF',
                        'border_color' => '#0B1F4E',
                    ]
                ],

                // Branch under Rector: Campus Administration
                [
                    'id' => 'node_campus_admin',
                    'parent_id' => 'node_rector',
                    'node_type' => 'administration',
                    'title' => 'Campus Administration',
                    'designation' => 'Campus Operations & Estate',
                    'description' => 'Supervises physical estate maintenance, institutional logistics, and administrative support staff.',
                    'display_order' => 1,
                    'node_metadata' => [
                        'shape' => 'rounded',
                        'bg_color' => '#7a431d',
                        'text_color' => '#FFFFFF',
                        'border_color' => '#c26a27',
                    ]
                ],
                [
                    'id' => 'node_infra',
                    'parent_id' => 'node_campus_admin',
                    'node_type' => 'administration',
                    'title' => 'Infrastructure / Campus Maintenance',
                    'designation' => 'Civil, Electrical & Estate Works',
                    'display_order' => 1,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#c26a27', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_admin_staff',
                    'parent_id' => 'node_campus_admin',
                    'node_type' => 'administration',
                    'title' => 'Admin Staff',
                    'designation' => 'General Administration',
                    'display_order' => 2,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#c26a27', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_support_staff',
                    'parent_id' => 'node_campus_admin',
                    'node_type' => 'administration',
                    'title' => 'Support Staff',
                    'designation' => 'Facilities & Support Services',
                    'display_order' => 3,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#c26a27', 'text_color' => '#FFFFFF']
                ],

                // Tier 4: Principal
                [
                    'id' => 'node_principal',
                    'parent_id' => 'node_rector',
                    'node_type' => 'management',
                    'title' => 'Principal',
                    'designation' => 'Chief Academic & Executive Head',
                    'description' => 'Academic director, Chairman of Academic Council, and chief custodian of educational standards.',
                    'display_order' => 4,
                    'node_metadata' => [
                        'shape' => 'rounded',
                        'bg_color' => '#004759',
                        'text_color' => '#FFFFFF',
                        'border_color' => '#C9A84C',
                    ]
                ],

                // Attached Bodies to Principal
                [
                    'id' => 'node_academic_council',
                    'parent_id' => 'node_principal',
                    'node_type' => 'academic',
                    'title' => 'Academic Council',
                    'designation' => 'Highest Autonomous Curricular Authority',
                    'description' => 'Formulates academic regulations, syllabi, degree approvals, and examination bye-laws.',
                    'display_order' => 1,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#7a431d', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_planning_committee',
                    'parent_id' => 'node_principal',
                    'node_type' => 'academic',
                    'title' => 'Planning and Evaluation Committee',
                    'designation' => 'Strategic Planning Committee',
                    'display_order' => 2,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#7a431d', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_iqac',
                    'parent_id' => 'node_principal',
                    'node_type' => 'academic',
                    'title' => 'IQAC (Internal Quality Assurance Cell)',
                    'designation' => 'Quality Benchmarking & Accreditation Cell',
                    'description' => 'Drives NAAC, NIRF, faculty appraisals, student satisfaction surveys, and academic audits.',
                    'display_order' => 3,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#7a431d', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_rac',
                    'parent_id' => 'node_principal',
                    'node_type' => 'academic',
                    'title' => 'Research Advisory Committee',
                    'designation' => 'Institutional Research Governance',
                    'display_order' => 4,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#7a431d', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_rdc',
                    'parent_id' => 'node_rac',
                    'node_type' => 'academic',
                    'title' => 'Research and Development Cell',
                    'designation' => 'R&D Cell',
                    'display_order' => 1,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#7a431d', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_ipr',
                    'parent_id' => 'node_rdc',
                    'node_type' => 'academic',
                    'title' => 'Intellectual Property Rights Cell',
                    'designation' => 'IPR & Patents Cell',
                    'display_order' => 1,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#7a431d', 'text_color' => '#FFFFFF']
                ],

                // -------------------------------------------------------------
                // Tier 5: 6 Specialized Operational Pillars under Principal
                // -------------------------------------------------------------

                // Column 1: Vice Principal Administration
                [
                    'id' => 'node_vp_admin',
                    'parent_id' => 'node_principal',
                    'node_type' => 'administration',
                    'title' => 'Vice Principal Administration',
                    'designation' => 'Administrative Leadership',
                    'display_order' => 10,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#1f4996', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_vpa_hr',
                    'parent_id' => 'node_vp_admin',
                    'node_type' => 'administration',
                    'title' => 'Human Resources',
                    'display_order' => 1,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#1f4996', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_vpa_finance',
                    'parent_id' => 'node_vp_admin',
                    'node_type' => 'administration',
                    'title' => 'Finance / Purchase Committee',
                    'display_order' => 2,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#1f4996', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_vpa_irc',
                    'parent_id' => 'node_vp_admin',
                    'node_type' => 'administration',
                    'title' => 'Information Resources Centre',
                    'display_order' => 3,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#1f4996', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_vpa_training',
                    'parent_id' => 'node_vp_admin',
                    'node_type' => 'administration',
                    'title' => 'Consultation Training',
                    'display_order' => 4,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#1f4996', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_vpa_superintendent',
                    'parent_id' => 'node_vp_admin',
                    'node_type' => 'administration',
                    'title' => 'Office Superintendent',
                    'display_order' => 5,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#1f4996', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_vpa_placements',
                    'parent_id' => 'node_vp_admin',
                    'node_type' => 'administration',
                    'title' => 'Placements',
                    'display_order' => 6,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#1f4996', 'text_color' => '#FFFFFF']
                ],

                // Column 2: Vice Principal Academics
                [
                    'id' => 'node_vp_academics',
                    'parent_id' => 'node_principal',
                    'node_type' => 'academic',
                    'title' => 'Vice Principal Academics',
                    'designation' => 'Academic Dean & Dean of Faculty',
                    'display_order' => 20,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#058270', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_vpac_deans',
                    'parent_id' => 'node_vp_academics',
                    'node_type' => 'academic',
                    'title' => 'Deans',
                    'display_order' => 1,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#058270', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_vpac_hods',
                    'parent_id' => 'node_vp_academics',
                    'node_type' => 'academic',
                    'title' => 'HODs',
                    'display_order' => 2,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#058270', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_vpac_coordinators',
                    'parent_id' => 'node_vp_academics',
                    'node_type' => 'academic',
                    'title' => 'Department / Programme Coordinators',
                    'display_order' => 3,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#058270', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_vpac_faculty',
                    'parent_id' => 'node_vp_academics',
                    'node_type' => 'academic',
                    'title' => 'Faculty Members',
                    'display_order' => 4,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#058270', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_vpac_bos',
                    'parent_id' => 'node_vp_academics',
                    'node_type' => 'academic',
                    'title' => 'Board of Studies',
                    'display_order' => 5,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#058270', 'text_color' => '#FFFFFF']
                ],

                // Column 3: Post Graduate Director
                [
                    'id' => 'node_pg_director',
                    'parent_id' => 'node_principal',
                    'node_type' => 'academic',
                    'title' => 'Post Graduate Director',
                    'designation' => 'Director of PG Studies & Research Centre',
                    'display_order' => 30,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#6b218f', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_pgd_coordinator',
                    'parent_id' => 'node_pg_director',
                    'node_type' => 'academic',
                    'title' => 'PG Coordinator',
                    'display_order' => 1,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#6b218f', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_pgd_deans',
                    'parent_id' => 'node_pg_director',
                    'node_type' => 'academic',
                    'title' => 'PG Deans',
                    'display_order' => 2,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#6b218f', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_pgd_hods',
                    'parent_id' => 'node_pg_director',
                    'node_type' => 'academic',
                    'title' => 'PG HODs',
                    'display_order' => 3,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#6b218f', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_pgd_faculty',
                    'parent_id' => 'node_pg_director',
                    'node_type' => 'academic',
                    'title' => 'PG Faculty',
                    'display_order' => 4,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#6b218f', 'text_color' => '#FFFFFF']
                ],

                // Column 4: Controller of Examinations
                [
                    'id' => 'node_coe',
                    'parent_id' => 'node_principal',
                    'node_type' => 'exam',
                    'title' => 'Controller of Examinations',
                    'designation' => 'Autonomous Examination Authority',
                    'display_order' => 40,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#f07d18', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_coe_asst',
                    'parent_id' => 'node_coe',
                    'node_type' => 'exam',
                    'title' => 'Assistant Controller',
                    'display_order' => 1,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#f07d18', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_coe_superintendent',
                    'parent_id' => 'node_coe',
                    'node_type' => 'exam',
                    'title' => 'Chief Superintendent',
                    'display_order' => 2,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#f07d18', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_coe_boe',
                    'parent_id' => 'node_coe',
                    'node_type' => 'exam',
                    'title' => 'Board of Examiners',
                    'display_order' => 3,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#f07d18', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_coe_exam_committee',
                    'parent_id' => 'node_coe',
                    'node_type' => 'exam',
                    'title' => 'Examinations Committee',
                    'display_order' => 4,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#f07d18', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_coe_malpractice',
                    'parent_id' => 'node_coe',
                    'node_type' => 'exam',
                    'title' => 'Malpractice Committee',
                    'display_order' => 5,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#f07d18', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_coe_results',
                    'parent_id' => 'node_coe',
                    'node_type' => 'exam',
                    'title' => 'Evaluation and Results',
                    'display_order' => 6,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#f07d18', 'text_color' => '#FFFFFF']
                ],

                // Column 5: Cell / Committees
                [
                    'id' => 'node_committees',
                    'parent_id' => 'node_principal',
                    'node_type' => 'committee',
                    'title' => 'Cell / Committees',
                    'designation' => 'Statutory & Student Welfare Cells',
                    'display_order' => 50,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_cell_career',
                    'parent_id' => 'node_committees',
                    'node_type' => 'committee',
                    'title' => 'Career Guidance Cell',
                    'display_order' => 1,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_cell_edc',
                    'parent_id' => 'node_committees',
                    'node_type' => 'committee',
                    'title' => 'Entrepreneur Development Cell',
                    'display_order' => 2,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_cell_sdc',
                    'parent_id' => 'node_committees',
                    'node_type' => 'committee',
                    'title' => 'Skill Development Cell (SDC)',
                    'display_order' => 3,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_cell_women',
                    'parent_id' => 'node_committees',
                    'node_type' => 'committee',
                    'title' => "Women's Cell",
                    'display_order' => 4,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_cell_ict',
                    'parent_id' => 'node_committees',
                    'node_type' => 'committee',
                    'title' => 'ICT Cell',
                    'display_order' => 5,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_cell_dac',
                    'parent_id' => 'node_committees',
                    'node_type' => 'committee',
                    'title' => 'Data Analysis Centre',
                    'display_order' => 6,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_cell_comp_exam',
                    'parent_id' => 'node_committees',
                    'node_type' => 'committee',
                    'title' => 'Competitive Examination Cell',
                    'display_order' => 7,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_cell_international',
                    'parent_id' => 'node_committees',
                    'node_type' => 'committee',
                    'title' => "International Students' Cell",
                    'display_order' => 8,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_cell_counselling',
                    'parent_id' => 'node_committees',
                    'node_type' => 'committee',
                    'title' => 'Counselling Centre',
                    'display_order' => 9,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_cell_nirf',
                    'parent_id' => 'node_committees',
                    'node_type' => 'committee',
                    'title' => 'NIRF',
                    'display_order' => 10,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_cell_aishe',
                    'parent_id' => 'node_committees',
                    'node_type' => 'committee',
                    'title' => 'AISHE',
                    'display_order' => 11,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#911e61', 'text_color' => '#FFFFFF']
                ],

                // Column 6: Hostels
                [
                    'id' => 'node_hostels',
                    'parent_id' => 'node_principal',
                    'node_type' => 'hostel',
                    'title' => 'Hostels',
                    'designation' => 'Student Residential Facilities',
                    'display_order' => 60,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#d92582', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_hostel_boys',
                    'parent_id' => 'node_hostels',
                    'node_type' => 'hostel',
                    'title' => 'Warden - Boys Hostel',
                    'display_order' => 1,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#d92582', 'text_color' => '#FFFFFF']
                ],
                [
                    'id' => 'node_hostel_girls',
                    'parent_id' => 'node_hostels',
                    'node_type' => 'hostel',
                    'title' => 'Warden - Girls Hostel',
                    'display_order' => 2,
                    'node_metadata' => ['shape' => 'rounded', 'bg_color' => '#d92582', 'text_color' => '#FFFFFF']
                ],
            ];

            // 4. Save nodes to database
            foreach ($nodesData as $nd) {
                OrganogramNode::updateOrCreate(
                    ['id' => $nd['id']],
                    [
                        'organogram_version_id' => $version->id,
                        'parent_id' => $nd['parent_id'],
                        'node_type' => $nd['node_type'],
                        'title' => $nd['title'],
                        'designation' => $nd['designation'] ?? null,
                        'description' => $nd['description'] ?? null,
                        'display_order' => $nd['display_order'] ?? 0,
                        'node_metadata' => $nd['node_metadata'] ?? [],
                    ]
                );
            }

            // 5. Store snapshot in version for instant recall
            $version->update([
                'snapshot_data' => [
                    'organogram_title' => $organogram->title,
                    'layout_settings' => $organogram->layout_settings,
                    'nodes' => $nodesData,
                ]
            ]);

            DB::commit();
            $this->command->info("Organogram seeded successfully: " . count($nodesData) . " institutional nodes created under Version 1.0.");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Failed to seed organogram: " . $e->getMessage());
            throw $e;
        }
    }
}
