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

        return response()->json($posts, 200);
    }

    public function show(Post $post): JsonResponse
    {
        $post->load('publisher');
        $post->loadCount(['votes as votes_count', 'comments as comments_count']);

        return response()->json($post, 200);
    }
}
