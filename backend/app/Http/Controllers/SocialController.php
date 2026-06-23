<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Document;
use App\Models\Book;
use App\Models\Favorite;
use App\Models\Follow;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SocialController extends Controller
{
    public function toggleFavorite(Request $request)
    {
        try {
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
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'trace' => $e->getTrace()
            ], 500);
        }
    }

    public function saveDocument($id)
    {
        try {
            $userId = Auth::id();
            $favorite = Favorite::where('user_id', $userId)->where('document_id', $id)->first();

            if ($favorite) {
                $favorite->delete();
                return response()->json(['favorited' => false]);
            } else {
                Favorite::create([
                    'user_id' => $userId,
                    'document_id' => $id,
                ]);
                return response()->json(['favorited' => true]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'trace' => $e->getTrace()
            ], 500);
        }
    }

    public function toggleFollow(Request $request)
    {
        $followingId = $request->user_id;
        return $this->handleFollow($followingId);
    }

    public function follow($id)
    {
        return $this->handleFollow($id);
    }

    public function unfollow($id)
    {
        $followerId = Auth::id();
        $follow = Follow::where('follower_id', $followerId)
            ->where('following_id', $id)
            ->first();

        if ($follow) {
            $follow->delete();
        }

        return response()->json(['followed' => false]);
    }

    public function getRelationshipStatus($userId)
    {
        $currentUserId = Auth::id();

        if ($currentUserId == $userId) {
            return response()->json([
                'is_self' => true,
                'state' => 'self',
                'is_following' => false,
                'is_follower' => false,
                'followers_count' => User::find($userId)->followers()->count(),
                'following_count' => User::find($userId)->followings()->count(),
            ]);
        }

        $isFollowing = Follow::where('follower_id', $currentUserId)
            ->where('following_id', $userId)
            ->exists();

        $isFollower = Follow::where('follower_id', $userId)
            ->where('following_id', $currentUserId)
            ->exists();

        // Determine the state
        if ($isFollowing && $isFollower) {
            $state = 'friend';
        } elseif ($isFollowing) {
            $state = 'following';
        } elseif ($isFollower) {
            $state = 'follower';
        } else {
            $state = 'none';
        }

        $targetUser = User::find($userId);

        return response()->json([
            'is_self' => false,
            'state' => $state,
            'is_following' => $isFollowing,
            'is_follower' => $isFollower,
            'followers_count' => $targetUser->followers()->count(),
            'following_count' => $targetUser->followings()->count(),
        ]);
    }

    private function handleFollow($followingId)
    {
        $followerId = Auth::id();

        if ($followerId == $followingId) {
            return response()->json(['message' => 'You cannot follow yourself'], 400);
        }

        $follow = Follow::where('follower_id', $followerId)
            ->where('following_id', $followingId)
            ->first();

        if ($follow) {
            $follow->delete();
            return response()->json(['followed' => false]);
        } else {
            Follow::create([
                'follower_id' => $followerId,
                'following_id' => $followingId,
            ]);

            // Notification
            Notification::create([
                'user_id' => $followingId,
                'type' => 'follow',
                'title' => 'New Follower',
                'message' => Auth::user()->name . ' started following you.',
                'related_id' => $followerId,
                'related_type' => 'user'
            ]);

            return response()->json(['followed' => true]);
        }
    }
}
