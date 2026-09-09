<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\NoticeController;
use App\Http\Controllers\Api\V1\ContentController;
use App\Http\Controllers\Api\V1\Admin\EventController as AdminEventController;
use App\Http\Controllers\Api\V1\Admin\NoticeController as AdminNoticeController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\Admin\ContentController as AdminContentController;
use App\Http\Controllers\Api\V1\Admin\MediaUploadController as AdminMediaUploadController;

Route::prefix('v1')->group(function () {
    
    // --- Public Authentication ---
    Route::post('/auth/login', [AuthController::class, 'login']);

    // --- Public Content Endpoints ---
    Route::get('/events/upcoming', [EventController::class, 'upcoming']);
    Route::get('/events/past', [EventController::class, 'past']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);

    Route::get('/notices', [NoticeController::class, 'index']);
    Route::get('/notices/{id}', [NoticeController::class, 'show']);

    Route::get('/sliders', [ContentController::class, 'sliders']);
    Route::get('/media', [ContentController::class, 'media']);
    Route::get('/documents', [ContentController::class, 'documents']);
    Route::get('/documents/{id}', [ContentController::class, 'showDocument']);
    Route::get('/faculty', [ContentController::class, 'faculty']);
    Route::get('/faculty/{id}', [ContentController::class, 'showFaculty']);
    Route::get('/departments', [ContentController::class, 'departments']);
    Route::get('/programmes', [ContentController::class, 'programmes']);
    Route::get('/settings', [ContentController::class, 'settings']);

    // --- Protected Admin Endpoints (Sanctum Token Required) ---
    Route::middleware('auth:sanctum')->group(function () {
        
        // Session / Auth Management
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Admin Events Management
        Route::post('/admin/events', [AdminEventController::class, 'store']);
        Route::put('/admin/events/{id}', [AdminEventController::class, 'update']);
        Route::delete('/admin/events/{id}', [AdminEventController::class, 'destroy']);
        Route::post('/admin/events/{id}/sub-events', [AdminEventController::class, 'addSubEvent']);
        Route::delete('/admin/sub-events/{id}', [AdminEventController::class, 'destroySubEvent']);

        // Admin Notices Management
        Route::post('/admin/notices', [AdminNoticeController::class, 'store']);
        Route::put('/admin/notices/{id}', [AdminNoticeController::class, 'update']);
        Route::delete('/admin/notices/{id}', [AdminNoticeController::class, 'destroy']);

        // Admin Users Management (SUPER_ADMIN checked inside controller)
        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::post('/admin/users', [AdminUserController::class, 'store']);
        Route::put('/admin/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);

        // Admin Content & Media
        Route::post('/admin/sliders', [AdminContentController::class, 'storeSlider']);
        Route::delete('/admin/sliders/{id}', [AdminContentController::class, 'destroySlider']);
        Route::post('/admin/faculty', [AdminContentController::class, 'storeFaculty']);
        Route::put('/admin/faculty/{id}', [AdminContentController::class, 'updateFaculty']);
        Route::delete('/admin/faculty/{id}', [AdminContentController::class, 'destroyFaculty']);
        Route::post('/admin/documents', [AdminContentController::class, 'storeDocument']);
        Route::delete('/admin/documents/{id}', [AdminContentController::class, 'destroyDocument']);
        Route::post('/admin/settings', [AdminContentController::class, 'updateSettings']);
        Route::get('/admin/logs', [AdminContentController::class, 'logs']);
        Route::post('/admin/media', [AdminMediaUploadController::class, 'upload']);
    });
});
