<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Document;
use App\Models\User;
use App\Models\Category;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        $category = Category::first();

        if ($user && $category) {
            Document::create([
                'title' => 'Sample Math Notes',
                'description' => 'A set of comprehensive math notes for Grade 12.',
                'category_id' => $category->id,
                'user_id' => $user->id,
                'file_path' => 'documents/sample.pdf',
                'file_type' => 'pdf',
                'status' => 'pending',
                'school' => 'Bak Touk High School',
            ]);
        }
    }
}
