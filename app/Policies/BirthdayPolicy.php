<?php

namespace App\Policies;

use App\Models\Birthday;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BirthdayPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Allow admins to view all, or implement specific logic if needed
        return $user->hasRole("admin");
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Birthday $birthday): bool
    {
        return $user->id === $birthday->user_id || $user->hasRole("admin");
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Assuming any authenticated user can create a birthday event, or add role checks if needed
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Birthday $birthday): bool
    {
        return $user->id === $birthday->user_id || $user->hasRole("admin");
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Birthday $birthday): bool
    {
        return $user->id === $birthday->user_id || $user->hasRole("admin");
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Birthday $birthday): bool
    {
        return $user->hasRole("admin"); // Typically only admins can restore
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Birthday $birthday): bool
    {
        return $user->hasRole("admin"); // Typically only admins can force delete
    }
}

