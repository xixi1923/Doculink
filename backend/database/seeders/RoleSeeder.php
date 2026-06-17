<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'manage documents']);
        Permission::create(['name' => 'manage categories']);
        Permission::create(['name' => 'view dashboard']);

        // Create roles and assign created permissions
        $roleAdmin = Role::create(['name' => 'admin']);
        $roleAdmin->givePermissionTo(Permission::all());

        $roleModerator = Role::create(['name' => 'moderator']);
        $roleModerator->givePermissionTo(['manage documents', 'manage categories', 'view dashboard']);

        $roleStudent = Role::create(['name' => 'student']);
    }
}
