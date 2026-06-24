<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unread_count_returns_only_unread_notifications_for_authenticated_user(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Notification::create([
            'user_id' => $user->id,
            'type' => 'comment',
            'title' => 'New comment',
            'message' => 'A user commented on your document.',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $user->id,
            'type' => 'follow',
            'title' => 'Followed',
            'message' => 'A user followed you.',
            'is_read' => true,
        ]);

        Notification::create([
            'user_id' => $otherUser->id,
            'type' => 'comment',
            'title' => 'Another comment',
            'message' => 'This should not count for the first user.',
            'is_read' => false,
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/notifications/unread-count');

        $response->assertOk()
            ->assertJsonPath('count', 1);
    }
}
