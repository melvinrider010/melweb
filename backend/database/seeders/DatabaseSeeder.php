<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Event;
use App\Models\SubEvent;
use App\Models\EventAttachment;
use App\Models\Notice;
use App\Models\Slider;
use App\Models\Media;
use App\Models\Document;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\Programme;
use App\Models\ActivityLog;
use App\Models\Setting;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with authentic institutional datasets.
     */
    public function run(): void
    {
        $baseDataDir = base_path('../src/data');

        // 1. Seed Admin Users with Secure Unique Passwords
        $adminCredentials = [
            [
                'id' => 1,
                'name' => 'College Administrator',
                'email' => 'admin@stphilos.ac.in',
                'password_plain' => 'SPC_Admin!946#Sec',
                'role' => 'SUPER_ADMIN',
                'status' => 'Active',
            ],
            [
                'id' => 2,
                'name' => 'IQAC Coordinator',
                'email' => 'iqac@stphilos.ac.in',
                'password_plain' => 'SPC_Iqac!2026#Hub',
                'role' => 'IQAC_MANAGER',
                'status' => 'Active',
            ],
            [
                'id' => 3,
                'name' => 'Academic Editor',
                'email' => 'academics@stphilos.ac.in',
                'password_plain' => 'SPC_Acad!2026#Mgr',
                'role' => 'ACADEMIC_MANAGER',
                'status' => 'Active',
            ]
        ];

        $credentialsLog = "==========================================================\n";
        $credentialsLog .= "ST. PHILOMENA'S COLLEGE - INITIAL ADMIN CREDENTIALS\n";
        $credentialsLog .= "Generated at: " . date('Y-m-d H:i:s') . "\n";
        $credentialsLog .= "NOTE: Change passwords upon initial deployment.\n";
        $credentialsLog .= "==========================================================\n\n";

        foreach ($adminCredentials as $cred) {
            User::updateOrCreate(
                ['email' => $cred['email']],
                [
                    'name' => $cred['name'],
                    'password' => Hash::make($cred['password_plain']),
                    'role' => $cred['role'],
                    'status' => $cred['status'],
                ]
            );

            $credentialsLog .= sprintf(
                "Role:     %s\nEmail:    %s\nPassword: %s\nStatus:   %s\n----------------------------------------------------------\n",
                $cred['role'],
                $cred['email'],
                $cred['password_plain'],
                $cred['status']
            );
        }

        // Write to git-ignored credentials file
        File::put(base_path('.credentials-DO-NOT-COMMIT.txt'), $credentialsLog);

        // 2. Seed Events, SubEvents & Attachments from events.json
        $eventsPath = $baseDataDir . '/events.json';
        if (File::exists($eventsPath)) {
            $events = json_decode(File::get($eventsPath), true) ?: [];
            $now = now();
            
            DB::beginTransaction();
            foreach (array_chunk($events, 200) as $chunk) {
                $insertEvents = [];
                foreach ($chunk as $evtData) {
                    $insertEvents[] = [
                        'id' => $evtData['id'],
                        'slug' => $evtData['slug'] ?? Str::slug($evtData['title']),
                        'title' => $evtData['title'],
                        'description' => $evtData['description'] ?? $evtData['summary'] ?? null,
                        'summary' => $evtData['summary'] ?? $evtData['description'] ?? null,
                        'event_date' => $evtData['event_date'] ?? $evtData['date'],
                        'end_date' => $evtData['end_date'] ?? null,
                        'display_date' => $evtData['displayDate'] ?? null,
                        'time_range' => $evtData['time_range'] ?? $evtData['time'] ?? '09:30 AM – 04:30 PM',
                        'location' => $evtData['location'] ?? $evtData['venue'] ?? 'College Campus',
                        'category' => $evtData['category'] ?? 'Conferences & Seminars',
                        'level' => $evtData['level'] ?? 'all',
                        'ref_no' => $evtData['refNo'] ?? null,
                        'document_image' => $evtData['documentImage'] ?? null,
                        'document_pdf' => $evtData['documentPdf'] ?? null,
                        'signatory' => $evtData['signatory'] ?? null,
                        'department' => $evtData['department'] ?? null,
                        'content' => isset($evtData['content']) ? json_encode($evtData['content']) : null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                Event::upsert($insertEvents, ['id'], [
                    'slug', 'title', 'description', 'summary', 'event_date', 'end_date',
                    'display_date', 'time_range', 'location', 'category', 'level', 'ref_no',
                    'document_image', 'document_pdf', 'signatory', 'department', 'content', 'updated_at'
                ]);
            }
            DB::commit();

            // Sub events & attachments for seed items with subEvents
            foreach ($events as $evtData) {
                if (!empty($evtData['subEvents'])) {
                    foreach ($evtData['subEvents'] as $subData) {
                        SubEvent::updateOrCreate(
                            ['id' => $subData['id']],
                            [
                                'event_id' => $evtData['id'],
                                'title' => $subData['title'],
                                'description' => $subData['description'] ?? null,
                                'event_date' => $subData['event_date'] ?? $evtData['event_date'] ?? $evtData['date'],
                                'display_date' => $subData['displayDate'] ?? null,
                                'time_range' => $subData['time_range'] ?? $subData['time'] ?? '10:00 AM – 01:00 PM',
                                'location' => $subData['location'] ?? $subData['venue'] ?? 'College Campus',
                            ]
                        );
                    }
                }

                if (!empty($evtData['attachments'])) {
                    foreach ($evtData['attachments'] as $att) {
                        EventAttachment::firstOrCreate(
                            [
                                'event_id' => $evtData['id'],
                                'title' => $att['title'],
                                'url' => $att['url'],
                            ],
                            ['type' => $att['type'] ?? 'image/jpeg']
                        );
                    }
                }
            }
        }

        // 3. Seed Notices from notices.json
        $noticesPath = $baseDataDir . '/notices.json';
        if (File::exists($noticesPath)) {
            $notices = json_decode(File::get($noticesPath), true) ?: [];
            $now = now();

            DB::beginTransaction();
            foreach (array_chunk($notices, 200) as $chunk) {
                $insertNotices = [];
                foreach ($chunk as $notData) {
                    $insertNotices[] = [
                        'id' => $notData['id'],
                        'slug' => $notData['slug'] ?? Str::slug($notData['title']),
                        'type' => $notData['type'] ?? 'Notice',
                        'level' => $notData['level'] ?? 'all',
                        'title' => $notData['title'],
                        'ref_no' => $notData['refNo'] ?? null,
                        'date' => $notData['date'],
                        'display_date' => $notData['displayDate'] ?? null,
                        'category' => $notData['category'] ?? null,
                        'tags' => isset($notData['tags']) ? json_encode($notData['tags']) : json_encode(['CIRCULAR']),
                        'summary' => $notData['summary'] ?? null,
                        'document_image' => $notData['documentImage'] ?? null,
                        'content' => isset($notData['content']) ? json_encode($notData['content']) : null,
                        'signatory' => $notData['signatory'] ?? null,
                        'department' => $notData['department'] ?? null,
                        'link' => $notData['link'] ?? null,
                        'downloadable' => !empty($notData['downloadable']) ? 1 : 0,
                        'linked_event_id' => $notData['linked_event_id'] ?? null,
                        'linked_sub_event_id' => $notData['linked_sub_event_id'] ?? null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                Notice::upsert($insertNotices, ['id'], [
                    'slug', 'type', 'level', 'title', 'ref_no', 'date', 'display_date',
                    'category', 'tags', 'summary', 'document_image', 'content', 'signatory',
                    'department', 'link', 'downloadable', 'linked_event_id', 'linked_sub_event_id', 'updated_at'
                ]);
            }
            DB::commit();
        }

        // 4. Seed Sliders
        $slidersPath = $baseDataDir . '/sliders.json';
        if (File::exists($slidersPath)) {
            $sliders = json_decode(File::get($slidersPath), true) ?: [];
            foreach ($sliders as $s) {
                Slider::updateOrCreate(
                    ['id' => $s['id']],
                    [
                        'category' => $s['category'] ?? null,
                        'title' => $s['title'],
                        'subtitle' => $s['subtitle'] ?? null,
                        'description' => $s['description'] ?? null,
                        'image' => $s['image'],
                        'cta_text' => $s['ctaText'] ?? null,
                        'cta_link' => $s['ctaLink'] ?? null,
                        'status' => $s['status'] ?? 'published',
                        'priority' => $s['priority'] ?? 1,
                    ]
                );
            }
        }

        // 5. Seed Media Library (Batch upsert)
        $mediaPath = $baseDataDir . '/media.json';
        if (File::exists($mediaPath)) {
            $mediaList = json_decode(File::get($mediaPath), true) ?: [];
            $now = now();
            DB::beginTransaction();
            foreach (array_chunk($mediaList, 200) as $chunk) {
                $insertMedia = [];
                foreach ($chunk as $m) {
                    $insertMedia[] = [
                        'id' => $m['id'],
                        'original_url' => $m['originalUrl'] ?? null,
                        'local_path' => $m['localPath'] ?? null,
                        'filename' => $m['filename'],
                        'category' => $m['category'] ?? 'campus',
                        'alt_text' => $m['altText'] ?? null,
                        'file_size' => $m['fileSize'] ?? 0,
                        'sha256' => $m['sha256'] ?? null,
                        'download_status' => $m['downloadStatus'] ?? 'Downloaded',
                        'discovered_at' => $m['discoveredAt'] ?? null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                Media::upsert($insertMedia, ['id'], [
                    'original_url', 'local_path', 'filename', 'category', 'alt_text',
                    'file_size', 'sha256', 'download_status', 'discovered_at', 'updated_at'
                ]);
            }
            DB::commit();
        }

        // 6. Seed Documents (Batch upsert)
        $docsPath = $baseDataDir . '/documents.json';
        if (File::exists($docsPath)) {
            $docList = json_decode(File::get($docsPath), true) ?: [];
            $now = now();
            DB::beginTransaction();
            foreach (array_chunk($docList, 200) as $chunk) {
                $insertDocs = [];
                foreach ($chunk as $d) {
                    $insertDocs[] = [
                        'id' => $d['id'],
                        'title' => $d['title'],
                        'filename' => $d['filename'],
                        'original_url' => $d['originalUrl'] ?? null,
                        'local_path' => $d['localPath'] ?? null,
                        'category' => $d['category'] ?? 'Other',
                        'year' => $d['year'] ?? null,
                        'extension' => $d['extension'] ?? 'pdf',
                        'file_size' => $d['fileSize'] ?? 0,
                        'sha256' => $d['sha256'] ?? null,
                        'download_status' => $d['downloadStatus'] ?? 'Downloaded',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                Document::upsert($insertDocs, ['id'], [
                    'title', 'filename', 'original_url', 'local_path', 'category',
                    'year', 'extension', 'file_size', 'sha256', 'download_status', 'updated_at'
                ]);
            }
            DB::commit();
        }

        // 7. Seed Faculty
        $facultyPath = $baseDataDir . '/faculty.json';
        if (File::exists($facultyPath)) {
            $facultyList = json_decode(File::get($facultyPath), true) ?: [];
            foreach ($facultyList as $f) {
                Faculty::updateOrCreate(
                    ['id' => $f['id']],
                    [
                        'name' => $f['name'],
                        'designation' => $f['designation'] ?? null,
                        'department' => $f['department'] ?? null,
                        'qualification' => $f['qualification'] ?? null,
                        'source_url' => $f['sourceUrl'] ?? null,
                        'source_verified' => $f['sourceVerified'] ?? true,
                        'profile' => $f['profile'] ?? null,
                        'photo_url' => $f['photoUrl'] ?? null,
                    ]
                );
            }
        }

        // 8. Seed Departments
        $deptsPath = $baseDataDir . '/departments.json';
        if (File::exists($deptsPath)) {
            $deptList = json_decode(File::get($deptsPath), true) ?: [];
            foreach ($deptList as $dept) {
                Department::updateOrCreate(
                    ['id' => $dept['id']],
                    [
                        'name' => $dept['name'],
                        'category' => $dept['category'] ?? null,
                        'head' => $dept['head'] ?? null,
                        'description' => $dept['description'] ?? null,
                        'programmes' => $dept['programmes'] ?? [],
                    ]
                );
            }
        }

        // 9. Seed Programmes (UG & PG)
        $ugPath = $baseDataDir . '/ug-programmes.json';
        if (File::exists($ugPath)) {
            $ugList = json_decode(File::get($ugPath), true) ?: [];
            foreach ($ugList as $prog) {
                Programme::updateOrCreate(
                    ['code' => $prog['code']],
                    [
                        'level' => 'ug',
                        'title' => $prog['title'],
                        'duration' => $prog['duration'] ?? null,
                        'eligibility' => $prog['eligibility'] ?? null,
                        'overview' => $prog['overview'] ?? null,
                        'departments' => $prog['departments'] ?? [],
                        'source_url' => $prog['sourceUrl'] ?? null,
                        'source_verified' => $prog['sourceVerified'] ?? true,
                    ]
                );
            }
        }

        $pgPath = $baseDataDir . '/pg-programmes.json';
        if (File::exists($pgPath)) {
            $pgList = json_decode(File::get($pgPath), true) ?: [];
            foreach ($pgList as $prog) {
                Programme::updateOrCreate(
                    ['code' => $prog['code']],
                    [
                        'level' => 'pg',
                        'title' => $prog['title'],
                        'degree' => $prog['degree'] ?? 'Postgraduate',
                        'duration' => $prog['duration'] ?? null,
                        'eligibility' => $prog['eligibility'] ?? null,
                        'overview' => $prog['overview'] ?? null,
                        'departments' => $prog['departments'] ?? [],
                        'pdf_link' => $prog['pdfLink'] ?? null,
                        'outcomes' => $prog['outcomes'] ?? null,
                        'source_url' => $prog['sourceUrl'] ?? null,
                        'source_verified' => $prog['sourceVerified'] ?? true,
                    ]
                );
            }
        }

        // 10. Seed Activity Logs
        $logsPath = $baseDataDir . '/activity-logs.json';
        if (File::exists($logsPath)) {
            $logsList = json_decode(File::get($logsPath), true) ?: [];
            foreach ($logsList as $log) {
                ActivityLog::updateOrCreate(
                    ['id' => $log['id']],
                    [
                        'user_email' => $log['user'] ?? 'admin@stphilos.ac.in',
                        'action' => $log['action'] ?? 'SYSTEM_SEED',
                        'module' => $log['module'] ?? 'System',
                        'details' => $log['details'] ?? '',
                    ]
                );
            }
        }

        // 11. Seed Settings
        $settingsPath = $baseDataDir . '/settings.json';
        if (File::exists($settingsPath)) {
            $settingsData = json_decode(File::get($settingsPath), true) ?: [];
            foreach ($settingsData as $k => $v) {
                Setting::updateOrCreate(
                    ['key' => $k],
                    ['value' => $v]
                );
            }
        }
    }
}
