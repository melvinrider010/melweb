<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'id',
        'name',
        'email',
        'password',
        'role',
        'department_id',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    /**
     * Backward-compatible camelCase accessor for departmentId.
     */
    protected function departmentId(): Attribute
    {
        return Attribute::make(
            get: fn ($value, array $attributes) => $attributes['department_id'] ?? null,
            set: fn ($value) => ['department_id' => $value],
        );
    }

    /**
     * Determine if the user is a Super Administrator.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::SUPER_ADMIN;
    }

    /**
     * Determine if the user is a Head of Department.
     */
    public function isHOD(): bool
    {
        return $this->role === UserRole::HOD_DEPARTMENT;
    }

    /**
     * Check if user has permission to manage a specific departmental entity.
     */
    public function canManageDepartment(?string $targetDepartment): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        $userDeptId = $this->department_id ?? $this->attributes['department_id'] ?? null;

        if (!$this->isHOD() || empty($userDeptId) || empty($targetDepartment)) {
            return false;
        }

        $normalize = function (string $val): string {
            $s = strtolower(trim($val));
            $s = preg_replace('/^(dept[-_]|department\s+of\s+)/', '', $s);
            $s = preg_replace('/[^a-z0-9]/', '', $s);
            return $s;
        };

        $normUser = $normalize($userDeptId);
        $normTarget = $normalize($targetDepartment);

        if ($normUser === '' || $normTarget === '') {
            return false;
        }

        return $normUser === $normTarget 
            || str_contains($normTarget, $normUser) 
            || str_contains($normUser, $normTarget);
    }
}