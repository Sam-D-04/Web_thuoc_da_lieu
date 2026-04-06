<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatsController extends Controller
{
    /**
     * GET /api/admin/stats/revenue
     * Thống kê doanh thu theo ngày/tháng
     */
    public function revenue(Request $request)
    {
        $validated = $request->validate([
            'period' => 'nullable|in:daily,monthly,yearly',
            'year'   => 'nullable|integer|min:2020|max:2099',
            'month'  => 'nullable|integer|min:1|max:12',
            'days'   => 'nullable|integer|min:7|max:365',
        ]);

        $period = $validated['period'] ?? 'daily';
        $year   = (int) ($validated['year']  ?? now()->year);
        $month  = (int) ($validated['month'] ?? now()->month);
        $days   = (int) ($validated['days']  ?? 30);

        // --- Chọn cách nhóm ---
        if ($period === 'daily') {
            $from = now()->subDays($days - 1)->startOfDay();
            $rows = Order::select(
                    DB::raw("DATE(created_at) as label"),
                    DB::raw("COUNT(*) as order_count"),
                    DB::raw("SUM(final_amount) as revenue")
                )
                ->where('order_status', '!=', 'cancelled')
                ->where('created_at', '>=', $from)
                ->groupBy(DB::raw("DATE(created_at)"))
                ->orderBy('label')
                ->get();

            // Điền ngày trống = 0
            $data = [];
            for ($i = $days - 1; $i >= 0; $i--) {
                $dateStr = now()->subDays($i)->format('Y-m-d');
                $row = $rows->firstWhere('label', $dateStr);
                $data[] = [
                    'label'       => $dateStr,
                    'display'     => now()->subDays($i)->format('d/m'),
                    'order_count' => $row ? (int) $row->order_count : 0,
                    'revenue'     => $row ? (float) $row->revenue    : 0,
                ];
            }

        } elseif ($period === 'monthly') {
            $rows = Order::select(
                    DB::raw("DATE_FORMAT(created_at, '%Y-%m') as label"),
                    DB::raw("COUNT(*) as order_count"),
                    DB::raw("SUM(final_amount) as revenue")
                )
                ->where('order_status', '!=', 'cancelled')
                ->whereYear('created_at', $year)
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
                    'revenue'     => $row ? (float) $row->revenue    : 0,
                ];
            }

        } else { // yearly – 5 năm gần nhất
            $rows = Order::select(
                    DB::raw("YEAR(created_at) as label"),
                    DB::raw("COUNT(*) as order_count"),
                    DB::raw("SUM(final_amount) as revenue")
                )
                ->where('order_status', '!=', 'cancelled')
                ->where('created_at', '>=', now()->subYears(4)->startOfYear())
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
                    'revenue'     => $row ? (float) $row->revenue    : 0,
                ];
            }
        }

        // --- Tổng hợp KPI ---
        $totalRevenue      = collect($data)->sum('revenue');
        $totalOrders       = collect($data)->sum('order_count');
        $avgOrderValue     = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 0) : 0;
        $bestPeriod        = collect($data)->sortByDesc('revenue')->first();

        // --- Top sản phẩm bán chạy (top 5) ---
        $topProducts = OrderItem::select(
                'product_id',
                DB::raw("SUM(quantity) as sold"),
                DB::raw("SUM(total) as revenue")
            )
            ->whereHas('order', fn ($q) =>
                $q->where('order_status', '!=', 'cancelled')
            )
            ->with('product:id,name,price_listed')
            ->groupBy('product_id')
            ->orderByDesc('sold')
            ->limit(5)
            ->get()
            ->map(fn ($item) => [
                'product_id'   => $item->product_id,
                'name'         => $item->product?->name ?? 'Không rõ',
                'sold'         => (int) $item->sold,
                'revenue'      => (float) $item->revenue,
            ]);

        return response()->json([
            'period'        => $period,
            'chart_data'    => $data,
            'summary' => [
                'total_revenue'   => $totalRevenue,
                'total_orders'    => $totalOrders,
                'avg_order_value' => $avgOrderValue,
                'best_period'     => $bestPeriod,
            ],
            'top_products'  => $topProducts,
        ]);
    }

    /**
     * GET /api/admin/stats/overview
     * Dashboard KPI tổng quan nhanh
     */
    public function overview()
    {
        $now   = now();
        $today = $now->toDateString();
        $monthStart = $now->copy()->startOfMonth()->toDateString();

        $todayRevenue = Order::where('order_status', '!=', 'cancelled')
            ->whereDate('created_at', $today)
            ->sum('final_amount');

        $monthRevenue = Order::where('order_status', '!=', 'cancelled')
            ->whereDate('created_at', '>=', $monthStart)
            ->sum('final_amount');

        $pendingOrders = Order::where('order_status', 'pending')->count();
        $totalProducts = Product::where('status', 'active')->count();

        return response()->json([
            'today_revenue'  => (float) $todayRevenue,
            'month_revenue'  => (float) $monthRevenue,
            'pending_orders' => (int) $pendingOrders,
            'total_products' => (int) $totalProducts,
        ]);
    }
}
