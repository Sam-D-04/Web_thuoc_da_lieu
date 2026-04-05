<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryTransaction extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'product_id', 'batch_id', 'type',
        'quantity', 'reference_id', 'note', 'created_by',
    ];

    protected $casts = ['quantity' => 'integer'];

    public function product()   { return $this->belongsTo(Product::class); }
    public function batch()     { return $this->belongsTo(Batch::class); }
    public function createdBy() { return $this->belongsTo(User::class, 'created_by'); }
}
