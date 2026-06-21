<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DocuLinkSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Categories
        $categories = [
            ['name' => 'Programming', 'slug' => 'programming', 'description' => 'Software development and algorithms', 'icon' => '💻'],
            ['name' => 'Mathematics', 'slug' => 'mathematics', 'description' => 'Calculus, Algebra, and Statistics', 'icon' => '🔢'],
            ['name' => 'Business', 'slug' => 'business', 'description' => 'Marketing, Finance, and Management', 'icon' => '💼'],
            ['name' => 'Engineering', 'slug' => 'engineering', 'description' => 'Civil, Electrical, and Mechanical', 'icon' => '🏗️'],
            ['name' => 'English', 'slug' => 'english', 'description' => 'Literature and Language skills', 'icon' => '📖'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 2. Universities
        $universities = [
            [
                'name' => 'Royal University of Phnom Penh',
                'short_name' => 'RUPP',
                'location' => 'PHNOM PENH',
                'description' => 'The oldest and largest public university in Cambodia.',
                'website' => 'https://www.rupp.edu.kh',
                'logo' => 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=200',
                'cover_image' => 'https://images.unsplash.com/photo-1541339907198-e08756c83f2d?auto=format&fit=crop&q=80&w=1000'
            ],
            [
                'name' => 'Institute of Technology of Cambodia',
                'short_name' => 'ITC',
                'location' => 'PHNOM PENH',
                'description' => 'A higher education institution in Cambodia for science and engineering.',
                'website' => 'https://www.itc.edu.kh',
                'logo' => 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=200',
                'cover_image' => 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000'
            ],
            [
                'name' => 'American University of Phnom Penh',
                'short_name' => 'AUPP',
                'location' => 'PHNOM PENH',
                'description' => 'Providing high quality American style education in Cambodia.',
                'website' => 'https://www.aupp.edu.kh',
                'logo' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=200',
                'cover_image' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000'
            ]
        ];

        foreach ($universities as $uni) {
            University::updateOrCreate(['short_name' => $uni['short_name']], $uni);
        }

        // 3. Admin User
        User::updateOrCreate(
            ['email' => 'admin@doculink.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active'
            ]
        );
    }
}
