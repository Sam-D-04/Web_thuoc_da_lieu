<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    /**
     * GET /api/admin/stats/revenue
     * Thống kê doanh thu: chart, top sản phẩm, danh mục, so sánh kỳ trước
     */
    public function revenue(Request $request)
    {
        $period = $request->input('period', 'daily');   // daily | monthly | yearly
        $year   = (int) ($request->input('year',  now()->year));
        $days   = (int) ($request->input('days',  30));

        // ── Xác định khoảng thời gian hiện tại và kỳ trước ─────────────────────
        if ($period === 'daily') {
            $from     = now()->subDays($days - 1)->startOfDay();
            $to       = now()->endOfDay();
            $prevFrom = now()->subDays($days * 2 - 1)->startOfDay();
            $prevTo   = now()->subDays($days)->endOfDay();
        } elseif ($period === 'monthly') {
            $from     = Carbon::create($year, 1, 1)->startOfDay();
            $to       = Carbon::create($year, 12, 31)->endOfDay();
            $prevFrom = Carbon::create($year - 1, 1, 1)->startOfDay();
            $prevTo   = Carbon::create($year - 1, 12, 31)->endOfDay();
        } else { // yearly
            $from     = now()->subYears(4)->startOfYear();
            $to       = now()->endOfDay();
            $prevFrom = $prevTo = null;
        }

        // ── Dữ liệu chart ────────────────────────────────────────────────────────
        if ($period === 'daily') {
            $rows = Order::select(
                    DB::raw("DATE(created_at) as label"),
                    DB::raw("COUNT(*) as order_count"),
                    DB::raw("COALESCE(SUM(final_amount), 0) as revenue")
                )
                ->where('order_status', '!=', 'cancelled')
                ->whereBetween('created_at', [$from, $to])
                ->groupBy(DB::raw("DATE(created_at)"))
                ->orderBy('label')
                ->get();

            $data = [];
            for ($i = $days - 1; $i >= 0; $i--) {
                $dateStr = now()->subDays($i)->format('Y-m-d');
                $row = $rows->firstWhere('label', $dateStr);
                $data[] = [
                    'label'       => $dateStr,
                    'display'     => now()->subDays($i)->format('d/m'),
                    'order_count' => $row ? (int) $row->order_count : 0,
                    'revenue'     => $row ? (float) $row->revenue   : 0,
                ];
            }

        } elseif ($period === 'monthly') {
            $rows = Order::select(
                    DB::raw("DATE_FORMAT(created_at, '%Y-%m') as label"),
                    DB::raw("COUNT(*) as order_count"),
                    DB::raw("COALESCE(SUM(final_amount), 0) as revenue")
                )
                ->where('order_status', '!=', 'cancelled')
                ->whereBetween('created_at', [$from, $to])
                ->groupBy(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"))
                ->orderBy('label')
                ->get();

            $data = [];
            for ($m = 1; $m <= 12; $m++) {
                $key = sprintf('%d-%02d', $year, $m);
                $row = $rows->firstWhere('label', $key);
                $data[] = [
                    'label'       => $key,
                    'display'     => "T{$m}",
                    'order_count' => $row ? (int) $row->order_count : 0,
                    'revenue'     => $row ? (float) $row->revenue   : 0,
                ];
            }

        } else { // yearly
            $rows = Order::select(
                    DB::raw("YEAR(created_at) as label"),
                    DB::raw("COUNT(*) as order_count"),
                    DB::raw("COALESCE(SUM(final_amount), 0) as revenue")
                )
                ->where('order_status', '!=', 'cancelled')
                ->whereBetween('created_at', [$from, $to])
                ->groupBy(DB::raw("YEAR(created_at)"))
                ->orderBy('label')
                ->get();

            $data = [];
            for ($y = now()->year - 4; $y <= now()->year; $y++) {
                $row = $rows->firstWhere('label', $y);
                $data[] = [
                    'label'       => (string) $y,
                    'display'     => (string) $y,
                    'order_count' => $row ? (int) $row->order_count : 0,
                    'revenue'     => $row ? (float) $row->revenue   : 0,
                ];
            }
        }

        $currentRevenue = collect($data)->sum('revenue');
        $currentOrders  = collect($data)->sum('order_count');
        $currentAvg     = $currentOrders > 0 ? round($currentRevenue / $currentOrders) : 0;

        // ── So sánh kỳ trước ─────────────────────────────────────────────────────
        $revenueChange = $ordersChange = $avgChange = null;
        if ($prevFrom) {
            $prev = Order::where('order_status', '!=', 'cancelled')
                ->whereBetween('created_at', [$prevFrom, $prevTo])
                ->selectRaw('COUNT(*) as order_count, COALESCE(SUM(final_amount), 0) as revenue')
                ->first();

            $prevRevenue = (float) $prev->revenue;
            $prevOrders  = (int)   $prev->order_count;
            $prevAvg     = $prevOrders > 0 ? $prevRevenue / $prevOrders : 0;

            $revenueChange = $prevRevenue > 0
                ? round(($currentRevenue - $prevRevenue) / $prevRevenue * 100, 1) : null;
            $ordersChange  = $prevOrders > 0
                ? round(($currentOrders  - $prevOrders)  / $prevOrders  * 100, 1) : null;
            $avgChange     = $prevAvg > 0
                ? round(($currentAvg    - $prevAvg)    / $prevAvg    * 100, 1) : null;
        }

        // ── Top 10 sản phẩm bán chạy trong kỳ ───────────────────────────────────
        $topProducts = DB::table('order_items')
            ->select(
                'order_items.product_id',
                'products.name',
                DB::raw("SUM(order_items.quantity) as sold"),
                DB::raw("SUM(order_items.total) as revenue")
            )
            ->join('orders',   'order_items.order_id',   '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.order_status', '!=', 'cancelled')
            ->whereBetween('orders.created_at', [$from, $to])
            ->groupBy('order_items.product_id', 'products.name')
            ->orderByDesc('sold')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'product_id' => $row->product_id,
                'name'       => $row->name,
                'sold'       => (int)   $row->sold,
                'revenue'    => (float) $row->revenue,
            ]);

        // ── Doanh thu theo danh mục trong kỳ ─────────────────────────────────────
        $categoryRevenue = DB::table('order_items')
            ->select(
                'categories.id',
                'categories.name',
                DB::raw("SUM(order_items.total) as revenue")
            )
            ->join('orders',     'order_items.order_id',   '=', 'orders.id')
            ->join('products',   'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id',   '=', 'categories.id')
            ->where('orders.order_status', '!=', 'cancelled')
            ->whereBetween('orders.created_at', [$from, $to])
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn ($row) => [
                'name'    => $row->name,
                'revenue' => (float) $row->revenue,
            ]);

        return response()->json([
            'period'           => $period,
            'chart_data'       => $data,
            'summary'          => [
                'total_revenue'   => $currentRevenue,
                'total_orders'    => $currentOrders,
                'avg_order_value' => $currentAvg,
                'best_period'     => collect($data)->sortByDesc('revenue')->first(),
                'revenue_change'  => $revenueChange,
                'orders_change'   => $ordersChange,
                'avg_change'      => $avgChange,
            ],
            'top_products'     => $topProducts,
            'category_revenue' => $categoryRevenue,
        ]);
    }

    /**
     * GET /api/admin/stats/overview
     * KPI nhanh cho dashboard + thống kê tồn kho
     */
    public function overview()
    {
        $now        = now();
        $today      = $now->toDateString();
        $monthStart = $now->copy()->startOfMonth()->toDateString();

        $todayRevenue = Order::where('order_status', '!=', 'cancelled')
            ->whereDate('created_at', $today)
            ->sum('final_amount');

        $monthRevenue = Order::where('order_status', '!=', 'cancelled')
            ->whereDate('created_at', '>=', $monthStart)
            ->sum('final_amount');

        $pendingOrders = Order::where('order_status', 'pending')->count();
        $totalProducts = Product::where('is_active', true)->count();

        // ── Tồn kho ──────────────────────────────────────────────────────────────
        $lowStockCount = Product::where('is_active', true)
            ->whereRaw('stock_quantity <= stock_warning AND stock_warning > 0')
            ->count();

        $highStockCount = Product::where('is_active', true)
            ->whereRaw('stock_quantity > stock_warning * 3')
            ->count();

        $expiringSoonCount = Batch::where('remaining_quantity', '>', 0)
            ->where('expiry_date', '>', $today)
            ->where('expiry_date', '<=', $now->copy()->addDays(30)->toDateString())
            ->count();

        $inventoryValue = DB::table('products')
            ->where('is_active', true)
            ->sum(DB::raw('stock_quantity * price_listed'));

        return response()->json([
            'today_revenue'  => (float) $todayRevenue,
            'month_revenue'  => (float) $monthRevenue,
            'pending_orders' => (int)   $pendingOrders,
            'total_products' => (int)   $totalProducts,
            'inventory'      => [
                'low_stock'     => (int)   $lowStockCount,
                'high_stock'    => (int)   $highStockCount,
                'expiring_soon' => (int)   $expiringSoonCount,
                'total_value'   => (float) $inventoryValue,
            ],
        ]);
    }
}
