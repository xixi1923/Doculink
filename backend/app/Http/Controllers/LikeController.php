<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Document;
use App\Models\Comment;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    public function toggleLike(Request $request)
    {
        try {
            $request->validate([
                'likeable_id' => 'required|integer',
                'likeable_type' => 'required|string|in:document,comment',
            ]);

            $userId = Auth::id();
            $type = $request->likeable_type === 'document' ? Document::class : Comment::class;
            $likeableId = $request->likeable_id;

            return $this->handleToggleLike($type, $likeableId, $request->likeable_type);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function toggleLikeDocument($id)
    {
        try {
            return $this->handleToggleLike(Document::class, $id, 'document');
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function toggleLikeComment($id)
    {
        try {
            return $this->handleToggleLike(Comment::class, $id, 'comment');
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    private function handleToggleLike($type, $id, $typeStringShort)
    {
        $userId = Auth::id();
        $likeable = $type::findOrFail($id);

        $like = Like::where('user_id', $userId)
            ->where('likeable_id', $id)
            ->where('likeable_type', $type)
            ->first();

        if ($like) {
            $like->delete();
            return response()->json(['liked' => false]);
        } else {
            Like::create([
                'user_id' => $userId,
                'likeable_id' => $id,
                'likeable_type' => $type,
            ]);

            // Notification
            $ownerId = $likeable->user_id;
            if ($ownerId !== $userId) {
                $typeString = $typeStringShort === 'document' ? 'document_like' : 'comment_like';
                $title = $typeStringShort === 'document' ? 'Document Liked' : 'Comment Liked';
                $message = Auth::user()->name . ($typeStringShort === 'document' ? ' liked your paper.' : ' liked your comment.');

                Notification::create([
                    'user_id' => $ownerId,
                    'type' => $typeString,
                    'title' => $title,
                    'message' => $message,
                    'related_id' => $typeStringShort === 'document' ? $id : $likeable->commentable_id,
                    'related_type' => 'document'
                ]);
            }

            return response()->json(['liked' => true]);
        }
    }
}
