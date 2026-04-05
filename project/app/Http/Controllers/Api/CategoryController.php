<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    // GET /api/categories
    public function index()
    {
        return response()->json(Category::active()->get());
    }

    // GET /api/categories/{slug}
    public function show(string $slug)
    {
        $cat = Category::where('slug', $slug)->firstOrFail();
        return response()->json($cat->load('products'));
    }

    // POST /api/categories (admin)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:100|unique:categories,name',
            'is_active' => 'boolean',
        ]);
        $validated['slug'] = Str::slug($validated['name']);

        return response()->json(Category::create($validated), 201);
    }

    // PUT /api/categories/{id} (admin)
    public function update(Request $request, int $id)
    {
        $cat = Category::findOrFail($id);
        $validated = $request->validate([
            'name'      => "sometimes|string|max:100|unique:categories,name,{$id}",
            'is_active' => 'boolean',
        ]);
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        $cat->update($validated);
        return response()->json($cat);
    }

    // DELETE /api/categories/{id} (admin)
    public function destroy(int $id)
    {
        Category::findOrFail($id)->delete();
        return response()->json(['message' => 'Đã xóa danh mục']);
    }
}
