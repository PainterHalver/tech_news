<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image',
        'link',
        'published_at',
        'publisher_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function publisher()
    {
        return $this->belongsTo(Publisher::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
