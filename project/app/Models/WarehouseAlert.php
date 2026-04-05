<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WarehouseAlert extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'product_id', 'alert_type', 'message',
        'is_resolved', 'resolved_by', 'resolved_at',
    ];

    protected $casts = [
        'is_resolved'  => 'boolean',
        'resolved_at'  => 'datetime',
    ];

    public function product()    { return $this->belongsTo(Product::class); }
    public function resolvedBy() { return $this->belongsTo(User::class, 'resolved_by'); }

    public function scopeUnresolved($q) { return $q->where('is_resolved', false); }
}
