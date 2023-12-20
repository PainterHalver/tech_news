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
    Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
});

Route::prefix('posts')->group(function() {
    Route::get('/', [PostsController::class, 'index']);
    Route::get('/{post}', [PostsController::class, 'show']);
    Route::get('/{post}/comments', [PostsController::class, 'getPostComments']);

    Route::middleware('auth:sanctum')->group(function() {
       Route::post('/{post}/votes', [PostsController::class, 'vote']);
       Route::post('/{post}/comments', [PostsController::class, 'comment']);
    });
});
