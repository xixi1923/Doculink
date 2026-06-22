<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'document_id' => 'required|exists:documents,id',
            'reason' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $report = Report::create([
            'user_id' => Auth::id(),
            'document_id' => $request->document_id,
            'reason' => $request->reason,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        return response()->json($report, 201);
    }

    public function adminIndex()
    {
        $reports = Report::with(['user', 'document'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($reports);
    }

    public function adminResolve(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,resolved,rejected',
            'notes' => 'nullable|string',
        ]);

        $report = Report::findOrFail($id);
        $report->update([
            'status' => $request->status,
        ]);

        return response()->json(['message' => 'Report resolved', 'report' => $report]);
    }
}
