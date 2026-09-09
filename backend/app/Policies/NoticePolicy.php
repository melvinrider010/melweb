<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Notice;
use App\Enums\UserRole;

class NoticePolicy
{
    /**
     * Determine whether the user can view any notices.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the notice.
     */
    public function view(?User $user, Notice $notice): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create notices.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, [
            UserRole::SUPER_ADMIN,
            UserRole::HOD_DEPARTMENT,
            UserRole::IQAC_MANAGER,
            UserRole::EDITOR,
        ], true);
    }

    /**
     * Determine whether the user can update the notice.
     */
    public function update(User $user, Notice $notice): bool
    {
        if ($user->isSuperAdmin() || $user->role === UserRole::EDITOR) {
            return true;
        }

        if ($user->isHOD()) {
            return $user->canManageDepartment($notice->department);
        }

        return false;
    }

    /**
     * Determine whether the user can delete the notice.
     */
    public function delete(User $user, Notice $notice): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isHOD()) {
            return $user->canManageDepartment($notice->department);
        }

        return false;
    }
}