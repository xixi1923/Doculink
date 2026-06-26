<?php

namespace App\Http\Controllers;

use App\Models\Major;
use Illuminate\Http\Request;

class MajorController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $departmentId = $request->query('department_id');

        $majors = Major::when($search, function ($query, $search) {
            return $query->where('major_name', 'like', "%{$search}%");
        })->when($departmentId, function ($query, $departmentId) {
            return $query->where('department_id', $departmentId);
        })->limit(20)->get();

        return response()->json($majors);
    }
}
