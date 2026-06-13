<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Nutrition;
use Illuminate\Http\Request;

class NutritionController extends Controller
{
    // GET /api/nutritions
    public function index(Request $request)
    {
        $q = $request->query('q');

        if ($q) {
            $nutrition = Nutrition::where('item', 'like', "%{$q}%")
                ->orWhere('brand', 'like', "%{$q}%")
                ->get();
        } else {
            $nutrition = Nutrition::all();
        }

        return response()->json([
            'status' => 'success',
            'total'  => $nutrition->count(),
            'data'   => $nutrition,
        ]);
    }

    // GET /api/nutrition/{key}
    public function show($key)
    {
        $nutrition = Nutrition::where('key', $key)->first();

        if (!$nutrition) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Makanan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $nutrition,
        ]);
    }

    public function store(Request $request) {}
    public function update(Request $request, string $id) {}
    public function destroy(string $id) {}
}