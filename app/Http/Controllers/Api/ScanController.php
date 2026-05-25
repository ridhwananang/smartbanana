<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Nutrition;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class ScanController extends Controller
{
    // POST /api/scan
    public function store(Request $request)
    {
        $request->validate([
            'image'       => 'required|image|max:5120',
            'meal_type'   => 'nullable|in:breakfast,lunch,dinner,snack',
            'serving_qty' => 'nullable|numeric|min:0.1',
        ]);

        $path = $request->file('image')->store('scans', 'public');
        $detectedItems = $this->analisisAI($request->file('image'));

        // Jika terjadi error koneksi atau model gagal mengenali sama sekali
        if (empty($detectedItems) || isset($detectedItems[0]['error'])) {
            return response()->json([
                'status'  => 'error',
                'message' => $detectedItems[0]['error'] ?? 'Gagal menganalisis gambar makanan dengan AI',
            ], 422);
        }

        $createdResults = [];
        $savedNutritionItems = [];
        $servingQty = $request->serving_qty ?? 1;

        foreach ($detectedItems as $item) {
            $nutrition = Nutrition::where('key', $item['key'])->first();

            // Hanya simpan jika kunci makanan ditemukan di database gizi kita
            if ($nutrition) {
                $totalCalories = $nutrition->calories * $servingQty;

                $result = Result::create([
                    'user_id'        => $request->user()->id,
                    'nutrition_id'   => $nutrition->id,
                    'scan_image'     => $path,
                    'analisis_ai'    => $item['analisis'],
                    'confidence'     => $item['confidence'],
                    'serving_qty'    => $servingQty,
                    'total_calories' => $totalCalories,
                    'meal_type'      => $request->meal_type,
                    'consumed_at'    => now()->toDateString(),
                ]);

                $createdResults[] = $result;
                $savedNutritionItems[] = $nutrition;
            }
        }

        // Jika ada makanan terdeteksi tetapi tidak ada satupun yang terdaftar di database gizi kita
        if (empty($createdResults)) {
            $firstLabel = $detectedItems[0]['key'] ?? 'unknown';
            return response()->json([
                'status'  => 'error',
                'message' => 'Makanan terdeteksi (' . $firstLabel . ') namun tidak ditemukan di database gizi.',
            ], 404);
        }

        // Buat nama gabungan makanan untuk pesan sukses (misal: "Nuggets, French Fries, Cola")
        $itemNames = collect($savedNutritionItems)->map(function ($nut) {
            return $nut->item;
        })->implode(', ');

        // Kirimkan record pertama sebagai response primer agar cocok dengan interface React
        $primaryResult = $createdResults[0];
        $primaryNutrition = clone $savedNutritionItems[0];
        $primaryNutrition->item = $itemNames;

        return response()->json([
            'status' => 'success',
            'data'   => [
                'result'    => $primaryResult,
                'nutrition' => $primaryNutrition,
                'all_saved' => $createdResults,
            ],
        ], 201);
    }

    // GET /api/scan/{id}
    public function show(Request $request, $id)
    {
        $result = Result::with('nutrition')
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (!$result) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Data scan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $result,
        ]);
    }

    // DELETE /api/scan/{id}/reset
    public function reset(Request $request, $id)
    {
        $result = Result::where('user_id', $request->user()->id)->find($id);

        if (!$result) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Data scan tidak ditemukan',
            ], 404);
        }

        // Hapus foto dari storage
        if ($result->scan_image && Storage::disk('public')->exists($result->scan_image)) {
            Storage::disk('public')->delete($result->scan_image);
        }

        $result->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Scan berhasil direset, silakan scan ulang',
        ]);
    }

    private function analisisAI($image): array
    {
        $filePath = $image->getPathname();
        $fileName = $image->getClientOriginalName();

        // Panggil API cloud Hugging Face secara langsung
        try {
            $response = Http::timeout(30)
                ->attach('file', file_get_contents($filePath), $fileName)
                ->post('https://galihkjaya-nutrivision-api.hf.space/predict');

            if ($response->successful()) {
                return $this->parseResponse($response->json());
            }

            return [
                ['error' => 'Gagal menghubungi server AI cloud (Status: ' . $response->status() . ')']
            ];

        } catch (\Exception $e) {
            return [
                ['error' => 'Error koneksi AI: ' . $e->getMessage() . '. Pastikan Space hf.co aktif.']
            ];
        }
    }

    private function parseResponse(array $result): array
    {
        $items = $result['items'] ?? [];

        if (empty($items)) {
            return [
                ['error' => 'Makanan tidak dikenali dalam foto']
            ];
        }

        // Urutkan item berdasarkan skor kecocokan (score) tertinggi ke terendah
        usort($items, function ($a, $b) {
            $scoreA = $a['score'] ?? 0;
            $scoreB = $b['score'] ?? 0;
            if ($scoreA == $scoreB) return 0;
            return ($scoreA < $scoreB) ? 1 : -1;
        });

        $parsed = [];
        foreach ($items as $item) {
            $parsed[] = [
                'key'        => $item['label'],
                'analisis'   => 'Terdeteksi: ' . ucwords(str_replace('-', ' ', $item['label'])),
                'confidence' => (float)($item['score'] ?? 0.0),
            ];
        }

        return $parsed;
    }

}