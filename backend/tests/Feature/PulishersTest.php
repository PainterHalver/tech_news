<?php

namespace Tests\Feature;

use App\Traits\TestHelper;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PulishersTest extends TestCase
{
    use TestHelper;

    public function test_user_follow_publisher_success(): void
    {
        $user = $this->create_user();
        $publisher = $this->create_publisher();

        $response = $this->actingAs($user)->postJson('/api/publishers/'.$publisher->id.'/follows');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'data' => [
                'followed',
            ],
        ]);
    }

    public function test_get_index_success(): void
    {
        $admin = $this->create_admin();

        $response = $this->actingAs($admin)->getJson('/api/publishers');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'full_name',
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
}
