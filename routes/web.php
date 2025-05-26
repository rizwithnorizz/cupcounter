<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Data;
    
Route::get('/', function () {
    return Inertia::render('Landing');
});

Route::post('/student/store', [Data::class, 'store'])->name('student.store');
Route::get('/remaining-cups', [Data::class, 'getCups'])->name('remaining.cups');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    Route::post('/redeem', function () {
        return Inertia::render('Landing');
    })->name('redeem');
    Route::get('/api/redeemers', [Data::class, 'getRedeemers'])->name('api.redeemers');
});

require __DIR__.'/auth.php';



