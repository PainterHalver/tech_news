<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\SignupRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $fields = $request->validated();

        $user = User::where('username', $fields['username'])->where('password', md5($fields['password']))->first();
        if (!$user) {
            return response()->json([
                'success' => 0,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user->tokens()->delete();
        $token = $user->createToken($user->username)->plainTextToken;

        return response()->json([
            'success' => 1,
            'data' => [
                'token' => $token,
                'user' => $user
            ]
        ], 200);
    }

    public function signup(SignupRequest $request): JsonResponse
    {
        $fields = $request->validated();

        $user = User::create($fields);
        $token = $user->createToken($user->username)->plainTextToken;

        return response()->json([
            'success' => 1,
            'data' => [
                'user' => $user,
                'token' => $token
            ],
        ], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->tokens()->delete();

        return response()->json([
            'success' => 1,
        ], 200);
    }
}
