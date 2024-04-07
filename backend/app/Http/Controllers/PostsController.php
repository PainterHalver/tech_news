<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\View;
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
            'bookmark' => 'boolean',
            'sort_by' => 'string|in:votes_score,comments_count,published_at',
            'sort_time' => 'string|in:week,month,year,all',
            'followed' => 'boolean',
            'search' => '',
        ]);
        $perPage = $fields['per_page'] ?? 10;
        $bookmark = $fields['bookmark'] ?? false;
        $sortBy = $fields['sort_by'] ?? 'published_at';
        $sortTime = $fields['sort_time'] ?? 'all';
        $followed = $fields['followed'] ?? false;
        $search = $fields['search'] ?? '';

        $posts = Post::select(['id', 'publisher_id', 'title', 'description', 'image', 'link', 'published_at', 'description_generated'])
            ->with('publisher')
            ->withCount(['comments as comments_count'])
            ->addSelect([
                'votes_score' => DB::table('votes')
                    ->selectRaw('CAST(IFNULL(SUM(value), 0) AS SIGNED)')
                    ->whereColumn('post_id', 'posts.id'),
            ]);

        $user = Auth::guard('sanctum')->user();
        if ($user) {
            $posts->addSelect([
                'user_vote' => DB::table('votes')
                    ->selectRaw('IFNULL(value, 0)')
                    ->whereColumn('post_id', 'posts.id')
                    ->where('user_id', $user->id)
                    ->limit(1),
            ]);

            if ($bookmark) {
                $posts->whereHas('bookmarkedUsers', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                });
            }
        }

        // SEARCH BY TITLE
        $words = explode(' ', $search);
        foreach ($words as $word) {
            $posts->where('title', 'like', '%'.$word.'%');
        }

        // SORT
        if ($sortTime !== 'all') {
            $posts->where('published_at', '>=', now()->sub($sortTime, 1))
                ->orderBy($sortBy, 'desc')->orderBy('published_at', 'desc');
        } else {
            $posts->orderBy('published_at', 'desc');
        }

        // Get only followed publishers
        if ($followed) {
            $posts->whereIn('publisher_id', function (Builder $query) use ($user) {
                $query->select('publisher_id')
                    ->from('follows')
                    ->where('user_id', $user->id);
            });
        }

        $posts = $posts->paginate($perPage);

        return response()->json($posts, 200);
    }

    public function show(Post $post): JsonResponse
    {
        $post->load('publisher');
        $post->loadCount('comments as comments_count');
        $post->votes_score = (int) $post->votes()->sum('value');

        // if logged in user, check if voted
        $user = Auth::guard('sanctum')->user();
        if ($user) {
            $post->user_vote = $post->votes()->where('user_id', $user->id)->first()->value ?? null;
            $post->user_bookmarked = $post->bookmarkedUsers()->where('user_id', $user->id)->exists();
            $post->publisher->user_followed = $post->publisher->followingUsers()->where('user_id', $user->id)->exists();
        }

        return response()->json($post, 200);
    }

    /**
     * Every body also read feature
     */
    public function recommend(Post $post, Request $request): JsonResponse
    {
        $user_viewed_this_post_ids = $post->views()->pluck('user_id');
        $views = View::select(['views.post_id', 'posts.title','posts.published_at'])
            ->selectRaw('COUNT(*) as views_count')
            ->join('posts', 'views.post_id', '=', 'posts.id')
            ->whereIn('views.user_id', $user_viewed_this_post_ids)
            ->where('views.post_id', '!=', $post->id)
            ->groupBy('views.post_id')
            ->orderBy('views_count', 'desc')
            ->limit(10)
            ->with('publisher')
            ->get();

        return response()->json($views, 200);
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

    public function toggleBookmark(Post $post, Request $request): JsonResponse
    {
        $user = $request->user();
        $bookmarked = $post->bookmarkedUsers()->where('user_id', $user->id)->exists();
        if ($bookmarked) {
            $post->bookmarkedUsers()->detach($user->id);
        } else {
            $post->bookmarkedUsers()->attach($user->id);
        }

        return response()->json([
            'success' => 1,
            'data' => [
                'bookmarked' => !$bookmarked,
            ],
        ], 200);
    }

    public function view(Post $post, Request $request): JsonResponse
    {
        $user = $request->user();
        $view = $post->views()->where('user_id', $user->id)->first();
        if ($view) {
            $view->touch();
        } else {
            $view = $post->views()->create([
                'user_id' => $user->id,
            ]);
        }

        return response()->json($view, 200);
    }

    public function history(Request $request): JsonResponse
    {
        $user = $request->user();
        $posts = $user->viewedPosts()
            ->with('publisher')
            ->withCount(['comments as comments_count'])
            ->addSelect([
                'votes_score' => DB::table('votes')
                    ->selectRaw('CAST(IFNULL(SUM(value), 0) AS SIGNED)')
                    ->whereColumn('post_id', 'posts.id'),
            ])->orderBy('views.updated_at', 'desc')
            ->get();

        return response()->json($posts, 200);
    }

    // ADMIN ACTIONS
    public function update(Post $post, Request $request): JsonResponse
    {
        $fields = $request->validate([
            'title' => 'string|min:3',
            'description' => 'string|nullable',
            'image' => 'string|nullable',
            'link' => 'string|nullable',
            'description_generated' => 'string|nullable',
        ]);

        // update non-null fields
        foreach ($fields as $key => $value) {
            if ($value && $value !== '') {
                $post->$key = $value;
            }
        }
        $post->save();
        $post->publisher;
        $post->votes_score = (int) $post->votes()->sum('value');
        $post->loadCount('comments as comments_count');

        return response()->json([
            'success' => 1,
            'data' => [
                'post' => $post,
            ],
        ], 200);
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json([
            'success' => 1,
            'data' => [
                'post' => $post,
            ],
        ], 204);
    }
}
