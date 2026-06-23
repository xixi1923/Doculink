<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class MessageAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
    ];

    protected $appends = ['file_url', 'thumbnail_url', 'display_type'];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }

    /**
     * Generate the full file URL
     */
    public function fileUrl(): Attribute
    {
        return new Attribute(
            get: fn () => url('storage/' . $this->file_path)
        );
    }

    /**
     * Generate thumbnail URL (same as file for now, can be enhanced with image processing)
     */
    public function thumbnailUrl(): Attribute
    {
        return new Attribute(
            get: fn () => url('storage/' . $this->file_path)
        );
    }

    /**
     * Determine the display type for rendering
     */
    public function displayType(): Attribute
    {
        return new Attribute(
            get: function () {
                $type = strtolower($this->file_type ?? '');
                $name = strtolower($this->file_name ?? '');

                if (str_starts_with($type, 'image/')) {
                    return 'image';
                } elseif (str_starts_with($type, 'video/')) {
                    return 'video';
                } elseif (str_contains($type, 'pdf') || str_ends_with($name, '.pdf')) {
                    return 'pdf';
                } elseif (
                    str_contains($type, 'word') ||
                    str_contains($type, 'document') ||
                    str_contains($type, 'msword') ||
                    str_ends_with($name, '.doc') ||
                    str_ends_with($name, '.docx')
                ) {
                    return 'document';
                } elseif (
                    str_contains($type, 'presentation') ||
                    str_contains($type, 'powerpoint') ||
                    str_ends_with($name, '.ppt') ||
                    str_ends_with($name, '.pptx')
                ) {
                    return 'presentation';
                } elseif (
                    str_contains($type, 'sheet') ||
                    str_contains($type, 'excel') ||
                    str_ends_with($name, '.xls') ||
                    str_ends_with($name, '.xlsx') ||
                    str_ends_with($name, '.csv')
                ) {
                    return 'spreadsheet';
                } elseif (
                    str_contains($type, 'zip') ||
                    str_contains($type, 'archive') ||
                    str_contains($type, 'compressed') ||
                    str_ends_with($name, '.zip') ||
                    str_ends_with($name, '.rar') ||
                    str_ends_with($name, '.7z')
                ) {
                    return 'archive';
                } elseif (str_contains($type, 'text/') || str_ends_with($name, '.txt')) {
                    return 'text';
                }

                return 'file';
            }
        );
    }

}
