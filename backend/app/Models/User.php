<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'full_name',
        'password',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function bookmarkedPosts()
    {
        return $this->belongsToMany(Post::class, 'bookmarks');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function followedPublishers(): BelongsToMany
    {
        return $this->belongsToMany(Publisher::class, 'follows');
    }

    public function views(): HasMany
    {
        return $this->hasMany(View::class);
    }

    public function viewedPosts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'views')
            ->withTimestamps();
    }
}
