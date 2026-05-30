<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nutrition extends Model
{
    protected $table = 'nutrition';

    protected $fillable = [
        'brand', 'item', 'key', 'serving_size',
        'calories', 'fat', 'carbs', 'protein',
        'sugar', 'fiber', 'potassium', 'magnesium',
        'vitamin_c', 'vitamin_b6', 'sodium', 'calcium', 'iron',
    ];

    public function results()
    {
        return $this->hasMany(\App\Models\Result::class);
    }
}
