<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UsersController extends Controller
{
    public function updateMe(Request $request)
    {
        $fields = $request->validate([
            'full_name' => 'required|string|min:3|max:50',
            'password' => 'string|min:4',
            'new_password' => 'required_with:password|string|min:4',
            'password_confirm' => 'required_with:new_password|string|same:password',
        ]);
        $fields['password'] = md5($fields['new_password']);

        $user = auth()->user();
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
}
