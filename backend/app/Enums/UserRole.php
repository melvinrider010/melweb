<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPER_ADMIN = 'SUPER_ADMIN';
    case HOD_DEPARTMENT = 'HOD_DEPARTMENT';
    case IQAC_MANAGER = 'IQAC_MANAGER';
    case ACADEMIC_MANAGER = 'ACADEMIC_MANAGER';
    case EDITOR = 'EDITOR';

    /**
     * Human-readable role title.
     */
    public function label(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Super Administrator',
            self::HOD_DEPARTMENT => 'Head of Department (HOD)',
            self::IQAC_MANAGER => 'IQAC Coordinator',
            self::ACADEMIC_MANAGER => 'Academic Editor',
            self::EDITOR => 'Content Editor',
        };
    }

    /**
     * Check if the role is Super Administrator.
     */
    public function isSuperAdmin(): bool
    {
        return $this === self::SUPER_ADMIN;
    }

    /**
     * Check if the role is Head of Department.
     */
    public function isHOD(): bool
    {
        return $this === self::HOD_DEPARTMENT;
    }
}