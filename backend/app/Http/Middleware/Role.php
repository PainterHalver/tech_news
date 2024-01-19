<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Role
{
    public function handle($request, Closure $next, ... $roles)
    {
        if (!Auth::guard('sanctum')->check())
            return response()->json([
                'success' => 0,
                'message' => 'Unauthorized'
            ], Response::HTTP_UNAUTHORIZED);

        $user = Auth::guard('sanctum')->user();

        if (in_array($user->role, $roles)) {
            return $next($request);
        }

        return response()->json([
            'success' => 0,
            'message' => 'Unauthorized'
        ], Response::HTTP_UNAUTHORIZED);
    }
}
