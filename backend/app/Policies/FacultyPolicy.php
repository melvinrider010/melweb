<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Faculty;

class FacultyPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Faculty $faculty): bool
    {
        return true;
    }

    public function create(User $user, ?string $department = null): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isHOD()) {
            return !empty($department) && $user->canManageDepartment($department);
        }

        return false;
    }

    public function update(User $user, Faculty $faculty): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isHOD()) {
            return $user->canManageDepartment($faculty->department);
        }

        return false;
    }

    public function delete(User $user, Faculty $faculty): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isHOD()) {
            return $user->canManageDepartment($faculty->department);
        }

        return false;
    }
}