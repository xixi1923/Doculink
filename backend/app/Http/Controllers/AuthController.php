<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load([
            'documents',
            'books',
            'favorites.document',
            'favorites.book',
            'university'
        ]);

        // Calculate stats
        $totalDownloads = $user->documents()->sum('download_count') + $user->books()->sum('download_count');

        return response()->json([
            'user' => $user,
            'stats' => [
                'total_uploads' => $user->documents()->count() + $user->books()->count(),
                'total_downloads' => $totalDownloads,
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'bio' => 'nullable|string|max:1000',
            'university_id' => 'nullable|exists:universities,id',
            'major' => 'nullable|string|max:255',
        ]);

        $user->update($request->only(['name', 'email', 'bio', 'university_id', 'major']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists in R2
            if ($user->avatar) {
                $oldPath = parse_url($user->avatar, PHP_URL_PATH);
                $oldPath = ltrim($oldPath, '/');
                if ($oldPath && Storage::disk('r2')->exists($oldPath)) {
                    Storage::disk('r2')->delete($oldPath);
                }
            }

            $file = $request->file('avatar');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = 'avatars/' . $filename;

            Storage::disk('r2')->put($path, file_get_contents($file));

            $publicUrl = rtrim(config('filesystems.disks.r2.url'), '/') . '/' . $path;

            $user->avatar = $publicUrl;
            $user->save();

            return response()->json([
                'message' => 'Avatar updated successfully',
                'url' => $publicUrl,
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'No image file provided'], 400);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }

    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        // Delete avatar from R2 if exists
        if ($user->avatar) {
            $oldPath = parse_url($user->avatar, PHP_URL_PATH);
            $oldPath = ltrim($oldPath, '/');
            if ($oldPath && Storage::disk('r2')->exists($oldPath)) {
                Storage::disk('r2')->delete($oldPath);
            }
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }
}
