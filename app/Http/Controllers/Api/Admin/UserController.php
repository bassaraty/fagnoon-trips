<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct()
    {
        // Protect all admin routes, for example, by checking for a specific role or permission
        // $this->middleware("role:admin"); // Assuming you have a role middleware
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Add authorization check: only admins should access this
        // if (!Auth::user()->hasRole("admin")) {
        //     return response()->json(["message" => "Unauthorized"], 403);
        // }
        $users = User::with("roles")->latest()->paginate(15);
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // if (!Auth::user()->hasRole("admin")) {
        //     return response()->json(["message" => "Unauthorized"], 403);
        // }
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "email" => "required|string|email|max:255|unique:users",
            "password" => "required|string|min:8|confirmed",
            "branch" => "required|string|max:255",
            "roles" => "nullable|array",
            "roles.*" => "exists:roles,name" // Ensure roles exist
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "branch" => $request->branch,
        ]);

        if ($request->has("roles")) {
            $user->syncRoles($request->roles);
        }

        return response()->json($user->load("roles"), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // if (!Auth::user()->hasRole("admin")) {
        //     return response()->json(["message" => "Unauthorized"], 403);
        // }
        return response()->json($user->load("roles"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // if (!Auth::user()->hasRole("admin")) {
        //     return response()->json(["message" => "Unauthorized"], 403);
        // }
        $validator = Validator::make($request->all(), [
            "name" => "sometimes|required|string|max:255",
            "email" => "sometimes|required|string|email|max:255|unique:users,email," . $user->id,
            "password" => "nullable|string|min:8|confirmed",
            "branch" => "sometimes|required|string|max:255",
            "roles" => "nullable|array",
            "roles.*" => "exists:roles,name"
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $userData = $request->only(["name", "email", "branch"]);
        if ($request->filled("password")) {
            $userData["password"] = Hash::make($request->password);
        }

        $user->update($userData);

        if ($request->has("roles")) {
            $user->syncRoles($request->roles);
        }

        return response()->json($user->load("roles"));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // if (!Auth::user()->hasRole("admin")) {
        //     return response()->json(["message" => "Unauthorized"], 403);
        // }
        // Add check to prevent admin from deleting themselves or critical users
        // if (Auth::id() === $user->id) {
        //    return response()->json(["message" => "Cannot delete yourself."], 403);
        // }
        $user->delete();
        return response()->json(null, 204);
    }
}

