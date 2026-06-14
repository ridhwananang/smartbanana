<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Api\ScanController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NutritionController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\ChatController;


Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('/auth/google', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

// API routes under the web middleware group
Route::prefix('api')->group(function () {
    // Public API routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login',    [AuthController::class, 'login']);
    });

    Route::post('/chats', [ChatController::class, 'store'])->middleware('throttle:30,1');
    Route::post('/chat',  [ChatController::class, 'store'])->middleware('throttle:30,1'); // Both singular and plural to be safe
    Route::get('/nutritions',        [NutritionController::class, 'index']);
    Route::get('/nutritions/{key}',  [NutritionController::class, 'show']);

    // Protected API routes (using standard web auth instead of auth:sanctum)
    Route::middleware(['auth', 'verified'])->group(function () {
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
});

// Route to serve/redirect public storage files (useful when public disk is mapped to S3 in production)
Route::get('/storage/{path}', function ($path) {
    $disk = (config('filesystems.default') === 's3' || env('FILESYSTEM_DISK') === 's3') ? 's3' : 'public';
    
    if ($disk === 's3') {
        return redirect(Storage::disk('s3')->url($path));
    }
    
    if (Storage::disk('public')->exists($path)) {
        return Storage::disk('public')->response($path);
    }
    
    abort(404);
})->where('path', '.*');

require __DIR__.'/settings.php';
