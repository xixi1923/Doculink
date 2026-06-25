<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $departments = Department::when($search, function ($query, $search) {
            return $query->where('department_full_name', 'like', "%{$search}%")
                         ->orWhere('department_short_name', 'like', "%{$search}%");
        })->limit(10)->get();

        return response()->json($departments);
    }
}
