# Docker Setup for Ugandan Jobs Next.js Application

This document provides instructions for running the Ugandan Jobs application using Docker.

## Prerequisites

- Docker Desktop installed on your machine
- Docker Compose (included with Docker Desktop)
- **Docker Desktop must be running** (start via Applications or `open -a Docker`)

## Quick Start

### 1. Start Docker Desktop

Make sure Docker Desktop is running:
```bash
# Start Docker Desktop (macOS)
open -a Docker

# Verify Docker is running
docker info
```

### 2. Initial Setup

```bash
# Run the setup script
./docker-scripts.sh setup
```

This will:
- Check if Docker is installed
- Create `.env.docker` from the example file
- Set up the environment

### 3. Configure Environment Variables

You can reuse your existing `.env.local`. The compose files are configured to load `.env.local` automatically, with only the database host overridden to point at the Docker network host (`mongodb` / `mongodb-dev`).

If you prefer a separate file, copy from the example:

```bash
# Create a separate env if desired
cp .env.docker.example .env.docker

# Update these with your actual values (or keep using .env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_actual_clerk_key
CLERK_SECRET_KEY=your_actual_clerk_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 4. Start the Application

#### Development Mode (with hot reload)
```bash
./docker-scripts.sh dev-up
```

#### Production Mode
```bash
./docker-scripts.sh prod-up
```

## Available Services

When running, you can access:

- **Application**: http://localhost:3000
- **MongoDB Express** (Database UI): http://localhost:8081
- **MongoDB**: localhost:27017

## Docker Scripts Commands

```bash
# Development
./docker-scripts.sh dev-up      # Start development environment
./docker-scripts.sh dev-down    # Stop development environment

# Production
./docker-scripts.sh prod-up     # Start production environment
./docker-scripts.sh prod-down   # Stop production environment
./docker-scripts.sh build       # Build production image

# Monitoring
./docker-scripts.sh logs        # Show application logs
./docker-scripts.sh db-logs     # Show database logs

# Maintenance
./docker-scripts.sh clean       # Clean up Docker resources
./docker-scripts.sh setup       # Initial setup
./docker-scripts.sh help        # Show help
```

## Manual Docker Commands

If you prefer to use Docker commands directly:

### Development
```bash
# Start development environment
docker-compose --profile dev up -d

# Stop development environment
docker-compose --profile dev down
```

### Production
```bash
# Build and start production environment
docker-compose --profile prod up -d

# Stop production environment
docker-compose --profile prod down

# Build production image only
docker-compose build ugandan-jobs-app
```

## File Structure

```
├── Dockerfile              # Multi-stage Dockerfile (dev and prod targets)
├── docker-compose.yml      # Single compose file with dev/prod profiles
├── .dockerignore           # Files to ignore in Docker build
├── .env.docker.example     # Example environment file
└── docker-scripts.sh       # Management scripts
```

## Environment Configuration

### Development vs Production

**Development Mode:**
- Uses `dev` target from Dockerfile and `--profile dev`
- Hot reload enabled with `npm run dev`
- Source code mounted as volume
- Development dependencies included
- MongoDB data persisted in volume

**Production Mode:**
- Uses default (production) target from Dockerfile and `--profile prod`
- Optimized build with standalone output
- Multi-stage build for smaller image size
- No development dependencies
- Production-ready configuration

### MongoDB Configuration

The Docker setup includes:
- MongoDB 7.0 with authentication
- Persistent data storage
- MongoDB Express for database management
- Default credentials: admin/password (change in production)

## Troubleshooting

### Port Conflicts
If ports 3000, 8081, or 27017 are already in use:
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :8081
lsof -i :27017

# Stop conflicting services or modify docker-compose.yml ports
```

### Permission Issues
```bash
# Reset Docker permissions
sudo chown -R $USER:$USER .
```

### Database Connection Issues
```bash
# Check MongoDB logs
./docker-scripts.sh db-logs

# Restart MongoDB service
docker-compose restart mongodb
```

### Clean Start
```bash
# Stop all containers and clean up
./docker-scripts.sh clean
docker-compose down -v  # Remove volumes too
./docker-scripts.sh dev-up  # Or prod-up
```

## Security Notes

- Change default MongoDB credentials in production
- Use environment-specific `.env` files
- Don't commit sensitive environment variables
- Use Docker secrets for production deployments

## Performance Tips

- Use multi-stage builds (already implemented)
- Optimize Docker layer caching
- Use `.dockerignore` to exclude unnecessary files
- Consider using Alpine Linux images for smaller size

## Production Deployment

For production deployment:

1. Update environment variables in `.env.docker`
2. Use proper MongoDB credentials
3. Consider using managed MongoDB (Atlas)
4. Set up proper networking and security
5. Use a reverse proxy (nginx) if needed
6. Set up monitoring and logging

```bash
# Production build and deploy
./docker-scripts.sh build
./docker-scripts.sh prod-up
```