<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UsersController extends Controller
{
    public function updateMe(Request $request)
    {
        $fields = $request->validate([
            'full_name' => 'required|string|min:3|max:50',
            'password' => 'string|min:4|nullable',
            'new_password' => 'required_with:password|string|min:4|nullable',
            'password_confirm' => 'required_with:new_password|string|same:new_password|nullable',
        ]);

        $user = auth()->user();
        $old_password_hash = md5($fields['password']);
        if (isset($fields['password']) && $old_password_hash !== $user->password) {
            return response()->json([
                'message' => 'Wrong password',
            ], 400);
        }

        $fields['password'] = md5($fields['new_password']);
        $user->update($fields);
        $token = $request->bearerToken();

        return response()->json([
            'message' => 'ok',
            'data' => [
                'token' => $token,
                'user' => $user,
            ],
        ], 200);
    }

    public function updateAvatar(Request $request)
    {
        $fields = $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:12048',
        ]);
        $user = auth()->user();

        // delete old avatar if not starts with http
        if (!str_contains($user->avatar, 'http')) {
            Storage::disk('public')->delete('avatars/'.$user->avatar);
        }

        $avatarName = $user->id.'_avatar'.time().'.'.request()->avatar->getClientOriginalExtension();
        Storage::disk('public')->putFileAs('avatars', $fields['avatar'], $avatarName);
        $user->avatar = $avatarName;
        $user->save();

        return response()->json([
            'message' => 'ok',
            'data' => [
                'token' => $request->bearerToken(),
                'user' => $user,
            ],
        ], 200);
    }

    public function statistics(Request $request): JsonResponse
    {
        $user = auth()->user();
        $views_count = $user->views()->count();
        $votes_count = $user->votes()->count();
        $comments_count = $user->comments()->count();
        $joined_at = $user->created_at;
        $followed_publishers_count = $user->followedPublishers()->count();
        $bookmarks_count = $user->bookmarkedPosts()->count();

        return response()->json([
            'message' => 'ok',
            'data' => [
                'user' => $user,
                'views_count' => $views_count,
                'comments_count' => $comments_count,
                'joined_at' => $joined_at,
                'followed_publishers_count' => $followed_publishers_count,
                'bookmarks_count' => $bookmarks_count,
                'votes_count' => $votes_count,
            ],
        ], 200);
    }

    // ADMIN ROUTES
    public function index(Request $request): JsonResponse
    {
        $fields = $request->validate([
            'per_page' => 'integer',
            'search' => '',
        ]);

        $perPage = $fields['per_page'] ?? 10;
        $search = $fields['search'] ?? '';

        $users = User::latest();
        $words = explode(' ', $search);
        foreach ($words as $word) {
            $users = $users->where('username', 'like', '%'.$word.'%')
                ->orWhere('full_name', 'like', '%'.$word.'%');
        }
        $users = $users->paginate($perPage);

        return response()->json($users, 200);
    }

    public function update(User $user, Request $request): JsonResponse
    {
        $fields = $request->validate([
            'full_name' => 'string|nullable|min:3|max:50',
            'password' => 'string|nullable|min:4',
            'role' => 'string|in:admin,user',
            'username' => 'string|min:3|max:20|unique:users,username,'.$user->id,
        ]);

        // If no password field or empty, remove it from fields
        if (empty($fields['password'])) {
            unset($fields['password']);
        } else {
            $fields['password'] = md5($fields['password']);
        }

        $user->update($fields);

        return response()->json($user, 200);
    }
}
