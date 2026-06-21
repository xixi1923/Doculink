<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class UserManagementController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return Response::json($users);
    }

    public function toggleStatus(int $id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            $user->role = 'user';
        } else {
            $user->role = 'admin';
        }

        $user->save();

        return Response::json(['message' => 'User role updated', 'user' => $user]);
    }

    public function destroy(int $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return Response::json(['message' => 'User deleted']);
    }
}
