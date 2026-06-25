<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function getPresignedUrl(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'file_type' => 'required|string',
            'folder' => 'required|string|in:universities/logos,universities/covers,books/covers,books/pdfs,documents',
        ]);

        $extension = pathinfo($request->filename, PATHINFO_EXTENSION);
        $safeName = time() . '_' . Str::random(10) . '.' . $extension;
        $path = $request->folder . '/' . $safeName;

        $disk = Storage::disk('r2');
        $adapter = $disk->getAdapter();

        // Robust way to get the S3 Client across different Laravel/Flysystem versions
        if (method_exists($disk, 'getClient')) {
            $client = $disk->getClient();
        } elseif (method_exists($adapter, 'getClient')) {
            $client = $adapter->getClient();
        } else {
            return response()->json(['message' => 'Cloudflare R2 driver configuration error. S3 Client not found.'], 500);
        }
        $bucket = config('filesystems.disks.r2.bucket');

        $command = $client->getCommand('PutObject', [
            'Bucket' => $bucket,
            'Key'    => $path,
            'ContentType' => $request->file_type,
        ]);

        $expiry = '+20 minutes';
        $presignedRequest = $client->createPresignedRequest($command, $expiry);
        $url = (string) $presignedRequest->getUri();

        return response()->json([
            'upload_url' => $url,
            'file_path' => $path,
            'public_url' => rtrim(config('filesystems.disks.r2.url'), '/') . '/' . $path
        ]);
    }
}
