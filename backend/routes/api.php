<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\DocumentManagementController;
use App\Http\Controllers\Auth\FirebaseAuthController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/firebase-login', [FirebaseAuthController::class, 'login']);

// Guest Access Routes (Read-only)
Route::get('/universities', [UniversityController::class, 'index']);
Route::get('/universities/{id}', [UniversityController::class, 'show']);
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/categories', [BookController::class, 'categories']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/documents', [DocumentController::class, 'index']);
Route::get('/documents/{id}', [DocumentController::class, 'show']);
Route::get('/stats/home', [StatsController::class, 'homeStats']);
Route::get('/community/questions', [CommunityController::class, 'index']);
Route::get('/community/questions/{slug}', [CommunityController::class, 'showQuestion']);
Route::get('/tags', [TagController::class, 'index']);
Route::get('/tags/{id}', [TagController::class, 'show']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/avatar', [AuthController::class, 'updateAvatar']);
    Route::post('/profile/change-password', [AuthController::class, 'changePassword']);
    Route::delete('/profile', [AuthController::class, 'deleteAccount']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Social / Favorites
    Route::post('/favorites/toggle', [SocialController::class, 'toggleFavorite']);

    // Documents
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::post('/documents/{id}/comment', [DocumentController::class, 'comment']);
    Route::get('/documents/{id}/download', [DocumentController::class, 'download']);

    // Reports
    Route::post('/reports', [ReportController::class, 'store']);

    // Books (Admin only for creation/management)
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);
    Route::get('/books/{id}/download', [BookController::class, 'download']);

    // Community
    Route::post('/community/questions', [CommunityController::class, 'storeQuestion']);
    Route::post('/community/questions/{questionId}/answers', [CommunityController::class, 'storeAnswer']);

    // Universities (Admin only for creation/management)
    Route::post('/universities', [UniversityController::class, 'store']);
    Route::put('/universities/{id}', [UniversityController::class, 'update']);
    Route::delete('/universities/{id}', [UniversityController::class, 'destroy']);

    // Categories (Admin only)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Tags (Admin only for creation/management)
    Route::post('/tags', [TagController::class, 'store']);
    Route::put('/tags/{id}', [TagController::class, 'update']);
    Route::delete('/tags/{id}', [TagController::class, 'destroy']);

    // Admin Panel Routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // User Management
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::post('/users/{id}/toggle-status', [UserManagementController::class, 'toggleStatus']);
        Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);

        // Document Management
        Route::get('/documents', [DocumentManagementController::class, 'index']);
        Route::post('/documents/{id}/approve', [DocumentManagementController::class, 'approve']);
        Route::post('/documents/{id}/reject', [DocumentManagementController::class, 'reject']);
        Route::delete('/documents/{id}', [DocumentManagementController::class, 'destroy']);

        // Report Management
        Route::get('/reports', [ReportController::class, 'adminIndex']);
        Route::post('/reports/{id}/resolve', [ReportController::class, 'adminResolve']);
    });
});
