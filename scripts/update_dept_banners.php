<?php

require __DIR__ . '/../backend/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Department;

$updated = 0;
foreach (Department::all() as $d) {
    $cleanId = str_replace('_', '-', $d->id);
    if (!str_starts_with($cleanId, 'dept-')) {
        $cleanId = 'dept-' . $cleanId;
    }
    
    // Check if department folder banner exists
    $bannerPath = '/assets/departments/' . $cleanId . '/images/banner.jpg';
    $localFile = __DIR__ . '/../public' . $bannerPath;
    
    if (file_exists($localFile)) {
        if ($d->banner_image !== $bannerPath) {
            $d->banner_image = $bannerPath;
            $d->save();
            $updated++;
        }
    }
}

echo "Successfully updated banner_image for {$updated} departments in database.\n";
