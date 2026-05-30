<?php

use App\Models\User;
use App\Models\Nutrition;
use App\Models\Result;
use Carbon\Carbon;

test('dashboard dynamic summary calculates correctly based on scans', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    // Create a nutrition item
    $nutrition = Nutrition::create([
        'brand' => 'Brand A',
        'item' => 'Food Item 1',
        'key' => 'food-1',
        'serving_size' => '100g',
        'calories' => 250,
        'fat' => 10,
        'carbs' => 30,
        'protein' => 15,
    ]);

    // Create two scan results for today
    Result::create([
        'user_id' => $user->id,
        'nutrition_id' => $nutrition->id,
        'scan_image' => 'dummy.jpg',
        'analisis_ai' => 'Dummy analysis',
        'confidence' => 0.95,
        'serving_qty' => 2, // 2 * 250 = 500 kcal, fat=20g, carbs=60g, protein=30g
        'total_calories' => 500,
        'meal_type' => 'breakfast',
        'consumed_at' => now()->toDateString(),
    ]);

    Result::create([
        'user_id' => $user->id,
        'nutrition_id' => $nutrition->id,
        'scan_image' => 'dummy2.jpg',
        'analisis_ai' => 'Dummy analysis 2',
        'confidence' => 0.90,
        'serving_qty' => 1, // 1 * 250 = 250 kcal, fat=10g, carbs=30g, protein=15g
        'total_calories' => 250,
        'meal_type' => 'lunch',
        'consumed_at' => now()->toDateString(),
    ]);

    // Call /api/dashboard
    $response = $this->getJson('/api/dashboard');

    $response->assertOk()
        ->assertJsonPath('data.summary.total_calories', 750)
        ->assertJsonPath('data.summary.total_protein', 45)
        ->assertJsonPath('data.summary.total_carbs', 90)
        ->assertJsonPath('data.summary.total_fat', 30)
        ->assertJsonPath('data.summary.scan_count', 2);
});

test('weekly and monthly stats return correct dynamic calculations', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $nutrition = Nutrition::create([
        'brand' => 'Brand A',
        'item' => 'Food Item 1',
        'key' => 'food-1',
        'serving_size' => '100g',
        'calories' => 100,
        'fat' => 5,
        'carbs' => 20,
        'protein' => 10,
    ]);

    // Consumed yesterday
    Result::create([
        'user_id' => $user->id,
        'nutrition_id' => $nutrition->id,
        'scan_image' => 'dummy.jpg',
        'analisis_ai' => 'Analysis',
        'confidence' => 0.9,
        'serving_qty' => 3,
        'total_calories' => 300,
        'meal_type' => 'dinner',
        'consumed_at' => Carbon::yesterday()->toDateString(),
    ]);

    // Weekly stats call
    $responseWeekly = $this->getJson('/api/stats/weekly');
    $responseWeekly->assertOk();

    // Verify yesterday's data exists and is correct in the weekly list
    $yesterdayDate = Carbon::yesterday()->toDateString();
    $yesterdayData = collect($responseWeekly->json('data'))->firstWhere('date', $yesterdayDate);
    expect($yesterdayData)->not->toBeNull();
    expect($yesterdayData['total_calories'])->toEqual(300);
    expect($yesterdayData['total_protein'])->toEqual(30);
    expect($yesterdayData['total_carbs'])->toEqual(60);
    expect($yesterdayData['total_fat'])->toEqual(15);
    expect($yesterdayData['scan_count'])->toEqual(1);
});

test('daily-summary history dynamic endpoint returns correct values', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $nutrition = Nutrition::create([
        'brand' => 'Brand A',
        'item' => 'Food Item 1',
        'key' => 'food-1',
        'serving_size' => '100g',
        'calories' => 100,
        'fat' => 5,
        'carbs' => 20,
        'protein' => 10,
    ]);

    Result::create([
        'user_id' => $user->id,
        'nutrition_id' => $nutrition->id,
        'scan_image' => 'dummy.jpg',
        'analisis_ai' => 'Analysis',
        'confidence' => 0.9,
        'serving_qty' => 1.5,
        'total_calories' => 150,
        'meal_type' => 'snack',
        'consumed_at' => Carbon::yesterday()->toDateString(),
    ]);

    $response = $this->getJson('/api/daily-summary');
    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.date', Carbon::yesterday()->toDateString())
        ->assertJsonPath('data.0.total_calories', 150)
        ->assertJsonPath('data.0.total_protein', 15)
        ->assertJsonPath('data.0.total_carbs', 30)
        ->assertJsonPath('data.0.total_fat', 7.5)
        ->assertJsonPath('data.0.scan_count', 1);
});

test('scan controller supports multi food detection and stores all items in database', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    // Create some banana nutrition items
    $fullyRape = Nutrition::create([
        'brand' => 'banana',
        'item' => 'fully-rape',
        'key' => 'banana-fully-rape',
        'serving_size' => '1-buah(100g)',
        'calories' => 89,
        'fat' => 0.3,
        'carbs' => 22.8,
        'protein' => 1.1,
        'sugar' => 12.2,
        'fiber' => 2.6,
    ]);

    $semiRape = Nutrition::create([
        'brand' => 'banana',
        'item' => 'semi-rape',
        'key' => 'banana-semi-rape',
        'serving_size' => '1-buah(100g)',
        'calories' => 92,
        'fat' => 0.3,
        'carbs' => 23.5,
        'protein' => 1.1,
        'sugar' => 8.5,
        'fiber' => 3.5,
    ]);

    // Mock the HTTP request to the AI model
    $predictUrl = rtrim(env('AI_API_URL', 'http://localhost:7860'), '/') . '/predict';
    Http::fake([
        $predictUrl => Http::response([
            'items' => [
                ['label' => 'banana-fully-rape', 'score' => 0.95],
                ['label' => 'banana-semi-rape', 'score' => 0.80],
            ]
        ], 200),
    ]);

    // Send request with dummy image
    $file = \Illuminate\Http\UploadedFile::fake()->image('banana_meal.jpg');
    $response = $this->postJson('/api/scan', [
        'image' => $file,
        'meal_type' => 'lunch',
        'serving_qty' => 1,
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('status', 'success')
        ->assertJsonPath('data.nutrition.item', 'Pisang Matang, Pisang Sedang'); // Verifies name joining in Indonesian!

    // Verify 2 results were created in the database
    $this->assertDatabaseCount('result', 2);
    $this->assertDatabaseHas('result', [
        'nutrition_id' => $fullyRape->id,
        'meal_type' => 'lunch',
    ]);
    $this->assertDatabaseHas('result', [
        'nutrition_id' => $semiRape->id,
        'meal_type' => 'lunch',
    ]);
});

