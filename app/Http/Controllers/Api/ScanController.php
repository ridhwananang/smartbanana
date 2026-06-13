<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Nutrition;
use App\Models\Result;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ScanController extends Controller
{
    // POST /api/scan
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
            'meal_type' => 'nullable|in:breakfast,lunch,dinner,snack',
            'serving_qty' => 'nullable|numeric|min:0.1',
        ]);

        $detectedItems = $this->analisisAI($request->file('image'));

        // Jika terjadi error koneksi atau model gagal mengenali sama sekali
        if (empty($detectedItems) || isset($detectedItems[0]['error'])) {
            return response()->json([
                'status' => 'error',
                'message' => $detectedItems[0]['error'] ?? 'Gagal menganalisis gambar makanan dengan AI',
            ], 422);
        }

        $file = $request->file('image');
        $fileName = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
        $file->move(public_path('storage/scans'), $fileName);
        $path = 'scans/'.$fileName;

        $createdResults = [];
        $savedNutritionItems = [];
        $servingQty = $request->serving_qty ?? 1;

        foreach ($detectedItems as $item) {
            // Toleran terhadap typo "rape" vs "ripe"
            $key = $item['key'];
            $altKey1 = str_replace('ripe', 'rape', $key);
            $altKey2 = str_replace('rape', 'ripe', $key);

            $nutrition = Nutrition::where('key', $key)
                ->orWhere('key', $altKey1)
                ->orWhere('key', $altKey2)
                ->first();

            // Hanya simpan jika kunci makanan ditemukan di database gizi kita
            if ($nutrition) {
                $totalCalories = $nutrition->calories * $servingQty;

                $result = Result::create([
                    'user_id' => $request->user()->id,
                    'nutrition_id' => $nutrition->id,
                    'scan_image' => $path,
                    'analisis_ai' => $item['analisis'],
                    'confidence' => $item['confidence'],
                    'serving_qty' => $servingQty,
                    'total_calories' => $totalCalories,
                    'meal_type' => $request->meal_type,
                    'consumed_at' => now()->toDateString(),
                ]);

                $createdResults[] = $result;
                $savedNutritionItems[] = $nutrition;
            }
        }

        // Jika ada pisang terdeteksi tetapi tidak ada satupun yang terdaftar di database gizi kita
        if (empty($createdResults)) {
            $firstLabel = $detectedItems[0]['key'] ?? 'unknown';

            return response()->json([
                'status' => 'error',
                'message' => 'Pisang terdeteksi ('.$firstLabel.') namun tidak ditemukan di database gizi.',
            ], 404);
        }

        // Buat nama gabungan makanan untuk pesan sukses (misal: "Nuggets, French Fries, Cola")
        $itemNames = collect($savedNutritionItems)->map(function ($nut) {
            $item = strtolower($nut->item);
            if (str_contains($item, 'fully-rape') || str_contains($item, 'fully-ripe')) {
                return 'Pisang Matang';
            }
            if (str_contains($item, 'semi-rape') || str_contains($item, 'semi-ripe')) {
                return 'Pisang Sedang';
            }
            if (str_contains($item, 'unripe')) {
                return 'Pisang Mentah';
            }
            return $nut->item;
        })->implode(', ');

        // Akumulasikan semua gizi yang terdeteksi
        $totalCalories = 0;
        $totalFat = 0;
        $totalCarbs = 0;
        $totalProtein = 0;
        $totalSugar = 0;
        $totalFiber = 0;
        $totalPotassium = 0;
        $totalMagnesium = 0;
        $totalVitaminC = 0;
        $totalVitaminB6 = 0;
        $totalSodium = 0;
        $totalCalcium = 0;
        $totalIron = 0;

        foreach ($savedNutritionItems as $nut) {
            $totalCalories += floatval($nut->calories) * floatval($servingQty);
            $totalFat += floatval($nut->fat) * floatval($servingQty);
            $totalCarbs += floatval($nut->carbs) * floatval($servingQty);
            $totalProtein += floatval($nut->protein) * floatval($servingQty);
            
            $totalSugar += floatval($nut->sugar ?? 0) * floatval($servingQty);
            $totalFiber += floatval($nut->fiber ?? 0) * floatval($servingQty);
            $totalPotassium += floatval($nut->potassium ?? 0) * floatval($servingQty);
            $totalMagnesium += floatval($nut->magnesium ?? 0) * floatval($servingQty);
            $totalVitaminC += floatval($nut->vitamin_c ?? 0) * floatval($servingQty);
            $totalVitaminB6 += floatval($nut->vitamin_b6 ?? 0) * floatval($servingQty);
            $totalSodium += floatval($nut->sodium ?? 0) * floatval($servingQty);
            $totalCalcium += floatval($nut->calcium ?? 0) * floatval($servingQty);
            $totalIron += floatval($nut->iron ?? 0) * floatval($servingQty);
        }

        // Kirimkan record pertama sebagai response primer agar cocok dengan interface React
        $primaryResult = $createdResults[0];
        $primaryResult->total_calories = $totalCalories;

        $primaryNutrition = clone $savedNutritionItems[0];
        $primaryNutrition->item = $itemNames;
        $primaryNutrition->calories = $totalCalories;
        $primaryNutrition->fat = $totalFat;
        $primaryNutrition->carbs = $totalCarbs;
        $primaryNutrition->protein = $totalProtein;
        $primaryNutrition->sugar = $totalSugar;
        $primaryNutrition->fiber = $totalFiber;
        $primaryNutrition->potassium = $totalPotassium;
        $primaryNutrition->magnesium = $totalMagnesium;
        $primaryNutrition->vitamin_c = $totalVitaminC;
        $primaryNutrition->vitamin_b6 = $totalVitaminB6;
        $primaryNutrition->sodium = $totalSodium;
        $primaryNutrition->calcium = $totalCalcium;
        $primaryNutrition->iron = $totalIron;

        return response()->json([
            'status' => 'success',
            'data' => [
                'result' => $primaryResult,
                'nutrition' => $primaryNutrition,
                'all_saved' => $createdResults,
            ],
        ], 201);
    }

    // GET /api/scans
    public function index(Request $request)
    {
        $history = Result::with('nutrition')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $history,
        ]);
    }

    // GET /api/scans/{id}
    public function show(Request $request, $id)
    {
        $result = Result::with('nutrition')
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (! $result) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data scan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $result,
        ]);
    }

    // GET /api/scans/daily-summary
    public function dailySummary(Request $request)
    {
        $summaries = Result::join('nutrition', 'result.nutrition_id', '=', 'nutrition.id')
            ->where('result.user_id', $request->user()->id)
            ->selectRaw('
                result.consumed_at as date,
                SUM(nutrition.calories * result.serving_qty) as total_calories,
                SUM(nutrition.protein * result.serving_qty) as total_protein,
                SUM(nutrition.carbs * result.serving_qty) as total_carbs,
                SUM(nutrition.fat * result.serving_qty) as total_fat,
                COUNT(result.id) as scan_count
            ')
            ->groupBy('result.consumed_at')
            ->orderBy('result.consumed_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $summaries,
        ]);
    }

    // DELETE /api/scans/{id}
    public function destroy(Request $request, $id)
    {
        $result = Result::where('user_id', $request->user()->id)->find($id);

        if (! $result) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data scan tidak ditemukan',
            ], 404);
        }

        // Hapus foto dari storage
        if ($result->scan_image) {
            $physicalPath = public_path('storage/'.$result->scan_image);
            if (file_exists($physicalPath)) {
                @unlink($physicalPath);
            }
            if (Storage::disk('public')->exists($result->scan_image)) {
                Storage::disk('public')->delete($result->scan_image);
            }
        }

        $result->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data scan berhasil dihapus',
        ]);
    }

    private function beautifyLabel(string $rawLabel): string
    {
        $cleanLabel = strtolower(trim($rawLabel));

        if (str_contains($cleanLabel, 'fully-rape') || str_contains($cleanLabel, 'fully-ripe')) {
            return 'Terdeteksi: Pisang Matang (Fully Ripe)';
        }
        if (str_contains($cleanLabel, 'semi-rape') || str_contains($cleanLabel, 'semi-ripe')) {
            return 'Terdeteksi: Pisang Sedang (Semi Ripe)';
        }
        if (str_contains($cleanLabel, 'unripe')) {
            return 'Terdeteksi: Pisang Mentah (Unripe)';
        }

        return 'Terdeteksi: ' . ucwords(str_replace(['-', '_'], ' ', $rawLabel));
    }

    private function analisisAI($image): array
    {
        $filePath = $image->getPathname();
        $fileName = $image->getClientOriginalName();

        // Ambil URL Colab API dari variabel lingkungan (.env)
        $aiApiUrl = rtrim(env('AI_API_URL', 'http://localhost:7860'), '/');
        $predictUrl = $aiApiUrl . '/predict';

        try {
            $response = Http::timeout(90)
                ->attach('file', file_get_contents($filePath), $fileName)
                ->post($predictUrl);

            if ($response->successful()) {
                return $this->parseResponse($response->json());
            }

            if ($response->status() === 503 || $response->status() === 504) {
                return [
                    ['error' => 'Server AI Colab sedang bersiap (Cold Start). Silakan tunggu 1-2 menit lalu coba unggah kembali.'],
                ];
            }

            return [
                ['error' => 'Gagal menghubungi server AI Colab (Status: '.$response->status().')'],
            ];

        } catch (ConnectionException $e) {
            return [
                ['error' => 'Koneksi gagal. Pastikan server API di Google Colab telah berjalan dan URL di file .env sudah sesuai.'],
            ];
        } catch (\Exception $e) {
            return [
                ['error' => 'Error koneksi AI: '.$e->getMessage().'. Pastikan URL Colab aktif.'],
            ];
        }
    }

    private function parseResponse(array $result): array
    {
        $items = $result['items'] ?? [];

        if (empty($items)) {
            // Jika API mengembalikan klasifikasi langsung (format non-array items)
            if (isset($result['class'])) {
                $items = [
                    [
                        'label' => $result['class'],
                        'score' => $result['confidence'] ?? 1.0
                    ]
                ];
            } else {
                return [
                    ['error' => 'Kematangan pisang tidak dapat dikenali dalam foto'],
                ];
            }
        }

        // Urutkan item berdasarkan skor kecocokan (score) tertinggi ke terendah
        usort($items, function ($a, $b) {
            $scoreA = $a['score'] ?? 0;
            $scoreB = $b['score'] ?? 0;
            if ($scoreA == $scoreB) {
                return 0;
            }

            return ($scoreA < $scoreB) ? 1 : -1;
        });

        $parsed = [];
        foreach ($items as $item) {
            $parsed[] = [
                'key' => $item['label'],
                'analisis' => $this->beautifyLabel($item['label']),
                'confidence' => (float) ($item['score'] ?? 0.0),
            ];
        }

        return $parsed;
    }
}
