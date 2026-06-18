<?php

namespace App\Services;

use App\Repositories\DocumentRepository;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
    protected $documentRepository;

    public function __construct(DocumentRepository $documentRepository)
    {
        $this->documentRepository = $documentRepository;
    }

    public function getAllDocuments()
    {
        return $this->documentRepository->all(['*'], ['user', 'category']);
    }

    public function uploadDocument(array $data, $file)
    {
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = 'documents/' . $filename;

        Storage::disk('r2')->put($path, file_get_contents($file));

        $publicUrl = rtrim(config('filesystems.disks.r2.url'), '/') . '/' . $path;

        $data['file_path'] = $publicUrl;
        $data['file_type'] = $file->getClientOriginalExtension();

        return $this->documentRepository->create($data);
    }

    public function getDocumentDetails($id)
    {
        return $this->documentRepository->findById($id, ['*'], ['user', 'category', 'comments.user', 'tags']);
    }
}
