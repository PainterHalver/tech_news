<?php

namespace App\Http\Controllers;

use App\Models\Publisher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublishersController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $fields = $request->validate([
            'per_page' => 'integer',
            'sort_by' => 'string|in:posts_count,followers_count',
            'search' => '',
        ]);
        $perPage = $fields['per_page'] ?? 10;
        $sortBy = $fields['sort_by'] ?? 'created_at';
        $search = $fields['search'] ?? '';

        $publishers = Publisher::withCount(['posts as posts_count'])
            ->withCount(['followingUsers as followers_count']);

        // SEARCH BY NAME
        $words = explode(' ', $search);
        foreach ($words as $word) {
            $publishers->where('name', 'like', "%{$word}%");
        }

        // SORT
        $publishers->orderBy($sortBy, 'desc');
        $publishers = $publishers->paginate($perPage);

        return response()->json($publishers, 200);
    }

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
