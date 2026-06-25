<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;

$tables = ['likes', 'users', 'books', 'documents'];
foreach ($tables as $table) {
    if (Schema::hasTable($table)) {
        echo "Table: $table\n";
        echo "Columns: " . implode(', ', Schema::getColumnListing($table)) . "\n\n";
    } else {
        echo "Table: $table NOT FOUND\n\n";
    }
}
