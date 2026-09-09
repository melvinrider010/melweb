<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class MediaUploadController extends Controller
{
    /**
     * Upload an image or media asset.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => [
                'required',
                'file',
                'max:15360', // max 15MB
                'mimes:jpg,jpeg,png,webp,pdf',
                'mimetypes:image/jpeg,image/png,image/webp,application/pdf',
            ],
            'category' => 'nullable|string|max:50',
            'alt_text' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
        $extension = strtolower($file->guessExtension() ?: $file->extension());
        
        if (!in_array($extension, $allowedExtensions, true)) {
            return response()->json(['message' => 'Unsupported or prohibited file type.'], 422);
        }

        // Generate cryptographically unique filename, never preserving raw client executable paths
        $filename = Str::uuid() . '.' . $extension;
        
        $path = $file->storeAs('uploads/media', $filename, 'public');
        $url = '/storage/' . $path;

        // Auto-sync file to public accessible directories for instant live rendering
        try {
            $backendPublicDir = public_path('storage/uploads/media');
            if (!file_exists($backendPublicDir)) {
                mkdir($backendPublicDir, 0777, true);
            }
            copy($file->getRealPath(), $backendPublicDir . DIRECTORY_SEPARATOR . $filename);

            $frontendPublicDir = base_path('../public/storage/uploads/media');
            if (!file_exists($frontendPublicDir)) {
                mkdir($frontendPublicDir, 0777, true);
            }
            copy($file->getRealPath(), $frontendPublicDir . DIRECTORY_SEPARATOR . $filename);

            $frontendFacultyDir = base_path('../public/assets/faculty/uploads');
            if (!file_exists($frontendFacultyDir)) {
                mkdir($frontendFacultyDir, 0777, true);
            }
            copy($file->getRealPath(), $frontendFacultyDir . DIRECTORY_SEPARATOR . $filename);
        } catch (\Throwable $e) {
            // Silently continue if directory copy is restricted
        }

        $media = Media::create([
            'id' => 'img_' . Str::random(8),
            'original_url' => $url,
            'local_path' => $path,
            'filename' => $filename,
            'category' => $request->input('category', 'campus'),
            'alt_text' => $request->input('alt_text', $file->getClientOriginalName()),
            'file_size' => $file->getSize(),
            'sha256' => hash_file('sha256', $file->getRealPath()),
            'download_status' => 'Uploaded',
            'discovered_at' => now()->toDateString(),
        ]);

        ActivityLog::create([
            'id' => 'log_' . Str::random(8),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email ?: 'admin@stphilos.ac.in',
            'action' => 'UPLOAD_MEDIA',
            'module' => 'Media',
            'details' => "Uploaded media file '{$filename}'.",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'File uploaded successfully.',
            'url' => $url,
            'media' => $media,
        ], 201);
    }
}
