<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Document;
use App\Enums\UserRole;

class DocumentPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [
            UserRole::SUPER_ADMIN,
            UserRole::HOD_DEPARTMENT,
            UserRole::IQAC_MANAGER,
            UserRole::ACADEMIC_MANAGER,
        ], true);
    }

    public function delete(User $user, Document $document): bool
    {
        return in_array($user->role, [
            UserRole::SUPER_ADMIN,
            UserRole::HOD_DEPARTMENT,
            UserRole::IQAC_MANAGER,
            UserRole::ACADEMIC_MANAGER,
        ], true);
    }
}