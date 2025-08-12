#!/bin/bash

# Setup script for local development
echo "Setting up local development environment..."

# Create wrangler.jsonc for local development
if [ ! -f "wrangler.jsonc" ]; then
    echo "Creating wrangler.jsonc for local development..."
    cp wrangler.local.jsonc wrangler.jsonc
    echo "✅ wrangler.jsonc created for local development"
else
    echo "⚠️  wrangler.jsonc already exists"
fi

echo "🚀 Ready for local development!"
echo "You can now run: npm run dev"
