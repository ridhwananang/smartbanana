<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ScanController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HistoryController;
use App\Http\Controllers\Api\NutritionController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DashboardController; // ← tambah
use App\Http\Controllers\Api\StatsController;     // ← tambah

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/chat',     [App\Http\Controllers\ChatController::class, 'chat'])->middleware('throttle:30,1');
Route::get('/nutrition',        [NutritionController::class, 'index']);
Route::get('/nutrition/search', [NutritionController::class, 'search']);
Route::get('/nutrition/{key}',  [NutritionController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',            [AuthController::class, 'logout']);
    Route::get('/profile',            [ProfileController::class, 'show']);
    Route::put('/profile',            [ProfileController::class, 'update']);
    Route::get('/dashboard',          [DashboardController::class, 'index']);        // ← tambah
    Route::get('/stats/weekly',       [StatsController::class, 'weekly']);           // ← tambah
    Route::get('/stats/monthly',      [StatsController::class, 'monthly']);          // ← tambah
    Route::post('/scan',              [ScanController::class, 'store']);
    Route::get('/scan/{id}',          [ScanController::class, 'show']);
    Route::delete('/scan/{id}/reset', [ScanController::class, 'reset']);
    Route::get('/history',            [HistoryController::class, 'index']);
    Route::get('/history/{id}',       [HistoryController::class, 'show']);
    Route::delete('/history/{id}',    [HistoryController::class, 'destroy']);
    Route::get('/daily-summary',      [HistoryController::class, 'dailySummary']);
});