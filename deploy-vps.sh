#!/bin/bash

# Deploy Script for UgandanJobs.net
# This script deploys the application using Docker Compose on the VPS

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Configuration
DEPLOYMENT_DIR="/var/www/ugandanjobs"
DOCKER_IMAGE="kiwanacollins/jobi-nextjs:latest"

# Navigate to deployment directory
cd "$DEPLOYMENT_DIR" || exit 1

# Pull latest Docker image
echo "📦 Pulling latest Docker image..."
docker pull "$DOCKER_IMAGE"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose --profile prod down || true

# Start services
echo "▶️  Starting services with Docker Compose..."
docker-compose --profile prod up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Check if containers are running
if docker ps | grep -q "jobi-nextjs" && docker ps | grep -q "jobi-mongodb"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Container Status:"
    docker-compose --profile prod ps
    echo ""
    echo "🌐 Application should be available at: https://ugandanjobs.net"
    
    # Test the application
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Application is responding to requests"
    else
        echo "⚠️  Application may still be starting up. Check logs with:"
        echo "   docker-compose --profile prod logs -f"
    fi
else
    echo "❌ Deployment failed! Containers are not running."
    echo ""
    echo "📋 Checking logs:"
    docker-compose --profile prod logs --tail 50
    exit 1
fi

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Useful commands:"
echo "  View logs:    docker-compose --profile prod logs -f"
echo "  Stop:         docker-compose --profile prod down"
echo "  Restart:      docker-compose --profile prod restart"
echo "  Status:       docker-compose --profile prod ps"
