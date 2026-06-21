<?php

namespace App\Http\Controllers;

use App\Services\QuestionService;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommunityController extends Controller
{
    protected $questionService;

    public function __construct(QuestionService $questionService)
    {
        $this->questionService = $questionService;
    }

    public function index()
    {
        $questions = \App\Models\Question::with(['user', 'category'])
            ->withCount('answers')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($questions);
    }

    public function storeQuestion(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $data = $request->only(['title', 'content', 'category_id']);
        $data['user_id'] = Auth::id();

        $question = $this->questionService->createQuestion($data);

        return response()->json($question, 201);
    }

    public function showQuestion($slug)
    {
        $question = $this->questionService->getQuestionWithAnswers($slug);
        $question->increment('views_count');

        return response()->json($question);
    }

    public function storeAnswer(Request $request, $questionId)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $answer = Answer::create([
            'content' => $request->content,
            'question_id' => $questionId,
            'user_id' => Auth::id(),
        ]);

        // Trigger notification to question owner
        $question = \App\Models\Question::find($questionId);
        if ($question->user_id !== Auth::id()) {
            // $question->user->notify(new \App\Notifications\NewAnswer($answer));
        }

        return response()->json($answer->load('user'), 201);
    }
}
