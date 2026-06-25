<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Mathematics',
            'Physics',
            'Chemistry',
            'Biology',
            'Programming',
            'Computer Science',
            'Business',
            'Economics',
            'English',
            'Law',
            'Medical',
            'Lecture Notes',
            'Summaries',
            'Exam Prep',
            'Assignments',
            'Thesis',
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['slug' => Str::slug($cat)],
                ['name' => $cat]
            );
        }
    }
}
