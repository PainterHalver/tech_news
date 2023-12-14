<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $fields = $request->validate([
            'per_page' => 'integer',
        ]);
        $perPage = $fields['per_page'] ?? 10;

        $posts = Post::latest()->with('publisher')
            ->withCount(['comments as comments_count'])
            ->withCount(['votes as votes_score' => function ($query) {
                $query->selectRaw('sum(votes.value)');
            }])
            ->paginate($perPage);

        return response()->json($posts, 200);
    }

    public function show(Post $post): JsonResponse
    {
        $post->load('publisher');
        $post->loadCount('comments as comments_count');
        $post->loadCount(['votes as votes_score' => function ($query) {
            $query->selectRaw('sum(votes.value)');
        }]);

        // if logged in user, check if voted
        $user = Auth::guard('sanctum')->user();
        if ($user) {
            $post->user_vote = $post->votes()->where('user_id', $user->id)->first()->value ?? 0;
        }

        return response()->json($post, 200);
    }
}
