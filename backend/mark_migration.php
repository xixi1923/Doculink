<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$migration = '2026_06_25_054132_convert_likes_to_polymorphic';

if (!DB::table('migrations')->where('migration', $migration)->exists()) {
    $batch = DB::table('migrations')->max('batch') + 1;
    DB::table('migrations')->insert([
        'migration' => $migration,
        'batch' => $batch
    ]);
    echo "Migration $migration marked as run.\n";
} else {
    echo "Migration $migration already exists in migrations table.\n";
}
