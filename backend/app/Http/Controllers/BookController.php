<?php

namespace App\Http\Controllers;

use App\Services\BookService;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookController extends Controller
{
    protected $bookService;

    public function __construct(BookService $bookService)
    {
        $this->bookService = $bookService;
    }

    public function index(Request $request)
    {
        $books = $this->bookService->getAllBooks($request->all());
        return response()->json($books);
    }

    public function categories()
    {
        return response()->json(Category::all());
    }

    public function show($id)
    {
        $book = $this->bookService->getBookById($id);
        $book->increment('view_count');

        if (Auth::check()) {
            $book->is_favorited = $book->favorites()->where('user_id', Auth::id())->exists();
        } else {
            $book->is_favorited = false;
        }

        return response()->json($book);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'file' => 'required|file|mimes:pdf,epub|max:51200', // 50MB
            'cover' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['title', 'author', 'description', 'category_id', 'isbn', 'publication_year', 'publisher']);
        $data['uploaded_by'] = Auth::id();

        $book = $this->bookService->createBook($data, $request->file('file'), $request->file('cover'));

        return response()->json($book, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
        ]);

        $this->bookService->updateBook($id, $request->all());
        return response()->json(['message' => 'Book updated successfully']);
    }

    public function destroy($id)
    {
        $this->bookService->deleteBook($id);
        return response()->json(['message' => 'Book deleted successfully']);
    }

    public function download($id)
    {
        $book = $this->bookService->getBookById($id);
        $book->increment('download_count');

        // Assuming file_path is a URL, we might need to resolve it to a local path or stream it
        return response()->json(['url' => $book->file_path]);
    }
}
