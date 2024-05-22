<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FeedbacksTest extends TestCase
{
    public function test_create_feedback_with_long_text_success(): void
    {
        $response = $this->postJson('/api/feedbacks', [
            'content' => str_repeat('ab ', 1000),
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'id',
                'content',
                'created_at',
                'updated_at',
            ],
        ]);
    }

    public function test_get_all_feedbacks_success(): void
    {
        $response = $this->getJson('/api/feedbacks');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'content',
                    'created_at',
                    'updated_at',
                ],
            ],
        ]);
    }
}
