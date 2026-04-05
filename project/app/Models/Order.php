<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'address_id', 'order_code',
        'total_amount', 'shipping_fee', 'final_amount',
        'order_status', 'payment_status', 'payment_method',
        'note', 'order_date', 'paid_at',
    ];

    protected $casts = [
        'total_amount'  => 'float',
        'shipping_fee'  => 'float',
        'final_amount'  => 'float',
        'order_date'    => 'datetime',
        'paid_at'       => 'datetime',
    ];

    const STATUSES = ['pending', 'confirmed', 'packing', 'shipping', 'delivered', 'cancelled'];

    public function user()     { return $this->belongsTo(User::class); }
    public function address()  { return $this->belongsTo(UserAddress::class, 'address_id'); }
    public function items()    { return $this->hasMany(OrderItem::class); }
    public function payment()  { return $this->hasOne(Payment::class); }

    public function scopePending($q)   { return $q->where('order_status', 'pending'); }
    public function scopeDelivered($q) { return $q->where('order_status', 'delivered'); }
}
