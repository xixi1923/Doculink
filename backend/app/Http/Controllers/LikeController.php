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
    public function toggleLikeDocument($id)
    {
        try {
            $userId = Auth::id();
            $document = Document::findOrFail($id);

            $like = Like::where('user_id', $userId)
                ->where('likeable_id', $id)
                ->where('likeable_type', Document::class)
                ->first();

            if ($like) {
                $like->delete();
                // $document->decrement('likes_count'); // If it has the column
                return response()->json(['liked' => false]);
            } else {
                Like::create([
                    'user_id' => $userId,
                    'likeable_id' => $id,
                    'likeable_type' => Document::class,
                ]);
                // $document->increment('likes_count'); // If it has the column

                // Notification
                if ($document->user_id && $document->user_id !== $userId) {
                    Notification::create([
                        'user_id' => $document->user_id,
                        'type' => 'document_like',
                        'title' => 'Document Liked',
                        'message' => Auth::user()->name . ' liked your paper.',
                        'related_id' => $id,
                        'related_type' => 'document'
                    ]);
                }

                return response()->json(['liked' => true, 'likes_count' => $document->likes_count]);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function toggleLikeComment($id)
    {
        try {
            $userId = Auth::id();
            $comment = Comment::findOrFail($id);

            // Assuming comments might use polymorphic likes or have their own logic
            // But based on user's current structure, comments don't seem to have a likes_count column
            // and I don't see a comments_id in likes table listing.
            // If they want to like comments, they might need a different table or polymorphic.
            // For now, let's keep it simple or stick to what's supported.

            return response()->json(['message' => 'Comment liking not implemented in this table structure'], 400);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
