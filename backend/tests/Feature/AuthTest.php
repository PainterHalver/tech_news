<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_signup_success(): void
    {
        $response = $this->postJson('/api/auth/signup', [
            'username' => 'test',
            'password' => '1111',
            'password_confirm' => '1111',
            'full_name' => 'Test User',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'user' => [
                    'id',
                    'username',
                    'full_name',
                    'created_at',
                    'updated_at',
                ],
                'token',
            ],
        ]);
    }

    public function test_signup_validation_error(): void
    {
        $response = $this->postJson('/api/auth/signup', [
            'username' => '',
            'password' => '',
            'password_confirm' => '',
            'full_name' => '',
        ]);

        $response->assertStatus(422);
        $response->assertJsonStructure([
            'message',
            'errors' => [
                'username',
                'password',
                'password_confirm',
                'full_name',
            ],
        ]);
    }

    public function test_login_success(): void
    {
        $user = User::factory()->create([
            'username' => 'test',
            'password' => md5('1111'),
            'full_name' => 'Test User',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'username' => 'test',
            'password' => '1111',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'user' => [
                    'id',
                    'username',
                    'full_name',
                    'created_at',
                    'updated_at',
                ],
                'token',
            ],
        ]);
    }

    public function test_login_validation_error(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'username' => '',
            'password' => '',
        ]);

        $response->assertStatus(422);
        $response->assertJsonStructure([
            'message',
            'errors' => [
                'username',
                'password',
            ],
        ]);
    }

    public function test_login_wrong_credentials(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'username' => 'test',
            'password' => '1111',
        ]);

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'success',
            'message',
        ]);
    }

    public function test_logout_success(): void
    {
        $user = User::factory()->create([
            'username' => 'test',
            'password' => md5('1111'),
            'full_name' => 'Test User',
        ]);

        $token = $user->createToken($user->username)->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->delete('/api/auth/logout');

        $response->assertStatus(200);
    }

    public function test_get_me_success(): void
    {
        $user = User::factory()->create([
            'username' => 'test',
            'password' => md5('1111'),
            'full_name' => 'Test User',
        ]);

        $token = $user->createToken($user->username)->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get('/api/auth/me');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'user' => [
                    'id',
                    'username',
                    'full_name',
                    'created_at',
                    'updated_at',
                ],
            ],
        ]);
    }
}
