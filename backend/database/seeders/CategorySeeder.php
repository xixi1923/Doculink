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
            'Lecture Notes',
            'Summaries',
            'Exam Prep',
            'Assignments',
            'Tutorials',
            'Thesis',
        ];

        foreach ($categories as $cat) {
            Category::create([
                'name' => $cat,
                'slug' => Str::slug($cat),
            ]);
        }
    }
}
