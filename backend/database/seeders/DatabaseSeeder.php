<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CategorySeeder::class,
            BookCategorySeeder::class,
        ]);

        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@doculink.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $admin->assignRole('admin');

        $this->call([
            DocumentSeeder::class,
        ]);
    }
}
