#!/bin/bash

# Jobi Docker Management Scripts

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Help function
show_help() {
    echo -e "${BLUE}Jobi Docker Management${NC}"
    echo ""
    echo "Usage: ./docker-scripts.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev-up       Start development environment"
    echo "  dev-down     Stop development environment"
    echo "  prod-up      Start production environment"
    echo "  prod-down    Stop production environment"
    echo "  build        Build production image"
    echo "  logs         Show application logs"
    echo "  db-logs      Show database logs"
    echo "  clean        Clean up containers and images"
    echo "  setup        Initial setup for Docker environment"
    echo "  help         Show this help message"
}

# Setup function
setup_docker() {
    print_status "Setting up Docker environment..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if docker-compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Create .env.docker from example
    if [ ! -f ".env.docker" ]; then
        print_status "Creating .env.docker from example..."
        cp .env.docker.example .env.docker
        print_warning "Please update .env.docker with your actual environment variables"
    fi
    
    print_status "Docker environment setup complete!"
}

# Development environment functions
dev_up() {
    print_status "Starting development environment..."
    docker-compose --profile dev up -d
    print_status "Development environment started!"
    print_status "Application: http://localhost:3000"
    print_status "MongoDB Express: http://localhost:8081"
}

dev_down() {
    print_status "Stopping development environment..."
    docker-compose --profile dev down
    print_status "Development environment stopped!"
}

# Production environment functions
prod_up() {
    print_status "Starting production environment..."
    docker-compose --profile prod up -d
    print_status "Production environment started!"
    print_status "Application: http://localhost:3000"
    print_status "MongoDB Express: http://localhost:8081"
}

prod_down() {
    print_status "Stopping production environment..."
    docker-compose --profile prod down
    print_status "Production environment stopped!"
}

# Build production image
build_prod() {
    print_status "Building production image..."
    docker-compose build jobi-app
    print_status "Production image built successfully!"
}

# Show logs
show_logs() {
    print_status "Showing application logs..."
    # Try to show logs for whichever app container is running
    if docker ps | grep -q jobi-nextjs-dev; then
        docker-compose logs -f jobi-app-dev
    else
        docker-compose logs -f jobi-app
    fi
}

show_db_logs() {
    print_status "Showing database logs..."
    docker-compose logs -f mongodb
}

# Clean up
clean_docker() {
    print_warning "This will remove all stopped containers and unused images."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up Docker resources..."
        docker system prune -f
        print_status "Cleanup complete!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Main script logic
case "$1" in
    "dev-up")
        dev_up
        ;;
    "dev-down")
        dev_down
        ;;
    "prod-up")
        prod_up
        ;;
    "prod-down")
        prod_down
        ;;
    "build")
        build_prod
        ;;
    "logs")
        show_logs
        ;;
    "db-logs")
        show_db_logs
        ;;
    "clean")
        clean_docker
        ;;
    "setup")
        setup_docker
        ;;
    "help"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac