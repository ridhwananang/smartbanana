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

        // Jika sudah berupa URL lengkap (http/https), langsung kembalikan
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        try {
            // Gunakan disk yang dikonfigurasi di env (FILESYSTEM_DISK)
            // Di Laravel Cloud production: s3 | Di local/Herd: local atau public
            $disk = config('filesystems.default', 'public');

            // 'local' disk bersifat private, fallback ke 'public' untuk serve file
            if ($disk === 'local') {
                $disk = 'public';
            }

            $driver = config("filesystems.disks.{$disk}.driver", 'local');

            if ($driver === 's3') {
                // S3/R2: generate presigned temporary URL (berlaku 24 jam)
                return Storage::disk($disk)->temporaryUrl($value, now()->addHours(24));
            }

            // Local/public disk: generate URL via Storage facade (mendukung symlink)
            return Storage::disk($disk)->url($value);
        } catch (\Exception $e) {
            logger()->error('Error generating scan image URL: ' . $e->getMessage());
            // Fallback: kembalikan path relatif agar frontend tetap bisa coba render
            return $value;
        }
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
