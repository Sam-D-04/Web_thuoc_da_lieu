<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Nếu không truyền roles cụ thể → chỉ admin
        $allowedRoles = empty($roles) ? ['admin'] : $roles;

        if (!in_array($user->role, $allowedRoles)) {
            return response()->json(['message' => 'Forbidden — không đủ quyền'], 403);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'Tài khoản đã bị vô hiệu hóa'], 403);
        }

        return $next($request);
    }
}
