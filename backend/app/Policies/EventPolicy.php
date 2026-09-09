<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Event;
use App\Enums\UserRole;

class EventPolicy
{
    /**
     * Determine whether the user can view any events.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the event.
     */
    public function view(?User $user, Event $event): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create events.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, [
            UserRole::SUPER_ADMIN,
            UserRole::HOD_DEPARTMENT,
            UserRole::ACADEMIC_MANAGER,
            UserRole::IQAC_MANAGER,
            UserRole::EDITOR,
        ], true);
    }

    /**
     * Determine whether the user can update the event.
     */
    public function update(User $user, Event $event): bool
    {
        if ($user->isSuperAdmin() || $user->role === UserRole::EDITOR) {
            return true;
        }

        if ($user->isHOD()) {
            return $user->canManageDepartment($event->department);
        }

        return false;
    }

    /**
     * Determine whether the user can delete the event.
     */
    public function delete(User $user, Event $event): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isHOD()) {
            return $user->canManageDepartment($event->department);
        }

        return false;
    }
}