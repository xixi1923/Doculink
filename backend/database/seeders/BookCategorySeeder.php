<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BookCategory;
use Illuminate\Support\Str;

class BookCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
            'Computer Science', 'Economics', 'Accounting', 'Law', 'Medicine'
        ];

        foreach ($categories as $cat) {
            BookCategory::updateOrCreate(
                ['slug' => Str::slug($cat)],
                ['name' => $cat]
            );
        }
    }
}
