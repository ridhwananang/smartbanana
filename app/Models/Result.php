<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Result extends Model
{
    protected $table = 'result';

    protected $fillable = [
        'user_id', 'nutrition_id', 'scan_image',
        'analisis_ai', 'confidence', 'serving_qty',
        'total_calories', 'meal_type', 'consumed_at',
    ];

    public function getScanImageAttribute($value)
    {
        if (empty($value)) {
            return null;
        }

        // Jika sudah berupa URL lengkap (http/https)
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        $disk = (config('filesystems.default') === 's3' || env('FILESYSTEM_DISK') === 's3') ? 's3' : 'public';
        $driver = config("filesystems.disks.{$disk}.driver", 'local');

        if ($driver === 's3') {
            return Storage::disk($disk)->url($value);
        }

        return $value;
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function nutrition()
    {
        return $this->belongsTo(\App\Models\Nutrition::class);
    }
}
