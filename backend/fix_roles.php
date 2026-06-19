<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Role;

// Ensure roles exist
$roles = ['admin', 'moderator', 'student'];
foreach ($roles as $roleName) {
    Role::findOrCreate($roleName);
}

$users = User::all();
foreach ($users as $user) {
    $targetRole = $user->role ?? 'student';
    if (!$user->hasRole($targetRole)) {
        echo "Syncing role '{$targetRole}' for user: {$user->email}\n";
        $user->syncRoles($targetRole);
    } else {
        echo "User {$user->email} already has role '{$targetRole}'\n";
    }
}

echo "Done fixing roles.\n";
