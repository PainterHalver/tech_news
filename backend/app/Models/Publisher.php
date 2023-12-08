<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Publisher extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'full_name',
        'image',
        'link',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function followingUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows');
    }
}
