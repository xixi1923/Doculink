<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $subjects = Subject::when($search, function ($query, $search) {
            return $query->where('subject_name', 'like', "%{$search}%");
        })->limit(20)->get();

        return response()->json($subjects);
    }
}
