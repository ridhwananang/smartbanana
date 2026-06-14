<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
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
    $driver = config("filesystems.disks.{$disk}.driver", 'local');
    
    if ($driver === 's3') {
        return redirect(Storage::disk($disk)->url($path));
    }
    
    if (Storage::disk('public')->exists($path)) {
        return Storage::disk('public')->response($path);
    }
    
    abort(404);
})->where('path', '.*');

Route::get('/test-storage', function () {
    $disk = config('filesystems.default');
    $s3Config = config('filesystems.disks.s3');
    $publicConfig = config('filesystems.disks.public');
    
    if (isset($s3Config['key'])) {
        $s3Config['key'] = substr($s3Config['key'], 0, 4) . '***';
    }
    if (isset($s3Config['secret'])) {
        $s3Config['secret'] = '***';
    }
    if (isset($publicConfig['key'])) {
        $publicConfig['key'] = substr($publicConfig['key'], 0, 4) . '***';
    }
    if (isset($publicConfig['secret'])) {
        $publicConfig['secret'] = '***';
    }
    
    $publicFiles = [];
    try {
        $publicFiles = Storage::disk('public')->files('scans');
    } catch (\Exception $e) {
        $publicFiles = 'Error listing public files: ' . $e->getMessage();
    }
    
    $s3Files = [];
    try {
        $s3Files = Storage::disk('s3')->files('scans');
    } catch (\Exception $e) {
        $s3Files = 'Error listing s3 files: ' . $e->getMessage();
    }
    
    $publicTemporaryUrl = 'Not supported';
    try {
        $publicTemporaryUrl = Storage::disk('public')->temporaryUrl('scans/1781466037_6a2f03b50d20c.png', now()->addMinutes(60));
    } catch (\Exception $e) {
        $publicTemporaryUrl = 'Error: ' . $e->getMessage();
    }
    
    return [
        'default_disk' => $disk,
        's3_config' => $s3Config,
        'public_config' => $publicConfig,
        's3_url_test' => Storage::disk('s3')->url('scans/test.png'),
        'public_url_test' => Storage::disk('public')->url('scans/test.png'),
        'public_temporary_url_test' => $publicTemporaryUrl,
        'public_files' => $publicFiles,
        's3_files' => $s3Files,
    ];
});

require __DIR__.'/settings.php';
