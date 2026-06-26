<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Notification;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function adminIndex()
    {
        return Comment::with(['user', 'commentable'])
            ->latest()
            ->paginate(20);
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate(['content' => 'required|string']);
            $comment = Comment::findOrFail($id);

            if ($comment->user_id !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $comment->update(['content' => $request->content]);
            return response()->json($comment);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $comment = Comment::findOrFail($id);

            if ($comment->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $comment->delete();
            return response()->json(['message' => 'Comment deleted']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function reply(Request $request, $id)
    {
        try {
            $request->validate(['content' => 'required|string']);
            $parent = Comment::findOrFail($id);

            $reply = Comment::create([
                'user_id' => Auth::id(),
                'content' => $request->content,
                'parent_id' => $id,
                'commentable_id' => $parent->commentable_id,
                'commentable_type' => $parent->commentable_type,
            ]);

            // Notification for parent comment owner
            if ($parent->user_id !== Auth::id()) {
                Notification::create([
                    'user_id' => $parent->user_id,
                    'type' => 'comment_reply',
                    'title' => 'New Reply',
                    'message' => Auth::user()->name . ' replied to your comment.',
                    'related_id' => $parent->commentable_id,
                    'related_type' => 'document'
                ]);
            }

            return response()->json($reply->load('user'));
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'trace' => $e->getTrace()
            ], 500);
        }
    }
}
