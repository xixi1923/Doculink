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
            'avatar' => 'nullable|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $request->name ?? 'User',
                'email' => $request->email,
                'role' => 'student',
                'firebase_uid' => $request->uid,
                'avatar' => $request->avatar,
                'password' => null,
                'status' => 'active'
            ]);

            $user->assignRole('student');
        } else {
            $updated = false;
            if (!$user->firebase_uid && $request->uid) {
                $user->firebase_uid = $request->uid;
                $updated = true;
            }
            if ($request->name && $user->name !== $request->name) {
                $user->name = $request->name;
                $updated = true;
            }
            if ($request->avatar && $user->avatar !== $request->avatar) {
                $user->avatar = $request->avatar;
                $updated = true;
            }
            if ($updated) {
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
