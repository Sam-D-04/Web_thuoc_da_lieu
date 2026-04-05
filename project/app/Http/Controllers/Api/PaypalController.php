<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PayPalController extends Controller
{
    protected function getBaseUrl(): string
    {
        return config('paypal.environment') === 'sandbox'
            ? 'https://api-m.sandbox.paypal.com'
            : 'https://api-m.paypal.com';
    }

    protected function getAccessToken()
    {
        $clientId = config('paypal.client_id');
        $secret   = config('paypal.secret');

        $response = Http::asForm()
            ->withBasicAuth($clientId, $secret)
            ->post($this->getBaseUrl() . '/v1/oauth2/token', [
                'grant_type' => 'client_credentials'
            ]);

        if (!$response->successful()) {
            return null;
        }

        return $response->json()['access_token'] ?? null;
    }

    public function createOrder(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.1'
        ]);

        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return response()->json(['message' => 'Could not get PayPal token'], 500);
        }

        $currency = config('paypal.currency', 'USD');

        $body = [
            'intent' => 'CAPTURE',
            'purchase_units' => [[
                'amount' => [
                    'currency_code' => $currency,
                    'value' => number_format($request->amount, 2, '.', '')
                ]
            ]],
            'application_context' => [
                'brand_name' => 'My Shop',
                'shipping_preference' => 'NO_SHIPPING'
            ]
        ];

        $response = Http::withToken($accessToken)
            ->post($this->getBaseUrl() . '/v2/checkout/orders', $body);

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Failed to create PayPal order',
                'error'   => $response->json()
            ], 500);
        }

        return response()->json($response->json());
    }

    public function captureOrder(Request $request)
    {
        $validated = $request->validate([
            'order_id'           => 'required|string',
            'items'              => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'shipping_name'      => 'required|string',
            'shipping_phone'     => 'required|string',
            'shipping_address'   => 'required|string'
        ]);

        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return response()->json(['message' => 'Could not get PayPal token'], 500);
        }

        $response = Http::withToken($accessToken)
            ->withHeaders([
                'Accept'       => 'application/json',
                'Content-Type' => 'application/json'
            ])
            ->post(
                $this->getBaseUrl() . '/v2/checkout/orders/' . $validated['order_id'] . '/capture',
                (object) []
            );

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Failed to capture PayPal order',
                'error'   => $response->json()
            ], 500);
        }

        $result = $response->json();

        if (($result['status'] ?? '') !== 'COMPLETED') {
            return response()->json([
                'message'       => 'Payment not completed',
                'paypal_status' => $result['status'] ?? null
            ], 400);
        }

        $total = 0;
        $orderItemsData = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);

            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'message' => 'Insufficient stock for ' . $product->name
                ], 400);
            }

            $price = $product->price * (1 - $product->discount_percent / 100);
            $total += $price * $item['quantity'];

            $orderItemsData[] = [
                'product_id' => $product->id,
                'quantity'   => $item['quantity'],
                'price'      => $price
            ];

            $product->decrement('stock', $item['quantity']);
        }

        $order = Order::create([
            'user_id'          => $request->user()->id,
            'total'            => $total,
            'status'           => 'completed',
            'shipping_name'    => $validated['shipping_name'],
            'shipping_phone'   => $validated['shipping_phone'],
            'shipping_address' => $validated['shipping_address'],
        ]);

        foreach ($orderItemsData as $item) {
            $item['order_id'] = $order->id;
            OrderItem::create($item);
        }

        return response()->json([
            'message' => 'Order paid via PayPal',
            'order'   => $order->load('items.product'),
            'paypal'  => $result
        ], 201);
    }
}
