<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServicesController extends Controller
{
    public function index()
    {
        return response()->json(Services::with('products')->get());
    }

    public function show(Services $Services)
    {
        return response()->json($Services->load('products'));
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:categories',
            'description' => 'nullable|string'
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $Services = Services::create($validated);
        return response()->json($Services, 201);
    }

    public function update(Request $request, Services $Services)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:categories,name,' . $Services->id,
            'description' => 'nullable|string'
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $Services->update($validated);

        return response()->json($Services);
    }

    public function destroy(Request $request, Services $Services)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $Services->delete();
        return response()->json(['message' => 'Services deleted']);
    }
}
