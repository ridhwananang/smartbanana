<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Result;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StatsController extends Controller
{
    // GET /api/stats
    public function index(Request $request)
    {
        $user = $request->user();
        $days = collect();

        $range = $request->query('range', 'weekly');
        if ($range === 'monthly') {
            $subDays = 29;
            $dateFormat = 'D MMM';
        } else {
            $subDays = 6;
            $dateFormat = 'ddd';
        }

        $startDate = Carbon::today()->subDays($subDays)->toDateString();
        $endDate = Carbon::today()->toDateString();

        // Ambil data rangkuman harian dari tabel result join nutrition
        $summaries = Result::join('nutrition', 'result.nutrition_id', '=', 'nutrition.id')
            ->where('result.user_id', $user->id)
            ->whereBetween('result.consumed_at', [$startDate, $endDate])
            ->selectRaw('
                result.consumed_at as date,
                SUM(nutrition.calories * result.serving_qty) as total_calories,
                SUM(nutrition.protein * result.serving_qty) as total_protein,
                SUM(nutrition.carbs * result.serving_qty) as total_carbs,
                SUM(nutrition.fat * result.serving_qty) as total_fat,
                COUNT(result.id) as scan_count
            ')
            ->groupBy('result.consumed_at')
            ->get()
            ->keyBy('date');

        // Generate hari terakhir
        for ($i = $subDays; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i)->toDateString();
            $daySummary = $summaries->get($date);

            $days->push([
                'date'           => $date,
                'day'            => Carbon::parse($date)->locale('id')->isoFormat($dateFormat),
                'total_calories' => (float)($daySummary->total_calories ?? 0),
                'total_protein'  => (float)($daySummary->total_protein ?? 0),
                'total_carbs'    => (float)($daySummary->total_carbs ?? 0),
                'total_fat'      => (float)($daySummary->total_fat ?? 0),
                'scan_count'     => (int)($daySummary->scan_count ?? 0),
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $days,
        ]);
    }
}