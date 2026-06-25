<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Document;
use App\Models\Book;
use App\Models\Favorite;
use App\Models\Like;
use App\Models\Notification;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SocialController extends Controller
{
    public function toggleFavorite(Request $request)
    {
        $request->validate([
            'document_id' => 'nullable|exists:documents,id',
            'book_id' => 'nullable|exists:books,id',
        ]);

        $userId = Auth::id();
        $docId = $request->document_id;
        $bookId = $request->book_id;

        if (!$docId && !$bookId) {
            return response()->json(['message' => 'Specify either document_id or book_id'], 400);
        }

        $query = Favorite::where('user_id', $userId);
        if ($docId) $query->where('document_id', $docId);
        else $query->where('book_id', $bookId);

        $favorite = $query->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['favorited' => false]);
        } else {
            Favorite::create([
                'user_id' => $userId,
                'document_id' => $docId,
                'book_id' => $bookId,
            ]);
            return response()->json(['favorited' => true]);
        }
    }

    public function toggleLike(Request $request)
    {
        $request->validate([
            'document_id' => 'nullable|exists:documents,id',
            'book_id' => 'nullable|exists:books,id',
        ]);

        $userId = Auth::id();
        $docId = $request->document_id;
        $bookId = $request->book_id;

        if (!$docId && !$bookId) {
            return response()->json(['message' => 'Specify either document_id or book_id'], 400);
        }

        $query = Like::where('user_id', $userId);
        if ($docId) {
            $query->where('likeable_id', $docId)->where('likeable_type', Document::class);
        } else {
            $query->where('likeable_id', $bookId)->where('likeable_type', Book::class);
        }

        $like = $query->first();

        if ($like) {
            $like->delete();
            // Optional: decrement likes_count if columns exist
            // if ($docId) Document::find($docId)?->decrement('likes_count');
            // else Book::find($bookId)?->decrement('likes_count');
            return response()->json(['liked' => false]);
        } else {
            Like::create([
                'user_id' => $userId,
                'likeable_id' => $docId ?: $bookId,
                'likeable_type' => $docId ? Document::class : Book::class,
            ]);
            // Optional: increment likes_count if columns exist
            // if ($docId) Document::find($docId)?->increment('likes_count');
            // else Book::find($bookId)?->increment('likes_count');

            return response()->json(['liked' => true]);
        }
    }

    public function follow($id)
    {
        $userToFollow = User::findOrFail($id);
        $me = Auth::user();

        if ($me->id == $id) {
            return response()->json(['message' => 'You cannot follow yourself'], 400);
        }

        // Using attach for Many-to-Many
        if (!$me->followings()->where('following_id', $id)->exists()) {
            $me->followings()->attach($id);

            Notification::create([
                'user_id' => $id,
                'type' => 'follow',
                'title' => 'New Follower',
                'message' => $me->name . ' started following you.',
                'related_id' => $me->id,
                'related_type' => 'user'
            ]);
        }

        return response()->json(['following' => true]);
    }

    public function unfollow($id)
    {
        $me = Auth::user();
        $me->followings()->detach($id);
        return response()->json(['following' => false]);
    }

    public function toggleFollow(Request $request)
    {
        $request->validate(['user_id' => 'required|exists:users,id']);
        $id = $request->user_id;
        $me = Auth::user();

        if ($me->id == $id) {
            return response()->json(['message' => 'You cannot follow yourself'], 400);
        }

        if ($me->followings()->where('following_id', $id)->exists()) {
            $me->followings()->detach($id);
            return response()->json(['following' => false]);
        } else {
            $me->followings()->attach($id);

            Notification::create([
                'user_id' => $id,
                'type' => 'follow',
                'title' => 'New Follower',
                'message' => $me->name . ' started following you.',
                'related_id' => $me->id,
                'related_type' => 'user'
            ]);

            return response()->json(['following' => true]);
        }
    }

    public function getRelationshipStatus($id)
    {
        $user = User::findOrFail($id);
        $me = Auth::user();

        if (!$me) {
            return response()->json([
                'state' => 'none',
                'is_following' => false,
                'is_follower' => false,
                'is_self' => false,
                'followers_count' => $user->followers()->count(),
                'following_count' => $user->followings()->count(),
            ]);
        }

        $isFollowing = $me->followings()->where('following_id', $id)->exists();
        $isFollower = $me->followers()->where('follower_id', $id)->exists();
        $isSelf = $me->id == $id;

        $state = 'none';
        if ($isSelf) {
            $state = 'self';
        } elseif ($isFollowing && $isFollower) {
            $state = 'friend';
        } elseif ($isFollowing) {
            $state = 'following';
        } elseif ($isFollower) {
            $state = 'follower';
        }

        return response()->json([
            'state' => $state,
            'is_following' => $isFollowing,
            'is_follower' => $isFollower,
            'is_self' => $isSelf,
            'followers_count' => $user->followers()->count(),
            'following_count' => $user->followings()->count(),
        ]);
    }
}
