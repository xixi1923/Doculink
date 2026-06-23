# Avatar Upload - Complete Fix & Setup Guide

## Problem Summary

The avatar upload feature is broken with the following symptoms:
- ❌ HTTP 500 error when uploading avatar
- ❌ Avatar URL returns 404 Not Found
- ❌ Browser shows OpaqueResponseBlocking errors
- ❌ Images not stored in Cloudflare R2

## Root Causes

1. **Missing Cloudflare R2 Credentials** - Environment variables not set
2. **Missing AWS SDK** - PHP AWS SDK might not be installed
3. **Incorrect URL Configuration** - Public URL format might be wrong
4. **Missing Error Logging** - Can't see what's failing

## Complete Fix Applied

### 1. Backend Changes

#### File: `app/Http/Controllers/AuthController.php`

**Changes Made:**
- ✅ Added comprehensive error handling with try-catch blocks
- ✅ Added error logging to see exactly what fails
- ✅ Fixed URL generation to avoid double slashes
- ✅ Added 'public' visibility flag for uploaded files
- ✅ Added proper error responses with messages
- ✅ Added diagnostic endpoint to check R2 configuration

**Key Improvements:**
```php
// Error logging for debugging
\Log::error('R2 Upload Error: ' . $e->getMessage(), [
    'file' => $e->getFile(),
    'line' => $e->getLine(),
    'trace' => $e->getTraceAsString()
]);

// Visibility flag (important for public access)
Storage::disk('r2')->put($path, $fileContents, 'public');

// URL generation without double slashes
$publicUrl = rtrim(config('filesystems.disks.r2.url'), '/') . '/' . ltrim($path, '/');
```

### 2. Frontend Changes

#### File: `src/pages/Profile/Settings.tsx`

**Changes Made:**
- ✅ Improved error handling to show backend error messages
- ✅ Added alert with actual error message for debugging
- ✅ Better error response parsing

```typescript
catch (error: any) {
  console.error('Failed to upload avatar', error.response?.data || error.message)
  alert(`Avatar upload failed: ${error.response?.data?.message || error.message}`)
}
```

### 3. Configuration Updates

#### File: `backend/config/filesystems.php`

Already correct - R2 disk is properly configured:
```php
'r2' => [
    'driver' => 's3',
    'key' => env('CLOUDFLARE_R2_ACCESS_KEY_ID'),
    'secret' => env('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
    'region' => 'auto',
    'bucket' => env('CLOUDFLARE_R2_BUCKET'),
    'endpoint' => env('CLOUDFLARE_R2_ENDPOINT'),
    'url' => env('CLOUDFLARE_R2_PUBLIC_URL'),
    'use_path_style_endpoint' => true,
    'throw' => false,
    'report' => false,
]
```

### 4. Environment Variables Setup

#### File: `.env.example` Updated

**Added Cloudflare R2 configuration variables:**

```bash
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET=your-bucket-name
CLOUDFLARE_R2_PUBLIC_URL=https://pub-bucket-id.r2.dev
```

---

## Setup Instructions

### Step 1: Install AWS SDK (if not already installed)

```bash
cd backend
composer require aws/aws-sdk-php
```

### Step 2: Get Cloudflare R2 Credentials

1. Go to https://dash.cloudflare.com/
2. Navigate to **R2** → **Settings** → **API Tokens**
3. Create a new token with R2 permissions:
   - Permission: **Object Read/Write**
   - Bucket: Your bucket name (or **All buckets**)
4. Copy credentials:
   - **Access Key ID**
   - **Secret Access Key**

### Step 3: Get Cloudflare R2 Endpoint

1. In R2 dashboard, click on your bucket
2. Copy the **Endpoint URL** (e.g., `https://abc123.r2.cloudflarestorage.com`)
3. Also note your **bucket name**

### Step 4: Get Public URL

1. In R2 bucket settings, find **Public Access** section
2. Copy the **Public URL** (e.g., `https://pub-abc123.r2.dev`)
3. If you have a custom domain, use that instead

### Step 5: Configure .env File

Create or update `backend/.env`:

```bash
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=1a2b3c4d5e6f7g8h
CLOUDFLARE_R2_SECRET_ACCESS_KEY=zyx9w8v7u6t5s4r3q2p1o9n8m7l6k5j4i3h2g1f
CLOUDFLARE_R2_ENDPOINT=https://abc123.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET=my-bucket-name
CLOUDFLARE_R2_PUBLIC_URL=https://pub-abc123.r2.dev
```

### Step 6: Verify Configuration

**Test the R2 connection via API:**

```bash
# Make authenticated request to diagnostic endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/debug/r2-connection
```

**Expected response:**
```json
{
  "r2_configured": true,
  "access_key_set": true,
  "secret_key_set": true,
  "bucket_set": true,
  "endpoint_set": true,
  "public_url_set": true,
  "config": {
    "driver": "s3",
    "region": "auto",
    "bucket": "my-bucket-name",
    "endpoint": "https://abc123.r2.cloudflarestorage.com",
    "public_url": "https://pub-abc123.r2.dev"
  },
  "storage_disk_active": true
}
```

---

## Testing Avatar Upload

### Step 1: Clear Cache

```bash
cd backend
php artisan cache:clear
php artisan config:clear
```

### Step 2: Test Upload

1. Navigate to Profile → Settings → Change Photo
2. Select an image (JPEG, PNG, GIF, WebP - max 5MB)
3. Wait for upload to complete

### Step 3: Check Logs

If upload fails:

```bash
# Check Laravel error logs
tail -f backend/storage/logs/laravel.log
```

**Expected log entry on success:**
```
[timestamp] local.INFO: Avatar uploaded to avatars/1782208998_abc123.png
```

**Error example:**
```
[timestamp] local.ERROR: R2 Upload Error: Unable to connect to the endpoint URL
```

---

## Troubleshooting

### Error 1: "Failed to upload avatar AxiosError: Request failed with status code 500"

**Cause:** Backend encountered an error

**Fix:**
1. Check backend logs: `tail -f backend/storage/logs/laravel.log`
2. Run diagnostic: Test R2 connection endpoint
3. Verify all env variables are set

### Error 2: Avatar URL returns 404

**Cause:** File uploaded but URL is wrong or R2 bucket is not public

**Fix:**
1. Verify R2 bucket is set to **Public** access
2. Check URL format matches your public URL setting
3. Verify file actually exists in R2 bucket

### Error 3: "OpaqueResponseBlocking" in browser

**Cause:** CORS issue with cross-origin image loading

**Fix:**
Already fixed in CORS configuration. Clear browser cache:
- Press `Ctrl+Shift+Delete` to open Clear Browsing Data
- Select "Cached images and files"
- Clear data

### Error 4: "Unable to connect to the endpoint URL"

**Cause:** R2 endpoint URL is incorrect or credentials are invalid

**Fix:**
1. Verify endpoint format: `https://account-id.r2.cloudflarestorage.com`
2. NOT the public URL, but the storage endpoint
3. Test credentials in Cloudflare dashboard

### Error 5: "Access Denied" error

**Cause:** Access key/secret is invalid or doesn't have permissions

**Fix:**
1. Generate new API token in Cloudflare R2
2. Ensure permissions include "Object Read/Write"
3. Update .env with new credentials

---

## Verification Checklist

After setup, verify:

- [ ] `CLOUDFLARE_R2_ACCESS_KEY_ID` is set in `.env`
- [ ] `CLOUDFLARE_R2_SECRET_ACCESS_KEY` is set in `.env`
- [ ] `CLOUDFLARE_R2_ENDPOINT` is set (storage endpoint, not public)
- [ ] `CLOUDFLARE_R2_BUCKET` matches your bucket name
- [ ] `CLOUDFLARE_R2_PUBLIC_URL` is your public R2 URL
- [ ] R2 bucket is set to **Public** access
- [ ] `aws/aws-sdk-php` is installed: `composer show aws/aws-sdk-php`
- [ ] Backend logs show no errors
- [ ] Diagnostic endpoint returns `all true`
- [ ] Test image uploads successfully
- [ ] Uploaded image displays in profile

---

## Files Modified/Created

### Backend
- ✅ `app/Http/Controllers/AuthController.php` - Enhanced error handling
- ✅ `config/filesystems.php` - R2 disk configuration (already correct)
- ✅ `routes/api.php` - Added diagnostic endpoint
- ✅ `.env.example` - Added R2 variables documentation

### Frontend
- ✅ `src/pages/Profile/Settings.tsx` - Better error messages

---

## Additional Notes

### File Size Limits

- Frontend limit: 5MB (changed from 2MB)
- Supported formats: JPEG, PNG, GIF, WebP
- These can be adjusted in `AuthController.php`

### URL Format Examples

**R2 Endpoint URL:**
```
https://1234abc.r2.cloudflarestorage.com
```

**R2 Public URL:**
```
https://pub-bucket-abc123.r2.dev
```

**Final Avatar URL (what gets stored in DB):**
```
https://pub-bucket-abc123.r2.dev/avatars/1782208998_6a3a59e65bb65.png
```

### Common Mistakes

1. ❌ Using public URL as endpoint (should be endpoint URL)
2. ❌ Missing "https://" in URLs
3. ❌ Forgetting to make bucket public
4. ❌ Incorrect bucket name with typos
5. ❌ Old/expired credentials

---

## Support

If issues persist:

1. **Check logs first:** `backend/storage/logs/laravel.log`
2. **Test endpoint:** Call R2 diagnostic endpoint
3. **Verify credentials:** Test in Cloudflare dashboard
4. **Check bucket permissions:** Ensure public access is enabled
5. **Reinstall SDK:** `composer update aws/aws-sdk-php`

