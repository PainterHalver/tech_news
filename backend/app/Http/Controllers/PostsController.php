<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $fields = $request->validate([
            'per_page' => 'integer',
        ]);
        $perPage = $fields['per_page'] ?? 10;

        $posts = Post::latest()->with('publisher')
            ->withCount(['votes as votes_count', 'comments as comments_count'])
            ->paginate($perPage);

        return response()->json(['posts' => $posts], 200);
    }
}
