<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\UserAddress;
use App\Models\Product;
use App\Models\Batch;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // GET /api/orders  (user: own orders)
    public function index(Request $request)
    {
        $orders = Order::with(['items.product', 'address'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    // GET /api/orders/{id}
    public function show(Request $request, int $id)
    {
        $order = Order::with(['items.product', 'items.batch', 'address', 'payment'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($order);
    }

    // POST /api/orders  (Place order — FEFO batch assignment)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items'                     => 'required|array|min:1',
            'items.*.product_id'        => 'required|exists:products,id',
            'items.*.quantity'          => 'required|integer|min:1',
            'address.full_name'         => 'required|string',
            'address.phone'             => 'required|string',
            'address.address_line'      => 'required|string',
            'address.ward'              => 'required|string',
            'address.district'          => 'required|string',
            'address.city'              => 'required|string',
            'payment_method'            => 'required|in:bank_transfer,vnpay,momo',
            'note'                      => 'nullable|string',
        ]);

        $user = $request->user();

        return DB::transaction(function () use ($validated, $user) {
            // 1. Save or create address
            $address = UserAddress::create([
                'user_id'      => $user->id,
                'full_name'    => $validated['address']['full_name'],
                'phone'        => $validated['address']['phone'],
                'address_line' => $validated['address']['address_line'],
                'ward'         => $validated['address']['ward'],
                'district'     => $validated['address']['district'],
                'city'         => $validated['address']['city'],
            ]);

            $totalAmount = 0;
            $orderItemsData = [];

            // 2. FEFO batch assignment
            foreach ($validated['items'] as $item) {
                $product  = Product::lockForUpdate()->findOrFail($item['product_id']);
                $needed   = $item['quantity'];

                if ($product->stock_quantity < $needed) {
                    throw new \Exception("Sản phẩm \"{$product->name}\" không đủ hàng.");
                }

                // Get batches sorted by expiry ASC (FEFO)
                $batches = Batch::where('product_id', $product->id)
                    ->where('remaining_quantity', '>', 0)
                    ->orderBy('expiry_date')
                    ->lockForUpdate()
                    ->get();

                $remaining = $needed;
                foreach ($batches as $batch) {
                    if ($remaining <= 0) break;

                    $take = min($batch->remaining_quantity, $remaining);
                    $batch->decrement('remaining_quantity', $take);
                    $remaining -= $take;

                    $subtotal = $product->price_listed * $take;
                    $totalAmount += $subtotal;

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'batch_id'   => $batch->id,
                        'quantity'   => $take,
                        'price'      => $product->price_listed,
                        'total'      => $subtotal,
                    ];
                }

                // Update product stock
                $product->decrement('stock_quantity', $needed);
                $product->increment('sold_count', $needed);
            }

            // 3. Shipping fee
            $shippingFee  = $totalAmount >= 299000 ? 0 : 25000;
            $finalAmount  = $totalAmount + $shippingFee;

            // 4. Create order
            $order = Order::create([
                'user_id'        => $user->id,
                'address_id'     => $address->id,
                'order_code'     => 'ORD-' . strtoupper(Str::random(10)),
                'total_amount'   => $totalAmount,
                'shipping_fee'   => $shippingFee,
                'final_amount'   => $finalAmount,
                'order_status'   => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => $validated['payment_method'],
                'note'           => $validated['note'] ?? null,
            ]);

            // 5. Create order items
            foreach ($orderItemsData as &$row) {
                $row['order_id'] = $order->id;
            }
            OrderItem::insert($orderItemsData);

            // 6. Create payment record
            Payment::create([
                'order_id'       => $order->id,
                'amount'         => $finalAmount,
                'payment_method' => $validated['payment_method'],
                'status'         => 'pending',
            ]);

            return response()->json($order->load(['items.product', 'address']), 201);
        });
    }

    // PUT /api/orders/{id}/status (admin)
    public function updateStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'order_status'   => 'required|in:pending,confirmed,packing,shipping,delivered,cancelled',
            'payment_status' => 'nullable|in:unpaid,paid',
        ]);

        $order = Order::findOrFail($id);
        $order->update($validated);

        return response()->json($order);
    }

    // GET /api/admin/orders (admin)
    public function adminIndex(Request $request)
    {
        $query = Order::with(['user', 'address', 'items.product'])->latest();

        if ($status = $request->get('status')) {
            $query->where('order_status', $status);
        }

        return response()->json($query->paginate(20));
    }
}
