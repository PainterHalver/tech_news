<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
