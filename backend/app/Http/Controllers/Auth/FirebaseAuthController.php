<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FirebaseAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
            'name' => 'nullable|string|max:255',
        ]);

        $existingRole = User::where('email', $request->email)->value('role');
        $role = $existingRole ?? 'student';

        $user = User::updateOrCreate(
            [
                'email' => $request->email,
            ],
            [
                'name' => $request->name ?? 'User',
                'role' => $role,
                'password' => Hash::make(Str::random(40)),
            ]
        );

        if (!$user->hasRole($role)) {
            $user->syncRoles($role);
        }

        $token = $user->createToken('firebase-login')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
        ]);
    }
}
