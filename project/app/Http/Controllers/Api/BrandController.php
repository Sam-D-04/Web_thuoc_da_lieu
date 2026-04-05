<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    public function index()
    {
        return response()->json(Brand::active()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:100|unique:brands,name',
            'is_active' => 'boolean',
        ]);
        $validated['slug'] = Str::slug($validated['name']);
        return response()->json(Brand::create($validated), 201);
    }

    public function update(Request $request, int $id)
    {
        $brand = Brand::findOrFail($id);
        $validated = $request->validate([
            'name'      => "sometimes|string|max:100|unique:brands,name,{$id}",
            'is_active' => 'boolean',
        ]);
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        $brand->update($validated);
        return response()->json($brand);
    }

    public function destroy(int $id)
    {
        Brand::findOrFail($id)->delete();
        return response()->json(['message' => 'Đã xóa thương hiệu']);
    }
}
