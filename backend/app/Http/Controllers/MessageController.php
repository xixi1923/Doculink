<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function getChats(Request $request)
    {
        $userId = $request->user()->id;

        // Get unique users who have exchanged messages with current user
        $chats = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($message) use ($userId) {
                return $message->sender_id == $userId ? $message->receiver_id : $message->sender_id;
            })
            ->map(function ($messages, $otherUserId) use ($userId) {
                $lastMessage = $messages->first();
                $otherUser = $lastMessage->sender_id == $userId ? $lastMessage->receiver : $lastMessage->sender;

                return [
                    'id' => $otherUser->id,
                    'user' => [
                        'name' => $otherUser->name,
                        'avatar' => $otherUser->avatar,
                        'status' => 'online', // Placeholder
                    ],
                    'lastMessage' => $lastMessage->message,
                    'time' => $lastMessage->created_at->diffForHumans(),
                    'unreadCount' => $messages->where('receiver_id', $userId)->whereNull('read_at')->count(),
                ];
            })
            ->values();

        return response()->json($chats);
    }

    public function getMessages(Request $request, $otherUserId)
    {
        $userId = $request->user()->id;

        $messages = Message::where(function ($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $userId)->where('receiver_id', $otherUserId);
        })->orWhere(function ($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $otherUserId)->where('receiver_id', $userId);
        })->orderBy('created_at', 'asc')->get();

        // Mark as read
        Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        return response()->json($message);
    }
}
