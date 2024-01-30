<?php

namespace App\Traits;

use App\Models\Post;
use App\Models\Publisher;
use App\Models\User;
use Illuminate\Http\UploadedFile;

trait TestHelper
{
    public function create_user()
    {
        return User::factory()->create([
            'role' => 'user',
        ]);
    }

    public function create_admin()
    {
        return User::factory()->create([
            'role' => 'admin',
        ]);
    }

    public function create_publisher()
    {
        return Publisher::factory()->create();
    }

    public function create_post()
    {
        return Post::factory()->create();
    }

    public function create_image(): \Illuminate\Http\Testing\File
    {
        return UploadedFile::fake()->image('avatar.jpg');
    }
}
