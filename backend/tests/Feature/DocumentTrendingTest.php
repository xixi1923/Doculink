<?php

namespace Tests\Feature;

use App\Repositories\DocumentRepository;
use App\Services\DocumentService;
use App\Models\Document;
use Tests\TestCase;

class DocumentTrendingTest extends TestCase
{
    public function test_document_service_exposes_trending_documents_method(): void
    {
        $service = new DocumentService(new DocumentRepository(new Document()));

        $this->assertTrue(method_exists($service, 'getTrendingDocuments'));
    }
}
