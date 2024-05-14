<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbacksController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => 1,
            'data' => Feedback::all(),
        ]);
    }

    public function store(Feedback $feedback, Request $request): JsonResponse
    {
        $fields = $request->validate([
            'content' => 'required|string',
        ]);

        $feedback->fill($fields);
        $feedback->save();

        return response()->json([
            'success' => 1,
            'data' => $feedback,
        ], 201);
    }
}
