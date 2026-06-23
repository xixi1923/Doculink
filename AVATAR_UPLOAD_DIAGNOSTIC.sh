#!/bin/bash
# Avatar Upload Diagnostic Script
# Usage: bash AVATAR_UPLOAD_DIAGNOSTIC.sh <your-api-token>

if [ -z "$1" ]; then
    echo "Usage: bash AVATAR_UPLOAD_DIAGNOSTIC.sh <your-auth-token>"
    echo "Example: bash AVATAR_UPLOAD_DIAGNOSTIC.sh eyJ0eXAiOiJKV1QiLCJhbGc..."
    exit 1
fi

TOKEN=$1
API_URL="http://localhost:8000/api"

echo "================================"
echo "Avatar Upload Diagnostic Report"
echo "================================"
echo ""

# Test 1: Check if API is running
echo "1. Testing API connectivity..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/debug/r2-connection" \
  -H "Authorization: Bearer $TOKEN")

if [ "$STATUS" = "200" ]; then
    echo "✓ API is running and accessible"
else
    echo "✗ API error (HTTP $STATUS)"
    echo "  Make sure Laravel is running on http://localhost:8000"
    exit 1
fi

echo ""

# Test 2: Check R2 Configuration
echo "2. Checking R2 Configuration..."
R2_CONFIG=$(curl -s "$API_URL/debug/r2-connection" \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo "$R2_CONFIG" | jq '.' 2>/dev/null || echo "$R2_CONFIG"

echo ""

# Extract values for additional checks
R2_CONFIGURED=$(echo "$R2_CONFIG" | jq -r '.r2_configured // false')
ACCESS_KEY_SET=$(echo "$R2_CONFIG" | jq -r '.access_key_set // false')
SECRET_KEY_SET=$(echo "$R2_CONFIG" | jq -r '.secret_key_set // false')
BUCKET_SET=$(echo "$R2_CONFIG" | jq -r '.bucket_set // false')
ENDPOINT_SET=$(echo "$R2_CONFIG" | jq -r '.endpoint_set // false')
PUBLIC_URL_SET=$(echo "$R2_CONFIG" | jq -r '.public_url_set // false')

echo "3. Configuration Status:"
[ "$R2_CONFIGURED" = "true" ] && echo "✓ R2 disk configured" || echo "✗ R2 disk NOT configured"
[ "$ACCESS_KEY_SET" = "true" ] && echo "✓ Access Key ID set" || echo "✗ Access Key ID NOT set"
[ "$SECRET_KEY_SET" = "true" ] && echo "✓ Secret Key set" || echo "✗ Secret Key NOT set"
[ "$BUCKET_SET" = "true" ] && echo "✓ Bucket name set" || echo "✗ Bucket name NOT set"
[ "$ENDPOINT_SET" = "true" ] && echo "✓ Endpoint URL set" || echo "✗ Endpoint URL NOT set"
[ "$PUBLIC_URL_SET" = "true" ] && echo "✓ Public URL set" || echo "✗ Public URL NOT set"

echo ""

# Test 4: Check Laravel logs
echo "4. Recent Laravel Log Entries:"
if [ -f "backend/storage/logs/laravel.log" ]; then
    echo "Last 10 errors:"
    grep -i "error\|exception" backend/storage/logs/laravel.log | tail -10
else
    echo "✗ Log file not found at backend/storage/logs/laravel.log"
fi

echo ""

# Test 5: Check AWS SDK installation
echo "5. Checking AWS SDK Installation..."
if grep -q '"aws/aws-sdk-php"' backend/composer.lock; then
    echo "✓ AWS SDK is installed"
    AWS_VERSION=$(grep -A 5 '"aws/aws-sdk-php"' backend/composer.lock | grep '"version"' | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')
    echo "  Version: $AWS_VERSION"
else
    echo "✗ AWS SDK NOT installed"
    echo "  Run: cd backend && composer require aws/aws-sdk-php"
fi

echo ""

# Test 6: PHP Configuration
echo "6. PHP Configuration Check..."
php -r "echo 'PHP Version: ' . PHP_VERSION . PHP_EOL;"
php -r "echo 'cURL support: ' . (function_exists('curl_version') ? 'Yes' : 'No') . PHP_EOL;"
php -r "echo 'GD support: ' . (extension_loaded('gd') ? 'Yes' : 'No') . PHP_EOL;"

echo ""

echo "================================"
echo "Diagnostic Summary"
echo "================================"

if [ "$R2_CONFIGURED" = "true" ] && [ "$ACCESS_KEY_SET" = "true" ] && [ "$SECRET_KEY_SET" = "true" ]; then
    echo "✓ R2 appears to be configured correctly"
    echo "Try uploading an avatar to test"
else
    echo "✗ R2 configuration is incomplete"
    echo ""
    echo "Required actions:"
    [ "$ACCESS_KEY_SET" != "true" ] && echo "  1. Set CLOUDFLARE_R2_ACCESS_KEY_ID in .env"
    [ "$SECRET_KEY_SET" != "true" ] && echo "  1. Set CLOUDFLARE_R2_SECRET_ACCESS_KEY in .env"
    [ "$BUCKET_SET" != "true" ] && echo "  2. Set CLOUDFLARE_R2_BUCKET in .env"
    [ "$ENDPOINT_SET" != "true" ] && echo "  3. Set CLOUDFLARE_R2_ENDPOINT in .env"
    [ "$PUBLIC_URL_SET" != "true" ] && echo "  4. Set CLOUDFLARE_R2_PUBLIC_URL in .env"
    echo ""
    echo "After updating .env, run:"
    echo "  php artisan config:clear"
    echo "  php artisan cache:clear"
fi

echo ""
