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
            }]);

        $user = Auth::guard('sanctum')->user();
        if ($user) {
            $posts->selectRaw('votes.value as user_vote')
                ->leftJoin('votes', function ($join) use ($user) {
                    $join->on('votes.post_id', '=', 'posts.id')
                        ->where('votes.user_id', '=', $user->id);
                });
        }

        $posts = $posts->paginate($perPage);

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
            $post->user_vote = $post->votes()->where('user_id', $user->id)->first()->value ?? null;
        }

        return response()->json($post, 200);
    }

    public function vote(Post $post, Request $request): JsonResponse
    {
        $fields = $request->validate([
            'value' => 'required|integer|in:1,0,-1',
        ]);
        $value = $fields['value'];

        $user = $request->user();
        $vote = $post->votes()->where('user_id', $user->id)->first();
        if ($vote) {
            $vote->update([
                'value' => $value,
            ]);
        } else {
            $vote = $post->votes()->create([
                'user_id' => $user->id,
                'value' => $value,
            ]);
        }

        return response()->json($vote, 200);
    }
}
