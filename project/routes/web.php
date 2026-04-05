<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::get('/', function () {
    $port = request()->getPort();

    if ($port == 8001) {
        return view('admin.admin');
    }

    return view('user.user');
});
Route::get('/admin/{any?}', function () {
    return view('admin.admin');
})->where('any', '.*');

// Facebook OAuth routes - must be before catch-all route
Route::get('/auth/facebook', [AuthController::class, 'facebookRedirect']);
Route::get('/auth/facebook/callback', [AuthController::class, 'facebookCallback']);

// 2) Route cho USER SPA
Route::get('/{any?}', function () {
    return view('user.user');
})->where('any', '^(?!api|admin|auth).*$');
