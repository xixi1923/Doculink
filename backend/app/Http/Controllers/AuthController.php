<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

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
            'role' => 'student',
        ]);

        if (!$user->hasRole('student')) {
            $user->syncRoles('student');
        }

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

        $roleToSync = $user->role ?? 'student';
        if (!$user->hasRole($roleToSync)) {
            $user->syncRoles($roleToSync);
        }

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
        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->loadCount(['followers', 'following', 'documents']));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'bio' => 'nullable|string|max:1000',
            'school' => 'nullable|string|max:255',
            'university' => 'nullable|string|max:255',
            'major' => 'nullable|string|max:255',
        ]);

        $user->update($request->only(['name', 'email', 'bio', 'school', 'university', 'major']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->loadCount(['followers', 'following', 'documents']),
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            // លុបរូបចាស់បើវាមាននៅលើ R2
            if ($user->avatar) {
                $oldPath = parse_url($user->avatar, PHP_URL_PATH);
                $oldPath = ltrim($oldPath, '/');
                if ($oldPath && \Illuminate\Support\Facades\Storage::disk('r2')->exists($oldPath)) {
                    \Illuminate\Support\Facades\Storage::disk('r2')->delete($oldPath);
                }
            }

            // បង្ហោះរូបថ្មីទៅកាន់ Cloudflare R2
            $file = $request->file('avatar');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = 'avatars/' . $filename;

            \Illuminate\Support\Facades\Storage::disk('r2')->put($path, file_get_contents($file));

            // បង្កើត Public URL
            $publicUrl = rtrim(config('filesystems.disks.r2.url'), '/') . '/' . $path;

            $user->avatar = $publicUrl;
            $user->save();

            return response()->json([
                'message' => 'Avatar updated successfully',
                'url' => $publicUrl,
                'user' => $user->loadCount(['followers', 'following', 'documents'])
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
                'message' => 'Password បច្ចុប្បន្នមិនត្រឹមត្រូវទេ'
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'ផ្លាស់ប្តូរ Password ជោគជ័យ!']);
    }

    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        // លុបរូបភាពចេញពី R2 បើមាន
        if ($user->avatar) {
            $oldPath = parse_url($user->avatar, PHP_URL_PATH);
            $oldPath = ltrim($oldPath, '/');
            if (\Illuminate\Support\Facades\Storage::disk('r2')->exists($oldPath)) {
                \Illuminate\Support\Facades\Storage::disk('r2')->delete($oldPath);
            }
        }

        // លុប Token ទាំងអស់ និងលុប User
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'គណនីត្រូវបានលុបដោយជោគជ័យ']);
    }
}
