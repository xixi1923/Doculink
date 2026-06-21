<?php

namespace App\Services;

use App\Repositories\UniversityRepository;

class UniversityService
{
    protected $universityRepository;

    public function __construct(UniversityRepository $universityRepository)
    {
        $this->universityRepository = $universityRepository;
    }

    public function getAllUniversities()
    {
        return $this->universityRepository->all(['*'], ['documents']);
    }

    public function getUniversityDetails($id)
    {
        return $this->universityRepository->findById($id, ['*'], ['documents.user', 'documents.category']);
    }

    public function createUniversity(array $data)
    {
        return $this->universityRepository->create($data);
    }

    public function updateUniversity($id, array $data)
    {
        return $this->universityRepository->update($id, $data);
    }

    public function deleteUniversity($id)
    {
        return $this->universityRepository->deleteById($id);
    }
}
