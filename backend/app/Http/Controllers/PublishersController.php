<?php

namespace App\Http\Controllers;

use App\Models\Publisher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublishersController extends Controller
{
    public function follow(Publisher $publisher): JsonResponse
    {
        $user = auth()->user();
        $user->followedPublishers()->toggle($publisher->id);

        return response()->json([
            'message' => 'ok',
            'data' => [
                'followed' => $user->followedPublishers()->where('publisher_id', $publisher->id)->exists(),
            ],
        ], 200);
    }
}
