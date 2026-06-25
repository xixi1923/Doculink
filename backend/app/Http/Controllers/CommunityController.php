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

    public function index(Request $request)
    {
        $query = \App\Models\Question::with(['user', 'category', 'user.university'])
            ->withCount('answers')
            ->where('is_public', true)
            ->orderBy('created_at', 'desc');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $questions = $query->paginate(15);

        return response()->json($questions);
    }

    public function storeQuestion(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|max:5120',
            'is_public' => 'boolean',
        ]);

        $data = $request->only(['title', 'content', 'category_id', 'is_public']);
        $data['user_id'] = Auth::id();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            \Illuminate\Support\Facades\Storage::disk('r2')->putFileAs('questions', $file, $filename);
            $publicUrl = rtrim(config('filesystems.disks.r2.url'), '/') . '/questions/' . $filename;
            $data['image_path'] = $publicUrl;
        }

        $question = $this->questionService->createQuestion($data);

        return response()->json($question, 201);
    }

    public function showQuestion($slug)
    {
        $question = $this->questionService->getQuestionWithAnswers($slug);
        $question->increment('views');

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
