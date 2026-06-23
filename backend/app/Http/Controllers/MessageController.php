<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use App\Models\User;
use App\Models\MessageRead;
use App\Models\MessageAttachment;
use App\Models\Notification;
use App\Models\UserBlock;
use App\Models\TypingIndicator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public function getConversations()
    {
        try {
            $user = Auth::user();

            $conversations = Conversation::whereHas('participants', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['participants.user', 'lastMessage.attachments'])
            ->withCount(['messages as unread_count' => function ($query) use ($user) {
                $query->where('sender_id', '!=', $user->id)
                      ->whereDoesntHave('reads', function ($q) use ($user) {
                          $q->where('user_id', $user->id);
                      });
            }])
            ->get()
            ->map(function ($conversation) use ($user) {
                $otherParticipant = $conversation->participants->where('user_id', '!=', $user->id)->first();
                $otherUser = $otherParticipant ? $otherParticipant->user : null;
                $lastMessage = $conversation->lastMessage;

                // Determine last activity time (for timeout-based offline status)
                $lastActivityTime = $lastMessage?->created_at?->getTimestamp() * 1000; // milliseconds

                // Determine online status based on timeout (3 minutes)
                $isOnline = $lastActivityTime ? (time() * 1000 - $lastActivityTime) < (3 * 60 * 1000) : false;

                return [
                    'id' => $conversation->id,
                    'other_user' => $otherUser ? [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'avatar' => $otherUser->avatar,
                        'status' => $isOnline ? 'online' : 'offline',
                        'last_activity' => $lastActivityTime,
                    ] : null,
                    'last_message' => $lastMessage ? [
                        'text' => $lastMessage->message,
                        'time' => $lastMessage->created_at->diffForHumans(),
                        'created_at' => $lastMessage->created_at,
                    ] : null,
                    'unread_count' => $conversation->unread_count,
                ];
            })
            ->values()
            ->sortByDesc(function($conversation) {
                return $conversation['last_message'] ? $conversation['last_message']['created_at']->timestamp : 0;
            })
            ->values();

            return response()->json($conversations);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'trace' => $e->getTrace()
            ], 500);
        }
    }

    public function searchUsers(Request $request)
    {
        $query = $request->get('q');
        if (empty($query)) return response()->json([]);

        $users = User::where('id', '!=', Auth::id())
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('email', 'LIKE', "%{$query}%");
            })
            ->limit(10)
            ->get(['id', 'name', 'avatar', 'email']);

        return response()->json($users);
    }

    public function startConversation(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $otherUserId = $request->user_id;
        $myId = Auth::id();

        if ($otherUserId == $myId) {
            return response()->json(['error' => 'You cannot message yourself'], 400);
        }

        // Find existing conversation between these two users
        $conversation = Conversation::whereHas('participants', function ($query) use ($myId) {
            $query->where('user_id', $myId);
        })->whereHas('participants', function ($query) use ($otherUserId) {
            $query->where('user_id', $otherUserId);
        })->first();

        if (!$conversation) {
            DB::transaction(function () use (&$conversation, $myId, $otherUserId) {
                $conversation = Conversation::create();
                ConversationParticipant::create([
                    'conversation_id' => $conversation->id,
                    'user_id' => $myId,
                ]);
                ConversationParticipant::create([
                    'conversation_id' => $conversation->id,
                    'user_id' => $otherUserId,
                ]);
            });
        }

        return response()->json([
            'id' => $conversation->id,
        ]);
    }

    public function getMessages($conversationId)
    {
        $user = Auth::user();
        $conversation = Conversation::findOrFail($conversationId);

        // Check if user is a participant
        if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = $conversation->messages()
            ->with([
                'sender:id,name,avatar',
                'attachments' => function ($query) {
                    $query->select('id', 'message_id', 'file_path', 'file_name', 'file_type', 'file_size', 'created_at');
                }
            ])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                // Transform attachments to include URLs
                return $this->formatMessage($message);
            });

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'message' => 'required|string',
        ]);

        $user = Auth::user();
        $conversationId = $request->conversation_id;
        $conversation = Conversation::findOrFail($conversationId);

        // Check if user is participant
        if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if conversation is ended
        if ($conversation->isEnded()) {
            return response()->json(['error' => 'Conversation is ended and read-only'], 403);
        }

        $otherParticipant = ConversationParticipant::where('conversation_id', $conversationId)->where('user_id', '!=', $user->id)->first();

        if (!$otherParticipant) {
            return response()->json(['error' => 'Recipient not found'], 404);
        }

        // Check if blocked
        if ($otherParticipant->user->hasBlocked($user->id)) {
            return response()->json(['error' => 'You cannot send messages to this user'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $user->id,
            'message' => $request->message,
            'receiver_id' => $otherParticipant->user_id,
        ]);

        // Create Notification
        try {
            Notification::create([
                'user_id' => $otherParticipant->user_id,
                'type' => 'message',
                'title' => 'New Message',
                'message' => $user->name . ' sent you a message.',
                'related_id' => $conversationId,
                'related_type' => 'conversation'
            ]);
        } catch (\Exception $e) {
            Log::warning('Notification failed: ' . $e->getMessage());
        }

        $message = $message->load('sender:id,name,avatar', 'attachments');
        return response()->json($this->formatMessage($message), 201);
    }

    public function sendMessageWithAttachments(Request $request, $conversationId)
    {
        try {
            // Validate inputs
            $validated = $request->validate([
                'message' => 'nullable|string|max:5000',
                'attachments' => 'nullable|array|max:5',
                'attachments.*' => 'nullable|file|max:51200', // 50MB max per file
            ], [], [
                'attachments.*' => 'file'
            ]);

            $user = Auth::user();
            $conversation = Conversation::findOrFail($conversationId);

            // Check if user is participant
            if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Check if conversation is ended
            if ($conversation->isEnded()) {
                return response()->json(['error' => 'Conversation is ended and read-only'], 403);
            }

            $messageText = $validated['message'] ?? '';

            // Validate that at least message or attachments exist
            if (empty(trim($messageText)) && !$request->hasFile('attachments')) {
                return response()->json(['error' => 'Message or attachments required'], 400);
            }

            $otherParticipant = ConversationParticipant::where('conversation_id', $conversationId)->where('user_id', '!=', $user->id)->first();

            if (!$otherParticipant) {
                return response()->json(['error' => 'Conversation participant not found'], 404);
            }

            // Check if blocked
            if ($otherParticipant->user->hasBlocked($user->id)) {
                return response()->json(['error' => 'You cannot send messages to this user'], 403);
            }

            // Create message
            $message = Message::create([
                'conversation_id' => $conversationId,
                'sender_id' => $user->id,
                'message' => trim($messageText),
                'receiver_id' => $otherParticipant->user_id,
            ]);

            // Handle file uploads
            if ($request->hasFile('attachments')) {
                $files = $request->file('attachments');
                if (!is_array($files)) {
                    $files = [$files];
                }

                foreach ($files as $file) {
                    if ($file && $file->isValid()) {
                        try {
                            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                            $path = $file->storeAs('messages', $filename, 'public');

                            if ($path) {
                                // Store attachment metadata
                                MessageAttachment::create([
                                    'message_id' => $message->id,
                                    'file_path' => $path,
                                    'file_name' => $file->getClientOriginalName(),
                                    'file_type' => $file->getMimeType(),
                                    'file_size' => $file->getSize(),
                                ]);
                            }
                        } catch (\Exception $e) {
                            Log::error('File upload error: ' . $e->getMessage());
                        }
                    }
                }
            }

            // Create Notification
            try {
                Notification::create([
                    'user_id' => $otherParticipant->user_id,
                    'type' => 'message',
                    'title' => 'New Message',
                    'message' => $user->name . ' sent you a message' . ($request->hasFile('attachments') ? ' with attachment(s)' : '') . '.',
                    'related_id' => $conversationId,
                    'related_type' => 'conversation'
                ]);
            } catch (\Exception $e) {
                Log::warning('Notification creation failed: ' . $e->getMessage());
            }

            // Load and return message with attachments
            $message = $message->load(['sender:id,name,avatar', 'attachments']);
            return response()->json($this->formatMessage($message), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Send message error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send message', 'message' => $e->getMessage()], 500);
        }
    }


    public function unreadCount()
    {
        $user = Auth::user();
        $count = Message::whereHas('conversation.participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->where('sender_id', '!=', $user->id)
        ->whereDoesntHave('reads', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->count();

        return response()->json(['count' => $count]);
    }

    public function markAsRead(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
        ]);

        $user = Auth::user();
        $conversationId = $request->conversation_id;

        $unreadMessages = Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $user->id)
            ->whereDoesntHave('reads', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();

        foreach ($unreadMessages as $message) {
            MessageRead::create([
                'message_id' => $message->id,
                'user_id' => $user->id,
            ]);
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Format message with proper attachment URLs and metadata
     */
    private function formatMessage($message)
    {
        $formattedMessage = $message->toArray();

        // Add type
        $formattedMessage['type'] = $message->type;

        // Format attachments with URLs
        if ($message->attachments && count($message->attachments) > 0) {
            $formattedMessage['attachments'] = $message->attachments->map(function ($attachment) {
                return [
                    'id' => $attachment->id,
                    'file_name' => $attachment->file_name,
                    'file_type' => $attachment->file_type,
                    'file_size' => $attachment->file_size,
                    'file_path' => $attachment->file_path,
                    'file_url' => $attachment->file_url,
                    'thumbnail_url' => $attachment->thumbnail_url,
                    'display_type' => $attachment->display_type,
                    'created_at' => $attachment->created_at,
                ];
            })->toArray();

            // Provide top-level access for primary attachment (requested by frontend)
            if ($message->type !== 'text') {
                $first = $message->attachments->first();
                $formattedMessage['file_url'] = $first->file_url;
                $formattedMessage['thumbnail_url'] = $first->thumbnail_url;
                $formattedMessage['file_name'] = $first->file_name;
            }
        }

        return $formattedMessage;
    }


    /**
     * Delete conversation
     */
    public function deleteConversation($conversationId)
    {
        $user = Auth::user();
        $conversation = Conversation::findOrFail($conversationId);

        // Check if user is a participant
        if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Soft delete the conversation
        $conversation->delete();

        return response()->json(['status' => 'success', 'message' => 'Conversation deleted']);
    }

    /**
     * End conversation (make it read-only)
     */
    public function endConversation($conversationId)
    {
        $user = Auth::user();
        $conversation = Conversation::findOrFail($conversationId);

        // Check if user is a participant
        if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $conversation->end();

        return response()->json([
            'status' => 'success',
            'message' => 'Conversation ended',
            'conversation' => [
                'id' => $conversation->id,
                'status' => $conversation->status,
                'ended_at' => $conversation->ended_at,
            ]
        ]);
    }

    /**
     * Reopen ended conversation
     */
    public function reopenConversation($conversationId)
    {
        $user = Auth::user();
        $conversation = Conversation::findOrFail($conversationId);

        // Check if user is a participant
        if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($conversation->status !== 'ended') {
            return response()->json(['error' => 'Conversation is not ended'], 400);
        }

        $conversation->reopen();

        return response()->json([
            'status' => 'success',
            'message' => 'Conversation reopened',
            'conversation' => [
                'id' => $conversation->id,
                'status' => $conversation->status,
            ]
        ]);
    }

    /**
     * Block a user
     */
    public function blockUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'reason' => 'nullable|string|max:500',
        ]);

        $blocker = Auth::user();
        $blockedUserId = $request->user_id;

        if ($blocker->id == $blockedUserId) {
            return response()->json(['error' => 'You cannot block yourself'], 400);
        }

        // Check if already blocked
        if ($blocker->hasBlocked($blockedUserId)) {
            return response()->json(['error' => 'User is already blocked'], 400);
        }

        try {
            UserBlock::create([
                'blocker_id' => $blocker->id,
                'blocked_id' => $blockedUserId,
                'reason' => $request->reason,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'User blocked successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Block user error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to block user'], 500);
        }
    }

    /**
     * Unblock a user
     */
    public function unblockUser($userId)
    {
        $blocker = Auth::user();

        $block = UserBlock::where('blocker_id', $blocker->id)
            ->where('blocked_id', $userId)
            ->first();

        if (!$block) {
            return response()->json(['error' => 'User is not blocked'], 400);
        }

        $block->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User unblocked successfully'
        ]);
    }

    /**
     * Get blocked users list
     */
    public function getBlockedUsers()
    {
        $user = Auth::user();

        $blockedUsers = UserBlock::where('blocker_id', $user->id)
            ->with('blocked:id,name,avatar,email')
            ->get()
            ->map(function ($block) {
                return [
                    'id' => $block->blocked->id,
                    'name' => $block->blocked->name,
                    'avatar' => $block->blocked->avatar,
                    'email' => $block->blocked->email,
                    'blocked_at' => $block->created_at,
                    'reason' => $block->reason,
                ];
            });

        return response()->json($blockedUsers);
    }

    /**
     * Start or update typing indicator
     */
    public function setTypingIndicator(Request $request, $conversationId)
    {
        $request->validate([
            'is_typing' => 'required|boolean',
        ]);

        $user = Auth::user();
        $conversation = Conversation::findOrFail($conversationId);

        // Check if user is a participant
        if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($request->is_typing) {
            // Update or create typing indicator
            TypingIndicator::updateOrCreate(
                [
                    'conversation_id' => $conversationId,
                    'user_id' => $user->id,
                ],
                [
                    'typing_at' => now(),
                ]
            );
        } else {
            // Remove typing indicator
            TypingIndicator::where('conversation_id', $conversationId)
                ->where('user_id', $user->id)
                ->delete();
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Get current typing indicators in conversation
     */
    public function getTypingIndicators($conversationId)
    {
        $user = Auth::user();
        $conversation = Conversation::findOrFail($conversationId);

        // Check if user is a participant
        if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Get typing indicators from the last 5 seconds
        $typingUsers = TypingIndicator::where('conversation_id', $conversationId)
            ->where('user_id', '!=', $user->id)
            ->where('typing_at', '>', now()->subSeconds(5))
            ->with('user:id,name,avatar')
            ->get()
            ->map(function ($indicator) {
                return [
                    'user_id' => $indicator->user->id,
                    'name' => $indicator->user->name,
                    'avatar' => $indicator->user->avatar,
                ];
            });

        return response()->json($typingUsers);
    }

    /**
     * Download message attachment
     */
    public function downloadAttachment($attachmentId)
    {
        $user = Auth::user();
        $attachment = MessageAttachment::with('message.conversation.participants')->findOrFail($attachmentId);

        // Check if user is a participant in the conversation
        $isParticipant = $attachment->message->conversation->participants
            ->where('user_id', $user->id)
            ->isNotEmpty();

        if (!$isParticipant) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!Storage::disk('public')->exists($attachment->file_path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return Storage::disk('public')->download($attachment->file_path, $attachment->file_name);
    }
}
