<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    public function test_health_check(): void
    {
        $response = $this->get('/api/health_check');

        $response->assertJson([
            'message' => 'ok',
        ]);
    }
}
