<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        static $count = 1;

        return [
            'username' => config('app.env') === 'testing'
                ? fake()->unique()->userName()
                : 'user'.$count++,
            'full_name' => $this->faker->name(),
            'avatar' => $this->faker->unique()->imageUrl(),
            'password' => md5('111111'),
            'remember_token' => Str::random(10),
        ];
    }
}
