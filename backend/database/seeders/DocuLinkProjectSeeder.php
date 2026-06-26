<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Subject;
use App\Models\Major;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\EducationLevel;
use App\Models\User;
use App\Models\Category;
use App\Models\UserDocumentActivity;
use App\Models\DocumentView;
use App\Models\DocumentLike;
use App\Models\SavedDocument;
use App\Models\Like;
use App\Models\Favorite;
use Carbon\Carbon;

class DocuLinkProjectSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure Education Levels exist
        if (EducationLevel::count() == 0) {
            $levels = [
                ['category' => 'High School', 'name' => 'Grade 10'],
                ['category' => 'High School', 'name' => 'Grade 11'],
                ['category' => 'High School', 'name' => 'Grade 12'],
                ['category' => 'University', 'name' => 'Associate Degree'],
                ['category' => 'University', 'name' => 'Bachelor Degree'],
                ['category' => 'University', 'name' => 'Master Degree'],
                ['category' => 'University', 'name' => 'PhD'],
            ];
            foreach ($levels as $level) {
                EducationLevel::create($level);
            }
        }

        // 1. Document Types
        $types = ['Lecture Notes', 'Assignment', 'Past Exam', 'Lab Report', 'Research Paper', 'Presentation Slides', 'Book', 'Study Guide'];
        foreach ($types as $type) {
            DocumentType::firstOrCreate(['name' => $type]);
        }

        // 2. Departments
        $depts = [
            ['department_full_name' => 'Information Technology', 'department_short_name' => 'IT'],
            ['department_full_name' => 'Computer Science', 'department_short_name' => 'CS'],
            ['department_full_name' => 'Business Administration', 'department_short_name' => 'BA'],
            ['department_full_name' => 'Electrical Engineering', 'department_short_name' => 'EE'],
            ['department_full_name' => 'Mechanical Engineering', 'department_short_name' => 'ME'],
            ['department_full_name' => 'Civil Engineering', 'department_short_name' => 'CE'],
            ['department_full_name' => 'Psychology', 'department_short_name' => 'PSY'],
            ['department_full_name' => 'Biology', 'department_short_name' => 'BIO'],
            ['department_full_name' => 'Mathematics', 'department_short_name' => 'MATH'],
            ['department_full_name' => 'Architecture', 'department_short_name' => 'ARCH'],
        ];
        foreach ($depts as $dept) {
            Department::firstOrCreate($dept);
        }

        // 3. Subjects
        $subjectsList = [
            'Database Systems', 'Data Structures', 'Algorithms', 'Web Development', 'Operating Systems',
            'Computer Networks', 'Software Engineering', 'Machine Learning', 'Artificial Intelligence', 'Cyber Security',
            'Financial Accounting', 'Marketing Management', 'Microeconomics', 'Macroeconomics', 'Business Law',
            'Circuit Analysis', 'Digital Signal Processing', 'Thermodynamics', 'Fluid Mechanics', 'Structural Analysis'
        ];
        foreach ($subjectsList as $name) {
            Subject::firstOrCreate(['subject_name' => $name]);
        }

        // 4. Majors
        $it = Department::where('department_short_name', 'IT')->first();
        $cs = Department::where('department_short_name', 'CS')->first();
        $ba = Department::where('department_short_name', 'BA')->first();

        $majors = [
            ['major_name' => 'Software Engineering', 'department_id' => $it->id],
            ['major_name' => 'Network Engineering', 'department_id' => $it->id],
            ['major_name' => 'Cloud Computing', 'department_id' => $it->id],
            ['major_name' => 'Data Science', 'department_id' => $cs->id],
            ['major_name' => 'AI & Robotics', 'department_id' => $cs->id],
            ['major_name' => 'Cybersecurity', 'department_id' => $cs->id],
            ['major_name' => 'Marketing', 'department_id' => $ba->id],
            ['major_name' => 'Finance', 'department_id' => $ba->id],
            ['major_name' => 'Human Resources', 'department_id' => $ba->id],
        ];
        foreach ($majors as $major) {
            Major::firstOrCreate($major);
        }

        // 5. Create Sample Users
        $edu_levels = EducationLevel::all();
        $majors_all = Major::all();
        if (User::count() < 10) {
            for ($i = 1; $i <= 10; $i++) {
                User::create([
                    'name' => "Sample User $i",
                    'email' => "user$i@example.com",
                    'password' => \Hash::make('password'),
                    'role' => 'student',
                    'department_id' => Department::inRandomOrder()->first()->id,
                    'education_level_id' => $edu_levels->random()->id,
                    'major_id' => $majors_all->random()->id,
                ]);
            }
        }

        // 6. Documents (30-50)
        $users = User::all();
        $categories = Category::all();
        if ($categories->isEmpty()) {
            Category::create(['name' => 'Academic']);
            $categories = Category::all();
        }
        $subjects = Subject::all();
        $doc_types = DocumentType::all();

        for ($i = 1; $i <= 50; $i++) {
            $createdDate = Carbon::now()->subDays(rand(0, 30));
            $dept = Department::inRandomOrder()->first();
            $deptMajors = $majors_all->where('department_id', $dept->id);

            Document::create([
                'title' => "Document Title $i - " . $subjects->random()->subject_name,
                'description' => "This is a detailed description for sample document $i.",
                'file_path' => "https://example.com/docs/sample$i.pdf",
                'file_type' => 'pdf',
                'file_size' => rand(1, 10) . ' MB',
                'category_id' => $categories->random()->id,
                'document_type_id' => $doc_types->random()->id,
                'user_id' => $users->random()->id,
                'department_id' => $dept->id,
                'education_level_id' => $edu_levels->random()->id,
                'subject_id' => $subjects->random()->id,
                'major_id' => $deptMajors->isNotEmpty() ? $deptMajors->random()->id : null,
                'status' => 'approved',
                'view_count' => rand(50, 500),
                'download_count' => rand(10, 100),
                'like_count' => rand(5, 50),
                'save_count' => rand(2, 30),
                'created_at' => $createdDate,
                'updated_at' => $createdDate,
            ]);
        }

        // 7. Generate Activity Data
        $documents = Document::all();
        foreach ($documents as $doc) {
            // Random views
            for ($v = 0; $v < rand(5, 20); $v++) {
                $u = $users->random();
                DocumentView::create(['user_id' => $u->id, 'document_id' => $doc->id]);
                UserDocumentActivity::create(['user_id' => $u->id, 'document_id' => $doc->id, 'action' => 'view']);
            }
            // Random likes
            for ($l = 0; $l < rand(0, 5); $l++) {
                $u = $users->random();
                DocumentLike::create(['user_id' => $u->id, 'document_id' => $doc->id]);
                UserDocumentActivity::create(['user_id' => $u->id, 'document_id' => $doc->id, 'action' => 'like']);
                Like::updateOrCreate(
                    ['user_id' => $u->id, 'likeable_id' => $doc->id, 'likeable_type' => Document::class]
                );
            }
            // Random saves
            for ($s = 0; $s < rand(0, 3); $s++) {
                $u = $users->random();
                SavedDocument::create(['user_id' => $u->id, 'document_id' => $doc->id]);
                UserDocumentActivity::create(['user_id' => $u->id, 'document_id' => $doc->id, 'action' => 'save']);
                Favorite::updateOrCreate(
                    ['user_id' => $u->id, 'document_id' => $doc->id]
                );
            }
        }
    }
}
