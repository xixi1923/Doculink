<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/admin');
});

Route::get('/admin/{any?}', function () {
    return redirect()->away('http://localhost:3000/');
})->where('any', '.*');

// require __DIR__.'/auth.php';
