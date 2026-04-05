<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Laravel\Sanctum\HasApiTokens;

class User extends Model implements AuthenticatableContract
{
    use Authenticatable, HasApiTokens;

    protected $fillable = ['name', 'email', 'password', 'phone', 'role', 'status', 'remember_token'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function isAdmin(): bool     { return $this->role === 'admin'; }
    public function isWarehouse(): bool { return $this->role === 'warehouse'; }
    public function isCustomer(): bool  { return $this->role === 'customer'; }
    public function isActive(): bool    { return $this->status === 'active'; }

    public function addresses()      { return $this->hasMany(UserAddress::class); }
    public function orders()         { return $this->hasMany(Order::class); }
    public function carts()          { return $this->hasMany(Cart::class); }
}
