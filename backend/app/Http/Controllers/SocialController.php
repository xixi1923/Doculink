<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Document;
use App\Models\Book;
use App\Models\Favorite;
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
}
