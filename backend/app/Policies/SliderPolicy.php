<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Slider;

class SliderPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    public function update(User $user, Slider $slider): bool
    {
        return $user->isSuperAdmin();
    }

    public function delete(User $user, Slider $slider): bool
    {
        return $user->isSuperAdmin();
    }
}