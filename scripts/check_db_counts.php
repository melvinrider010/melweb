<?php
require __DIR__ . '/../backend/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tables = ['users', 'departments', 'faculty', 'programmes', 'events', 'sub_events', 'notices', 'sliders', 'media', 'documents', 'settings', 'organograms', 'organogram_versions', 'organogram_nodes'];

foreach ($tables as $table) {
    try {
        $count = \Illuminate\Support\Facades\DB::table($table)->count();
        echo str_pad($table, 22) . ": " . $count . PHP_EOL;
    } catch (\Exception $e) {
        echo str_pad($table, 22) . ": ERROR (" . $e->getMessage() . ")" . PHP_EOL;
    }
}
