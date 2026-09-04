<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'original_url',
        'local_path',
        'filename',
        'category',
        'alt_text',
        'file_size',
        'sha256',
        'download_status',
        'discovered_at',
    ];
}
