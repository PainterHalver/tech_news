<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostsController;

Route::get('/health_check', function () {
    return response()->json(['message' => 'ok'], 200);
});

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::middleware('auth:sanctum')->delete('/logout', [AuthController::class, 'logout']);
});

Route::prefix('posts')->group(function() {
    Route::get('/', [PostsController::class, 'index']);
    Route::get('/{post}', [PostsController::class, 'show']);
});
