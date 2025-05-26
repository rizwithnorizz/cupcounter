<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Redeem extends Model
{

    protected $table = 'redeems';
    protected $fillable = [
        'student_number',
        'name',
        'year',
        'program'
    ];
}
