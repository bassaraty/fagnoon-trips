<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Auth routes are defined in auth.php
require __DIR__."/auth.php";

// Catch-all route for the React SPA
// This should be the last route definition in this file
Route::get("/{any?}", function () {
    return view("welcome"); // Assuming welcome.blade.php hosts your React app
})->where("any", ".*");
