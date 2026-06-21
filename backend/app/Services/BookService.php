<?php

namespace App\Services;

use App\Repositories\BookRepository;
use Illuminate\Support\Facades\Storage;

class BookService
{
    protected $bookRepository;

    public function __construct(BookRepository $bookRepository)
    {
        $this->bookRepository = $bookRepository;
    }

    public function getAllBooks($filters = [])
    {
        $query = \App\Models\Book::with(['category', 'uploader']);

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('author', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->paginate(12);
    }

    public function createBook(array $data, $file, $cover = null)
    {
        if ($file) {
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = 'books/' . $filename;
            Storage::disk('r2')->put($path, file_get_contents($file));
            $data['file_path'] = rtrim(config('filesystems.disks.r2.url'), '/') . '/' . $path;
        }

        if ($cover) {
            $covername = time() . '_cover_' . uniqid() . '.' . $cover->getClientOriginalExtension();
            $coverPath = 'covers/' . $covername;
            Storage::disk('r2')->put($coverPath, file_get_contents($cover));
            $data['cover_image'] = rtrim(config('filesystems.disks.r2.url'), '/') . '/' . $coverPath;
        }

        return $this->bookRepository->create($data);
    }

    public function getBookById($id)
    {
        return $this->bookRepository->findById($id, ['*'], ['category', 'uploader']);
    }

    public function updateBook($id, array $data)
    {
        return $this->bookRepository->update($id, $data);
    }

    public function deleteBook($id)
    {
        return $this->bookRepository->deleteById($id);
    }
}
