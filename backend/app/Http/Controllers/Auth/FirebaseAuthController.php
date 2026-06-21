<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FirebaseAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
            'name' => 'nullable|string|max:255',
            'uid' => 'nullable|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $request->name ?? 'User',
                'email' => $request->email,
                'role' => 'user',
                'firebase_uid' => $request->uid,
                'password' => null,
                'status' => 'active'
            ]);
        } else {
            if (!$user->firebase_uid && $request->uid) {
                $user->firebase_uid = $request->uid;
                $user->save();
            }
        }

        $token = $user->createToken('firebase-login')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }
}
