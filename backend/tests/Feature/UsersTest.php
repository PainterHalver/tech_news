<?php

namespace Tests\Feature;

use App\Models\User;
use App\Traits\TestHelper;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UsersTest extends TestCase
{
    use TestHelper;

    public function test_admin_index_success(): void
    {
        $admin = $this->create_admin();

        $response = $this->actingAs($admin)->getJson('/api/users');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'username',
                    'full_name',
                    'avatar',
                    'created_at',
                    'updated_at',
                ],
            ],
            'first_page_url',
            'from',
            'last_page',
            'last_page_url',
            'links' => [
                '*' => [
                    'url',
                    'label',
                    'active',
                ],
            ],
            'next_page_url',
            'path',
            'per_page',
            'prev_page_url',
            'to',
            'total',
        ]);
    }

    public function test_admin_update_user_success(): void
    {
        $admin = $this->create_admin();
        $user = $this->create_user();

        $response = $this->actingAs($admin)->patchJson('/api/users/'.$user->id, [
            'username' => 'test',
            'full_name' => 'Test User',
            'password' => '1111',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'username',
            'full_name',
            'avatar',
            'created_at',
            'updated_at',
        ]);
    }

    public function test_user_get_statistics_success(): void
    {
        $user = $this->create_user();

        $response = $this->actingAs($user)->get('/api/me/statistics');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'data' => [
                'user' => [
                    'id',
                    'username',
                    'full_name',
                    'avatar',
                    'created_at',
                    'updated_at',
                ],
                'views_count',
                'comments_count',
                'joined_at',
                'followed_publishers_count',
                'bookmarks_count',
                'votes_count',
            ],
        ]);
    }

    public function test_user_update_avatar_success(): void
    {
        $user = User::factory()->create([
            'avatar' => '123.jpg',
        ]);

        // stub the public disk
        Storage::fake('public');

        $file = $this->create_image();
        $response = $this->actingAs($user)->postJson('/api/me/avatar', [
            'avatar' => $file,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'data' => [
                'user' => [
                    'id',
                    'username',
                    'full_name',
                    'avatar',
                    'created_at',
                    'updated_at',
                ],
            ],
        ]);
    }

    public function test_user_update_profile_success(): void
    {
        $user = $this->create_user();

        $response = $this->actingAs($user)->patchJson('/api/me', [
            'username' => 'test',
            'full_name' => 'Test User',
            'password' => '',
            'new_password' => '',
            'password_confirm' => '',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'data' => [
                'token',
                'user' => [
                    'id',
                    'username',
                    'full_name',
                    'avatar',
                    'created_at',
                    'updated_at',
                ],
            ],
        ]);

        // Make sure password is not changed
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'password' => $user->password,
        ]);
    }
}
