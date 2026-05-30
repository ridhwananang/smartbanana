<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NutritionSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/nutrition.csv');
        $file = fopen($path, 'r');

        fgetcsv($file, 0, ';');

        while (($row = fgetcsv($file, 0, ';')) !== false) {
            if (empty($row[0])) continue;

            DB::table('nutrition')->insertOrIgnore([
                'brand'        => trim($row[0]),
                'item'         => trim($row[1]),
                'key'          => trim($row[2]),
                'serving_size' => trim($row[3]),
                'calories'     => (float) str_replace('kkal', '', trim($row[4])),
                'fat'          => (float) str_replace('g', '', trim($row[5])),
                'carbs'        => (float) str_replace('g', '', trim($row[6])),
                'protein'      => (float) str_replace('g', '', trim($row[7])),
                'sugar'        => (float) str_replace('g', '', trim($row[8] ?? 0)),
                'fiber'        => (float) str_replace('g', '', trim($row[9] ?? 0)),
                'potassium'    => (float) str_replace('mg', '', trim($row[10] ?? 0)),
                'magnesium'    => (float) str_replace('mg', '', trim($row[11] ?? 0)),
                'vitamin_c'    => (float) str_replace('mg', '', trim($row[12] ?? 0)),
                'vitamin_b6'   => (float) str_replace('mg', '', trim($row[13] ?? 0)),
                'sodium'       => (float) str_replace('mg', '', trim($row[14] ?? 0)),
                'calcium'      => (float) str_replace('mg', '', trim($row[15] ?? 0)),
                'iron'         => (float) str_replace('mg', '', trim($row[16] ?? 0)),
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }

        fclose($file);
        $this->command->info('Data nutrition berhasil diimport!');
    }
}