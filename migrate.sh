#!/bin/bash

# Migration Runner Script
# This script runs the image migration using Docker Compose

echo "🚀 Starting Company Image Migration..."
echo ""

# Check if docker compose is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not in PATH"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found. Please run this script from the project root."
    exit 1
fi

# Run the migration
echo "📦 Running migration container..."
docker compose run --rm migrate

# Check the exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo "💡 Company logos will now display when jobs are shared on WhatsApp."
else
    echo ""
    echo "❌ Migration failed. Check the output above for errors."
    exit 1
fi
