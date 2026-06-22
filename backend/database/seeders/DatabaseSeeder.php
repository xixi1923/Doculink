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
            RealUniversitySeeder::class,
        ]);

        $admin = User::updateOrCreate(
            ['email' => 'admin@doculink.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        $admin->assignRole('admin');

        $this->call([
            DocumentSeeder::class,
        ]);
    }
}
