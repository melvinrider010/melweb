<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::all(['id', 'name', 'email', 'role', 'created_at']);
echo json_encode($users, JSON_PRETTY_PRINT) . PHP_EOL;
