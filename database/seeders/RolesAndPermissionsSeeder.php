<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash; // Import Hash facade

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()["cache"]->forget("spatie.permission.cache");

        // Define Permissions
        $permissions = [
            "manage reservations",
            "view reservations",
            "manage birthdays",
            "view birthdays",
            "manage users",
            "manage roles",
            "manage locations",
            "manage packages",
            "manage activities",
            "track attendance",
            "view all branch data", // For HO Admin/Agent
            "view own branch data"  // For MOA Agent
        ];

        // Create Permissions if they don't exist
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(["name" => $permission]);
        }

        // Create Roles and Assign Permissions

        // Admin Role
        $adminRole = Role::firstOrCreate(["name" => "Admin"]);
        $adminRole->syncPermissions(Permission::all());

        // Reservation Agent Role
        $agentRole = Role::firstOrCreate(["name" => "Reservation Agent"]);
        $agentPermissions = [
            "manage reservations",
            "view reservations",
            "manage birthdays",
            "view birthdays",
            "track attendance",
            // Branch-specific permissions will be handled via user's branch and direct permission assignment if needed
        ];
        $agentRole->syncPermissions($agentPermissions);

        // Party Leader Role (likely a customer, limited permissions)
        $partyLeaderRole = Role::firstOrCreate(["name" => "Party Leader"]);
        $partyLeaderPermissions = [
            "view reservations", // View their own reservations
            "view birthdays"    // View their own birthday bookings
        ];
        $partyLeaderRole->syncPermissions($partyLeaderPermissions);

        // Create a default Admin user if it doesn't exist
        $adminUser = User::firstOrCreate(
            ["email" => "admin@fagnoon.app"],
            [
                "name" => "Admin User",
                "password" => Hash::make("password"), // Use Hash::make()
                "branch" => "HO" // Head Office
            ]
        );
        $adminUser->assignRole($adminRole);

        // Create a default Reservation Agent for MOA if it doesn't exist
        $moaAgent = User::firstOrCreate(
            ["email" => "moa.agent@fagnoon.app"],
            [
                "name" => "MOA Agent",
                "password" => Hash::make("password"), // Use Hash::make()
                "branch" => "MOA"
            ]
        );
        $moaAgent->assignRole($agentRole);
        // Specific permission for MOA agent to see only their branch data
        $moaAgent->givePermissionTo("view own branch data");

        // Create a default Reservation Agent for HO (can see all) if it doesn't exist
        $hoAgent = User::firstOrCreate(
            ["email" => "ho.agent@fagnoon.app"],
            [
                "name" => "HO Agent",
                "password" => Hash::make("password"), // Use Hash::make()
                "branch" => "HO"
            ]
        );
        $hoAgent->assignRole($agentRole);
        // Specific permission for HO agent to see all branch data
        $hoAgent->givePermissionTo("view all branch data");

        // Create a default Party Leader user if it doesn't exist
        $partyLeaderUser = User::firstOrCreate(
            ["email" => "partyleader@fagnoon.app"],
            [
                "name" => "Party Leader User",
                "password" => Hash::make("password") // Use Hash::make()
                // Branch not typically relevant for party leaders
            ]
        );
        $partyLeaderUser->assignRole($partyLeaderRole);
    }
}
