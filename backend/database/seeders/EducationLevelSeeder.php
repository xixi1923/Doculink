<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EducationLevel;

class EducationLevelSeeder extends Seeder
{
    public function run(): void
    {
        $levels = [
            // High School Levels
            ['category' => 'High School', 'name' => 'Grade 7'],
            ['category' => 'High School', 'name' => 'Grade 8'],
            ['category' => 'High School', 'name' => 'Grade 9'],
            ['category' => 'High School', 'name' => 'Grade 10'],
            ['category' => 'High School', 'name' => 'Grade 11'],
            ['category' => 'High School', 'name' => 'Grade 12'],

            // University Levels
            ['category' => 'University', 'name' => 'Associate Degree'],
            ['category' => 'University', 'name' => 'Bachelor Degree'],
            ['category' => 'University', 'name' => 'Master Degree'],
            ['category' => 'University', 'name' => 'PhD'],
        ];

        foreach ($levels as $level) {
            EducationLevel::updateOrCreate(
                ['category' => $level['category'], 'name' => $level['name']],
                $level
            );
        }
    }
}
