<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'filename',
        'original_url',
        'local_path',
        'category',
        'year',
        'extension',
        'file_size',
        'sha256',
        'download_status',
    ];
}
