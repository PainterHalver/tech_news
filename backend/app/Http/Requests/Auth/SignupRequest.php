<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SignupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|unique:users,username|min:3|max:20',
            'full_name' => 'required|string|min:3|max:50',
            'password' => 'required|string|min:4',
            'password_confirm' => 'required|string|same:password',
        ];
    }
}
