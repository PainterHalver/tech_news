<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\PublishersController;

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
    Route::middleware('auth:sanctum')->group(function() {
        Route::get('/history', [PostsController::class, 'history']);
        Route::post('/{post}/votes', [PostsController::class, 'vote']);
        Route::post('/{post}/comments', [PostsController::class, 'comment']);
        Route::post('/{post}/bookmarks', [PostsController::class, 'toggleBookmark']);
        Route::post('{post}/views', [PostsController::class, 'view']);
    });

    Route::get('/', [PostsController::class, 'index']);
    Route::get('/{post}', [PostsController::class, 'show']);
    Route::get('/{post}/comments', [PostsController::class, 'getPostComments']);
});

Route::prefix('publishers')->group(function() {
   Route::middleware('auth:sanctum')->group(function() {
      Route::post('/{publisher}/follows', [PublishersController::class, 'follow']);
   });
});
