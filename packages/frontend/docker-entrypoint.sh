#!/bin/sh

# This script is used in Docker to inject runtime environment variables
# into the built JavaScript files since Vite bakes in env vars at build time

set -e

# Replace placeholder with actual environment variable
# Check VITE_GRAPHQL_URL first (Coolify standard), then GRAPHQL_URL, default to /graphql
GRAPHQL_URL=${VITE_GRAPHQL_URL:-${GRAPHQL_URL:-/graphql}}

echo "Injecting GRAPHQL_URL: $GRAPHQL_URL"

# Find all JS files in the build and replace the placeholder
find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|__VITE_GRAPHQL_URL__|$GRAPHQL_URL|g" {} +

# Start nginx
exec "$@"
