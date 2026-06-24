<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class FirebaseAuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_firebase_login_creates_user_and_returns_token_when_student_role_is_missing(): void
    {
        Role::query()->where('name', 'student')->delete();

        $response = $this->postJson('/api/firebase-login', [
            'email' => 'firebase-user@example.com',
            'name' => 'Firebase User',
            'uid' => 'firebase-uid-123',
            'avatar' => 'https://example.com/avatar.png',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['user' => ['id', 'email', 'name'], 'token']);

        $this->assertDatabaseHas('users', ['email' => 'firebase-user@example.com']);
        $this->assertTrue(User::where('email', 'firebase-user@example.com')->exists());
    }
}
