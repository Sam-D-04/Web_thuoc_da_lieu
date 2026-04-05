<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    protected $fillable = [
        'product_id', 'batch_code', 'expiry_date',
        'quantity', 'remaining_quantity', 'created_by',
    ];

    protected $casts = [
        'expiry_date'        => 'date',
        'quantity'           => 'integer',
        'remaining_quantity' => 'integer',
    ];

    protected $appends = ['is_expiring_soon', 'is_expired'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function inventoryTransactions()
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    // ─── Accessors ──────────────────────────────────────
    public function getIsExpiringSOonAttribute(): bool
    {
        return $this->expiry_date && $this->expiry_date->diffInDays(now()) <= 90 && !$this->is_expired;
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    // ─── Scopes ─────────────────────────────────────────
    public function scopeAvailable($query)
    {
        return $query->where('remaining_quantity', '>', 0);
    }

    public function scopeExpiringSoon($query, int $days = 90)
    {
        return $query->where('expiry_date', '<=', now()->addDays($days))
                     ->where('expiry_date', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now()->toDateString());
    }
}
