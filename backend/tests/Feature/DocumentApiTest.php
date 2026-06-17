<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_upload_document()
    {
        Storage::fake('public'); // Intercept file storage

        $user = User::factory()->create();
        $category = Category::create(['name' => 'Notes', 'slug' => 'notes']);

        $file = UploadedFile::fake()->create('assignment.pdf', 500); // 500kb PDF

        $response = $this->actingAs($user)
            ->postJson('/api/documents', [
                'title' => 'My Semester 1 Notes',
                'category_id' => $category->id,
                'file' => $file,
            ]);

        $response->assertStatus(201);

        // Assert file was stored
        Storage::disk('public')->assertExists('documents/' . $file->hashName());
    }
}
