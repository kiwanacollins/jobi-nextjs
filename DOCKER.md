# Docker Setup for Ugandan Jobs Next.js Application


#### Development Mode (with hot reload)
```bash
./docker-scripts.sh dev-up
```

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