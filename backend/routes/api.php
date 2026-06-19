<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\DocumentManagementController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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

    Route::get('/chats', [MessageController::class, 'getChats']);
    Route::get('/chats/{id}/messages', [MessageController::class, 'getMessages']);
    Route::post('/messages', [MessageController::class, 'sendMessage']);

    Route::get('/stats/home', [StatsController::class, 'homeStats']);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{id}', [DocumentController::class, 'show']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store'])->middleware('role:admin');
    Route::put('/categories/{id}', [CategoryController::class, 'update'])->middleware('role:admin');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->middleware('role:admin');

    // Admin Routes
    Route::middleware('role:admin|moderator')->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // User Management (Admin only)
        Route::middleware('role:admin')->group(function () {
            Route::get('/users', [UserManagementController::class, 'index']);
            Route::post('/users/{id}/toggle-status', [UserManagementController::class, 'toggleStatus']);
            Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);
        });

        // Document Management
        Route::get('/documents', [DocumentManagementController::class, 'index']);
        Route::post('/documents/{id}/approve', [DocumentManagementController::class, 'approve']);
        Route::post('/documents/{id}/reject', [DocumentManagementController::class, 'reject']);
        Route::delete('/documents/{id}', [DocumentManagementController::class, 'destroy']);
    });
});
