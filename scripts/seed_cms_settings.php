<?php
require __DIR__ . '/../backend/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Setting;

echo "Seeding initial CMS configuration into settings table..." . PHP_EOL;

// 1. Leadership
$aboutJsonPath = __DIR__ . '/../src/data/aboutData.json';
if (file_exists($aboutJsonPath)) {
    $aboutData = json_decode(file_get_contents($aboutJsonPath), true);
    if (!empty($aboutData['administration'])) {
        $leadership = array_map(function ($l, $idx) {
            return array_merge($l, [
                'order' => $l['order'] ?? ($idx + 1),
                'status' => $l['status'] ?? 'published',
                'objectPosition' => $l['objectPosition'] ?? '50% 15%',
                'assetPath' => $l['assetPath'] ?? $l['imageUrl'] ?? '/assets/images/campus/intro_heritage_building.jpg',
                'imageUrl' => $l['assetPath'] ?? $l['imageUrl'] ?? '/assets/images/campus/intro_heritage_building.jpg',
            ]);
        }, $aboutData['administration'], array_keys($aboutData['administration']));

        Setting::updateOrCreate(['key' => 'leadership'], ['value' => $leadership]);
        echo "✓ Seeded leadership (" . count($leadership) . " members)" . PHP_EOL;
    }
}

// 2. Pages
$pagesJsonPath = __DIR__ . '/../src/data/masterPagesData.json';
if (file_exists($pagesJsonPath)) {
    $pagesData = json_decode(file_get_contents($pagesJsonPath), true);
    if (!empty($pagesData)) {
        Setting::updateOrCreate(['key' => 'pages'], ['value' => $pagesData]);
        echo "✓ Seeded master pages (" . count($pagesData) . " pages)" . PHP_EOL;
    }
}

// 3. Header Config
$headerConfig = [
    'topBar' => [
        'enabled' => true,
        'announcementText' => "Admissions Open for Academic Year 2026–27 | UGC Autonomous Catholic College",
        'announcementLink' => "/admissions",
        'phone' => "+91 9008580707, 9008028258",
        'showPhone' => true,
        'showContactDesk' => true,
        'contactDeskLabel' => "Contact Desk",
        'contactDeskLink' => "/contact",
        'showSearch' => true,
    ],
    'branding' => [
        'logoUrl' => "/assets/images/logo/official_college_banner_logo_transparent.png",
        'fallbackLogoUrl' => "/assets/images/logo/official_college_banner_logo.png",
        'altText' => "St. Philomena's College (Autonomous), Mysuru",
        'homeLink' => "/",
    ],
    'ctaButton' => [
        'enabled' => true,
        'label' => "Apply Online 2026–27",
        'url' => "https://student.stphiloserp.in/",
        'target' => "_blank",
    ],
    'navItems' => [
        ['label' => 'HOME', 'path' => '/'],
        ['label' => 'ABOUT US', 'path' => '/about', 'megaKey' => 'about'],
        ['label' => 'ACADEMICS', 'path' => '/academics', 'megaKey' => 'academics'],
        ['label' => 'EXAMINATION', 'path' => '/examinations', 'megaKey' => 'examinations'],
        ['label' => 'RESOURCE', 'path' => '/resources', 'megaKey' => 'research'],
        ['label' => 'STUDENT SUPPORT', 'path' => '/student-support', 'megaKey' => 'studentSupport'],
        ['label' => 'MANDATORY DISCLOSURE', 'path' => '/compliance', 'megaKey' => 'compliance'],
        ['label' => 'IQAC', 'path' => '/iqac', 'megaKey' => 'iqac'],
        ['label' => 'ALUMNI', 'path' => '/alumni'],
        ['label' => 'CONTACT US', 'path' => '/contact'],
    ],
];
Setting::updateOrCreate(['key' => 'headerConfig'], ['value' => $headerConfig]);
echo "✓ Seeded headerConfig" . PHP_EOL;

// 4. Footer Config
$footerConfig = [
    'brand' => [
        'crestUrl' => "/assets/images/logo/crest_gold_hd.png",
        'fallbackCrestUrl' => "/assets/images/logo/crest_white_hd.png",
        'title' => "St. Philomena's College",
        'subtitle' => "(Autonomous), Mysuru · Est. 1946",
        'description' => "Affiliated to the University of Mysore. A premier UGC Autonomous Catholic institution managed by the Mysore Diocesan Educational Society (MDES). Re-accredited by NAAC with Cycle III B++ Grade (2020).",
    ],
    'columns' => [
        [
            'title' => "Academics",
            'links' => [
                ['label' => "UG Programmes (B.Sc, BCA, B.Com, BBA, BA, BSW, B.Voc)", 'path' => "/academics"],
                ['label' => "PG Programmes (M.Sc, M.Com, MA, MSW, MCA, MBA)", 'path' => "/academics"],
                ['label' => "Academic Departments", 'path' => "/departments"],
                ['label' => "Searchable Faculty Directory", 'path' => "/faculty"],
                ['label' => "Central Library & Syllabus", 'path' => "/resources"],
            ],
        ],
        [
            'title' => "Examinations",
            'links' => [
                ['label' => "Autonomous Exam Timetables", 'path' => "/examinations"],
                ['label' => "End-Semester Results Portal", 'path' => "/examinations"],
                ['label' => "Revaluation & Photocopy Forms", 'path' => "/examinations"],
                ['label' => "Prospectus & Admissions 2026–27", 'path' => "/admissions"],
            ],
        ],
        [
            'title' => "Mandatory Disclosure",
            'links' => [
                ['label' => "UGC & AICTE Disclosures", 'path' => "/compliance"],
                ['label' => "IQAC Quality Benchmarks", 'path' => "/iqac"],
                ['label' => "Statutory Governing Bodies", 'path' => "/compliance"],
                ['label' => "Student Grievance Committee", 'path' => "/compliance"],
                ['label' => "RTI & Institutional Desk", 'path' => "/contact"],
            ],
        ],
    ],
    'bottomBar' => [
        'copyrightText' => "St. Philomena's College (Autonomous), Mysuru. All Rights Reserved.",
        'links' => [
            ['label' => "About MDES", 'path' => "/about"],
            ['label' => "Privacy & Terms", 'path' => "/compliance"],
            ['label' => "Contact Support", 'path' => "/contact"],
            ['label' => "CMS Portal", 'path' => "/admin/login"],
        ],
    ],
    'socialLinks' => [
        'facebook' => "https://facebook.com",
        'twitter' => "https://twitter.com",
        'instagram' => "https://instagram.com",
        'youtube' => "https://youtube.com",
        'linkedin' => "https://linkedin.com",
    ],
];
Setting::updateOrCreate(['key' => 'footerConfig'], ['value' => $footerConfig]);
echo "✓ Seeded footerConfig" . PHP_EOL;

echo "Seeding completed successfully!" . PHP_EOL;
