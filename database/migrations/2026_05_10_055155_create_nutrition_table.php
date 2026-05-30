<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nutrition', function (Blueprint $table) {
            $table->id();
            $table->string('brand');
            $table->string('item');
            $table->string('key')->unique();
            $table->string('serving_size');
            $table->decimal('calories', 8, 2);
            $table->decimal('fat', 8, 2);
            $table->decimal('carbs', 8, 2);
            $table->decimal('protein', 8, 2);
            $table->decimal('sugar', 8, 2)->default(0);
            $table->decimal('fiber', 8, 2)->default(0);
            $table->decimal('potassium', 8, 2)->default(0);
            $table->decimal('magnesium', 8, 2)->default(0);
            $table->decimal('vitamin_c', 8, 2)->default(0);
            $table->decimal('vitamin_b6', 8, 2)->default(0);
            $table->decimal('sodium', 8, 2)->default(0);
            $table->decimal('calcium', 8, 2)->default(0);
            $table->decimal('iron', 8, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nutrition');
    }
};
