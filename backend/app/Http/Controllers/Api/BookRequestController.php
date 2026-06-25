<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookRequestController extends Controller
{
    public function index()
    {
        $requests = BookRequest::with('user')->latest()->paginate(20);
        return response()->json($requests);
    }

    public function myRequests()
    {
        $requests = BookRequest::where('user_id', Auth::id())->latest()->get();
        return response()->json($requests);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $bookRequest = BookRequest::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'author' => $request->author,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Book request submitted successfully.',
            'data' => $bookRequest
        ]);
    }

    public function updateStatus(Request $request, BookRequest $bookRequest)
    {
        $request->validate([
            'status' => 'required|in:pending,fulfilled,rejected'
        ]);

        $bookRequest->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status updated successfully.',
            'data' => $bookRequest
        ]);
    }

    public function destroy(BookRequest $bookRequest)
    {
        $bookRequest->delete();
        return response()->json(['message' => 'Request deleted successfully.']);
    }
}
