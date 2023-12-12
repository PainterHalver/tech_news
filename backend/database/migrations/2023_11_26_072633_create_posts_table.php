<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publisher_id')->constrained('publishers');
//            $table->string('hash')->unique()->comment('random hash to use instead of id');
            $table->text('title');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('link')->nullable();
            $table->dateTime('published_at')->nullable();
            $table->timestamps();

            $table->index(['publisher_id']);
//            $table->index(['hash']);
            $table->index(['published_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
