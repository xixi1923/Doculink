<?php

namespace App\Services;

use App\Repositories\QuestionRepository;

class QuestionService
{
    protected $questionRepository;

    public function __construct(QuestionRepository $questionRepository)
    {
        $this->questionRepository = $questionRepository;
    }

    public function getAllQuestions()
    {
        return $this->questionRepository->all(['*'], ['user', 'category', 'answers']);
    }

    public function getQuestionWithAnswers($slug)
    {
        return \App\Models\Question::where('slug', $slug)
            ->with(['user', 'category', 'answers.user'])
            ->firstOrFail();
    }

    public function createQuestion(array $data)
    {
        return $this->questionRepository->create($data);
    }
}
