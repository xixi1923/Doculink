<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DocumentType;

class DocumentTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            'Past Exam',
            'Lecture Notes',
            'Summary',
            'Assignment',
            'Thesis',
            'Practice Quiz',
            'Cheat Sheet',
            'Lab Report',
            'Presentation',
            'Other'
        ];

        foreach ($types as $type) {
            DocumentType::updateOrCreate(['name' => $type]);
        }
    }
}
