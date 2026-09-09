<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $roleValue = is_object($this->role) && enum_exists(get_class($this->role)) 
            ? $this->role->value 
            : (string)$this->role;

        return [
            'id' => (string)$this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $roleValue,
            'department_id' => $this->department_id,
            'departmentId' => $this->department_id,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}