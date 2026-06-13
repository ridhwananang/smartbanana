<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ScanController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NutritionController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\ChatController;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

Route::post('/chats',     [ChatController::class, 'store'])->middleware('throttle:30,1');
Route::get('/nutritions',        [NutritionController::class, 'index']);
Route::get('/nutritions/{key}',  [NutritionController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout',       [AuthController::class, 'logout']);
    Route::get('/profile',            [ProfileController::class, 'show']);
    Route::put('/profile',            [ProfileController::class, 'update']);
    Route::get('/dashboard',          [DashboardController::class, 'index']);
    Route::get('/stats',              [StatsController::class, 'index']);
    
    // Scans Resource
    Route::get('/scans',               [ScanController::class, 'index']);
    Route::post('/scans',              [ScanController::class, 'store']);
    Route::get('/scans/daily-summary', [ScanController::class, 'dailySummary']);
    Route::get('/scans/{id}',          [ScanController::class, 'show']);
    Route::delete('/scans/{id}',       [ScanController::class, 'destroy']);
});