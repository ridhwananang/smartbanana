<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Result;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // GET /api/dashboard
    public function index(Request $request)
    {
        $user  = $request->user();
        $today = now()->toDateString();

        // Summary hari ini secara dinamis dari tabel result join nutrition
        $summaryData = Result::join('nutrition', 'result.nutrition_id', '=', 'nutrition.id')
            ->where('result.user_id', $user->id)
            ->whereDate('result.consumed_at', $today)
            ->selectRaw('
                SUM(nutrition.calories * result.serving_qty) as total_calories,
                SUM(nutrition.protein * result.serving_qty) as total_protein,
                SUM(nutrition.carbs * result.serving_qty) as total_carbs,
                SUM(nutrition.fat * result.serving_qty) as total_fat,
                SUM(nutrition.sugar * result.serving_qty) as total_sugar,
                SUM(nutrition.fiber * result.serving_qty) as total_fiber,
                SUM(nutrition.potassium * result.serving_qty) as total_potassium,
                SUM(nutrition.magnesium * result.serving_qty) as total_magnesium,
                SUM(nutrition.vitamin_c * result.serving_qty) as total_vitamin_c,
                SUM(nutrition.vitamin_b6 * result.serving_qty) as total_vitamin_b6,
                SUM(nutrition.sodium * result.serving_qty) as total_sodium,
                SUM(nutrition.calcium * result.serving_qty) as total_calcium,
                SUM(nutrition.iron * result.serving_qty) as total_iron,
                COUNT(result.id) as scan_count
            ')
            ->first();

        $summary = (object)[
            'total_calories'   => (float)($summaryData->total_calories ?? 0),
            'total_protein'    => (float)($summaryData->total_protein ?? 0),
            'total_carbs'      => (float)($summaryData->total_carbs ?? 0),
            'total_fat'        => (float)($summaryData->total_fat ?? 0),
            'total_sugar'      => (float)($summaryData->total_sugar ?? 0),
            'total_fiber'      => (float)($summaryData->total_fiber ?? 0),
            'total_potassium'  => (float)($summaryData->total_potassium ?? 0),
            'total_magnesium'  => (float)($summaryData->total_magnesium ?? 0),
            'total_vitamin_c'  => (float)($summaryData->total_vitamin_c ?? 0),
            'total_vitamin_b6' => (float)($summaryData->total_vitamin_b6 ?? 0),
            'total_sodium'     => (float)($summaryData->total_sodium ?? 0),
            'total_calcium'    => (float)($summaryData->total_calcium ?? 0),
            'total_iron'       => (float)($summaryData->total_iron ?? 0),
            'scan_count'       => (int)($summaryData->scan_count ?? 0),
        ];

        // Scan terakhir hari ini
        $recentScans = Result::with('nutrition')
            ->where('user_id', $user->id)
            ->whereDate('consumed_at', $today)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Target kalori default 2000
        $calorieGoal = 2000;
        $calorieLeft = $calorieGoal - ($summary->total_calories ?? 0);

        return response()->json([
            'status' => 'success',
            'data'   => [
                'date'          => $today,
                'calorie_goal'  => $calorieGoal,
                'calorie_left'  => max(0, $calorieLeft),
                'summary'       => $summary ?? [
                    'total_calories' => 0,
                    'total_protein'  => 0,
                    'total_carbs'    => 0,
                    'total_fat'      => 0,
                    'total_sugar'    => 0,
                    'total_fiber'    => 0,
                    'total_potassium'=> 0,
                    'total_magnesium'=> 0,
                    'total_vitamin_c'=> 0,
                    'total_vitamin_b6'=>0,
                    'scan_count'     => 0,
                ],
                'recent_scans'  => $recentScans,
                'macros' => [
                    'protein' => [
                        'value'   => $summary->total_protein ?? 0,
                        'goal'    => 50,
                        'unit'    => 'g',
                    ],
                    'carbs' => [
                        'value'   => $summary->total_carbs ?? 0,
                        'goal'    => 300,
                        'unit'    => 'g',
                    ],
                    'fat' => [
                        'value'   => $summary->total_fat ?? 0,
                        'goal'    => 65,
                        'unit'    => 'g',
                    ],
                    'sugar' => [
                        'value'   => $summary->total_sugar ?? 0,
                        'goal'    => 50,
                        'unit'    => 'g',
                    ],
                    'fiber' => [
                        'value'   => $summary->total_fiber ?? 0,
                        'goal'    => 30,
                        'unit'    => 'g',
                    ],
                    'potassium' => [
                        'value'   => $summary->total_potassium ?? 0,
                        'goal'    => 3500,
                        'unit'    => 'mg',
                    ],
                    'magnesium' => [
                        'value'   => $summary->total_magnesium ?? 0,
                        'goal'    => 400,
                        'unit'    => 'mg',
                    ],
                    'vitamin_c' => [
                        'value'   => $summary->total_vitamin_c ?? 0,
                        'goal'    => 90,
                        'unit'    => 'mg',
                    ],
                    'vitamin_b6' => [
                        'value'   => $summary->total_vitamin_b6 ?? 0,
                        'goal'    => 1.3,
                        'unit'    => 'mg',
                    ],
                    'sodium' => [
                        'value'   => $summary->total_sodium ?? 0,
                        'goal'    => 1500,
                        'unit'    => 'mg',
                    ],
                    'calcium' => [
                        'value'   => $summary->total_calcium ?? 0,
                        'goal'    => 1000,
                        'unit'    => 'mg',
                    ],
                    'iron' => [
                        'value'   => $summary->total_iron ?? 0,
                        'goal'    => 18,
                        'unit'    => 'mg',
                    ],
                ],
            ],
        ]);
    }
}