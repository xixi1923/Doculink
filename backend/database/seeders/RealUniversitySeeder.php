<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;
use Illuminate\Support\Str;

class RealUniversitySeeder extends Seeder
{
    public function run(): void
    {
        $universities = [
            [
                'name' => 'Royal University of Phnom Penh',
                'short_name' => 'RUPP',
                'location' => 'PHNOM PENH',
                'description' => 'The oldest and largest public university in Cambodia.',
                'cover_image' => 'https://images.unsplash.com/photo-1541339907198-e08756c83f2d?auto=format&fit=crop&q=80&w=1000',
                'website' => 'https://www.rupp.edu.kh'
            ],
            [
                'name' => 'Institute of Technology of Cambodia',
                'short_name' => 'ITC',
                'location' => 'PHNOM PENH',
                'description' => 'A higher education institution in Cambodia that trains students in science, technology and engineering.',
                'cover_image' => 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000',
                'website' => 'https://www.itc.edu.kh'
            ],
            [
                'name' => 'American University of Phnom Penh',
                'short_name' => 'AUPP',
                'location' => 'PHNOM PENH',
                'description' => 'Providing high quality American style education in Cambodia.',
                'cover_image' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000',
                'website' => 'https://www.aupp.edu.kh'
            ]
        ];

        foreach ($universities as $uni) {
            University::updateOrCreate(['short_name' => $uni['short_name']], $uni);
        }
    }
}
