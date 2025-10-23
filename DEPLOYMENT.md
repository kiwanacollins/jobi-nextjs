# Deployment & Migration Guide

## Quick Start

### Deploy to Production

```bash
# Pull latest image from DockerHub
docker compose --profile prod pull

# Start production services
docker compose --profile prod up -d

# Check logs
docker compose --profile prod logs -f jobi-app
```

### Run Image Migration (One-Time)

After deploying a new version with the migration script, run:

```bash
# Option 1: Using the helper script
chmod +x migrate.sh
./migrate.sh

# Option 2: Direct docker compose command
docker compose run --rm migrate

# Option 3: Using the API endpoint (after app is running)
curl -X POST "https://ugandanjobs.net/api/admin/migrate-images?secret=migrate-now-2025"
```

## Full Deployment Process

### 1. Push Code Changes

```bash
# Commit your changes
git add .
git commit -m "Your commit message"
git push origin main
```

### 2. Build and Push Docker Image

This should be automated via GitHub Actions, but if manual:

```bash
# Build the production image
docker build -t kiwanacollins/jobi-nextjs:latest .

# Push to DockerHub
docker push kiwanacollins/jobi-nextjs:latest
```

### 3. Deploy on Server

```bash
# SSH to your server
ssh root@your-server

# Navigate to project directory
cd ~/www/var/ugandanjobs

# Pull latest image
docker compose --profile prod pull

# Restart services
docker compose --profile prod up -d --force-recreate

# Check if services are running
docker compose --profile prod ps
```

### 4. Run Migrations (If Needed)

```bash
# Run the migration
docker compose run --rm migrate

# Or use the API endpoint
curl -X POST "https://ugandanjobs.net/api/admin/migrate-images?secret=migrate-now-2025"
```

## Environment Variables

Make sure your `.env.local` file on the server has:

```bash
# Cloudinary (for image hosting)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# MongoDB
MONGO_ROOT_PASSWORD=your_secure_password
MONGODB_URL=mongodb://admin:password@mongodb:27017/jobiNextjs?authSource=admin

# Site URL
NEXT_PUBLIC_SITE_URL=https://ugandanjobs.net

# Other required variables...
```

## Troubleshooting

### Migration Issues

```bash
# Check migration logs
docker compose logs migrate

# Run migration with verbose output
docker compose run --rm migrate

# Check if containers are running
docker compose --profile prod ps

# View app logs
docker compose --profile prod logs -f jobi-app
```

### App Not Starting

```bash
# Check logs
docker compose --profile prod logs jobi-app

# Restart services
docker compose --profile prod restart

# Rebuild from scratch
docker compose --profile prod down
docker compose --profile prod up -d
```

## Docker Compose Profiles

- `dev` - Development environment with hot reload
- `prod` - Production environment  
- `tools` - Utility services like migrations

## Migration Script Details

The migration script (`scripts/migrate-company-images.js`):
1. Connects to MongoDB
2. Finds all jobs with base64 company images
3. Uploads images to Cloudinary
4. Updates database with Cloudinary URLs
5. Prints summary report

This fixes WhatsApp sharing by ensuring company logos are hosted on Cloudinary instead of being base64 data.
