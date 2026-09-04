<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'category',
        'title',
        'subtitle',
        'description',
        'image',
        'cta_text',
        'cta_link',
        'status',
        'priority',
    ];
}
