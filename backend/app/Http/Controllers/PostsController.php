<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PostsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $fields = $request->validate([
            'per_page' => 'integer',
        ]);
        $perPage = $fields['per_page'] ?? 10;

        $posts = Post::with('publisher')
            ->withCount(['comments as comments_count'])
            ->addSelect([
                'votes_score' => DB::table('votes')
                    ->selectRaw('CAST(IFNULL(SUM(value), 0) AS INTEGER)')
                    ->whereColumn('post_id', 'posts.id'),
            ])->orderBy('published_at', 'desc');

        $user = Auth::guard('sanctum')->user();
        if ($user) {
            $posts->addSelect([
                'user_vote' => DB::table('votes')
                    ->selectRaw('IFNULL(value, 0)')
                    ->whereColumn('post_id', 'posts.id')
                    ->where('user_id', $user->id)
                    ->limit(1),
            ]);
        }

        $posts = $posts->paginate($perPage);

        return response()->json($posts, 200);
    }

    public function show(Post $post): JsonResponse
    {
        $post->load('publisher');
        $post->loadCount('comments as comments_count');
        $post->votes_score = $post->votes()->sum('value');

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

    public function getPostComments(Post $post, Request $request): JsonResponse
    {
        $fields = $request->validate([
            'per_page' => 'integer',
        ]);
        $perPage = $fields['per_page'] ?? 10;

        $comments = Comment::latest()
            ->where('post_id', $post->id)
            ->with('user')
            ->paginate($perPage);

        return response()->json($comments, 200);
    }

    public function comment(Post $post, Request $request): JsonResponse
    {
        $fields = $request->validate([
            'content' => 'required|string',
            'parent_id' => 'integer|exists:comments,id',
        ]);
        $content = $fields['content'];
        $parentId = $fields['parent_id'] ?? null;

        $user = $request->user();
        $comment = $post->comments()->create([
            'user_id' => $user->id,
            'content' => $content,
            'parent_id' => $parentId,
        ]);
        $comment->load('user');

        return response()->json($comment, 200);
    }
}
