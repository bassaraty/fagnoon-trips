<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin role
        $adminRole = Role::create(["name" => "admin", "guard_name" => "web"]);
        // Create admin role for api guard as well if it's used
        Role::create(["name" => "admin", "guard_name" => "api"]);

        // Example: Create a user role if needed
        // Role::create(["name" => "user", "guard_name" => "web"]);
        // Role::create(["name" => "user", "guard_name" => "api"]);

        // Example: Assign permissions to roles if you have permissions defined
        // $permission = Permission::create(["name" => "edit articles"]);
        // $adminRole->givePermissionTo($permission);
    }
}

