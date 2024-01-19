<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(5)->create();
        User::factory()->create([
            'username' => 'admin',
            'password' => md5('1111'),
            'full_name' => 'Administrator',
            'role' => 'admin'
        ]);
    }
}
