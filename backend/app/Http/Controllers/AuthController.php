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
            'role' => 'student',
        ]);

        $user->assignRole('student');

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

    public function getUserProfile($id)
    {
        $user = User::with([
            'documents' => function($q) {
                $q->withCount(['comments', 'likes']);
            },
            'books',
            'university',
            'followers',
            'followings'
        ])->findOrFail($id);

        $totalDownloads = $user->documents->sum('download_count');
        $totalViews = $user->documents->sum('view_count');
        $totalLikes = $user->documents->sum('likes_count');

        $isFollowing = false;
        if (Auth::check()) {
            $isFollowing = \App\Models\Follow::where('follower_id', Auth::id())
                ->where('following_id', $id)
                ->exists();
        }

        return response()->json([
            'user' => $user,
            'stats' => [
                'total_uploads' => $user->documents->count() + $user->books->count(),
                'total_downloads' => (int) $totalDownloads,
                'total_views' => (int) $totalViews,
                'total_likes' => (int) $totalLikes,
                'followers_count' => $user->followers->count(),
                'following_count' => $user->followings->count(),
                'is_following' => $isFollowing
            ]
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load([
            'documents' => function($q) {
                $q->withCount(['comments', 'likes']);
            },
            'books',
            'favorites' => function($q) {
                $q->orderBy('created_at', 'desc');
            },
            'favorites.document.user',
            'favorites.book',
            'university',
            'followers',
            'followings'
        ]);

        $totalDownloads = $user->documents->sum('download_count');
        $totalViews = $user->documents->sum('view_count');
        $totalLikes = $user->documents->sum('likes_count');

        return response()->json([
            'user' => $user,
            'stats' => [
                'total_uploads' => $user->documents->count() + $user->books->count(),
                'total_downloads' => (int) $totalDownloads,
                'total_views' => (int) $totalViews,
                'total_likes' => (int) $totalLikes,
                'followers_count' => $user->followers->count(),
                'following_count' => $user->followings->count(),
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Convert empty strings to null for specific fields to avoid validation/database issues
        $input = $request->all();
        $nullableFields = ['university_id', 'username', 'bio', 'major', 'school', 'affiliation', 'country', 'academic_title'];

        foreach ($nullableFields as $field) {
            if (isset($input[$field]) && $input[$field] === '') {
                $input[$field] = null;
            }
        }

        if (isset($input['social_links']) && is_array($input['social_links'])) {
            foreach ($input['social_links'] as $key => $value) {
                if ($value === '') {
                    $input['social_links'][$key] = null;
                }
            }
        }
        $request->replace($input);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'bio' => 'nullable|string|max:2000',
            'university_id' => 'nullable|exists:universities,id',
            'major' => 'nullable|string|max:255',
            'school' => 'nullable|string|max:255',
            'affiliation' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'academic_title' => 'nullable|string|max:255',
            'research_interests' => 'nullable|array',
            'social_links' => 'nullable|array',
            'social_links.facebook' => 'nullable|string|url',
            'social_links.instagram' => 'nullable|string|url',
            'social_links.tiktok' => 'nullable|string|url',
            'social_links.website' => 'nullable|string|url',
        ]);

        $user->update($request->only([
            'name', 'username', 'email', 'bio', 'university_id', 'major',
            'school', 'affiliation', 'country', 'academic_title',
            'research_interests', 'social_links'
        ]));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->load('university'),
        ]);
    }

    public function getPublicProfile($username)
    {
        $user = User::with([
            'documents' => function($q) {
                $q->withCount(['comments', 'likes'])->where('status', 'approved');
            },
            'books',
            'university',
            'followers',
            'followings'
        ])->where('username', $username)->firstOrFail();

        $totalDownloads = $user->documents->sum('download_count');
        $totalViews = $user->documents->sum('view_count');
        $totalLikes = $user->documents->sum('likes_count');

        $isFollowing = false;
        if (Auth::check()) {
            $isFollowing = \App\Models\Follow::where('follower_id', Auth::id())
                ->where('following_id', $user->id)
                ->exists();
        }

        return response()->json([
            'user' => $user,
            'stats' => [
                'total_uploads' => $user->documents->count() + $user->books->count(),
                'total_downloads' => (int) $totalDownloads,
                'total_views' => (int) $totalViews,
                'total_likes' => (int) $totalLikes,
                'followers_count' => $user->followers->count(),
                'following_count' => $user->followings->count(),
                'is_following' => $isFollowing
            ]
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        try {
            $user = $request->user();

            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');

                // Generate unique filename
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = 'avatars/' . $filename;

                // Delete old avatar if exists
                if ($user->avatar) {
                    try {
                        $oldPath = parse_url($user->avatar, PHP_URL_PATH);
                        $oldPath = ltrim($oldPath, '/');
                        if ($oldPath && Storage::disk('r2')->exists($oldPath)) {
                            Storage::disk('r2')->delete($oldPath);
                        }
                    } catch (\Exception $e) {
                        \Log::warning('Failed to delete old avatar: ' . $e->getMessage());
                    }
                }

                // Upload to R2
                try {
                    $fileContents = file_get_contents($file->getRealPath());
                    Storage::disk('r2')->put($path, $fileContents, 'public');

                    // Get public URL - ensure it doesn't have double slashes
                    $publicUrl = rtrim(config('filesystems.disks.r2.url'), '/') . '/' . ltrim($path, '/');

                    $user->avatar = $publicUrl;
                    $user->save();

                    return response()->json([
                        'message' => 'Avatar updated successfully',
                        'url' => $publicUrl,
                        'user' => $user
                    ], 200);

                } catch (\Exception $e) {
                    \Log::error('R2 Upload Error: ' . $e->getMessage(), [
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'trace' => $e->getTraceAsString()
                    ]);

                    return response()->json([
                        'message' => 'Failed to upload avatar to storage: ' . $e->getMessage(),
                        'error' => $e->getMessage()
                    ], 500);
                }
            }

            return response()->json(['message' => 'No image file provided'], 400);

        } catch (\Exception $e) {
            \Log::error('Avatar Update Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while updating your avatar',
                'error' => $e->getMessage()
            ], 500);
        }
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
            try {
                $oldPath = parse_url($user->avatar, PHP_URL_PATH);
                $oldPath = ltrim($oldPath, '/');
                if ($oldPath && Storage::disk('r2')->exists($oldPath)) {
                    Storage::disk('r2')->delete($oldPath);
                }
            } catch (\Exception $e) {
                \Log::warning('Failed to delete avatar during account deletion: ' . $e->getMessage());
            }
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }

    // Diagnostic endpoint to test R2 configuration
    public function testR2Connection(Request $request)
    {
        $config = config('filesystems.disks.r2');

        $diagnostics = [
            'r2_configured' => !!config('filesystems.disks.r2'),
            'access_key_set' => !!env('CLOUDFLARE_R2_ACCESS_KEY_ID'),
            'secret_key_set' => !!env('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
            'bucket_set' => !!env('CLOUDFLARE_R2_BUCKET'),
            'endpoint_set' => !!env('CLOUDFLARE_R2_ENDPOINT'),
            'public_url_set' => !!env('CLOUDFLARE_R2_PUBLIC_URL'),
            'config' => [
                'driver' => $config['driver'] ?? null,
                'region' => $config['region'] ?? null,
                'bucket' => env('CLOUDFLARE_R2_BUCKET', 'NOT SET'),
                'endpoint' => env('CLOUDFLARE_R2_ENDPOINT', 'NOT SET'),
                'public_url' => env('CLOUDFLARE_R2_PUBLIC_URL', 'NOT SET'),
            ],
            'storage_disk_active' => Storage::disk('r2') ? true : false
        ];

        return response()->json($diagnostics);
    }
}
