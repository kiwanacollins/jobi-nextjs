# Deployment Guide

This guide explains how to deploy the Jobi Next.js application to a VPS using Docker and GitHub Actions.

## Prerequisites

### 1. VPS Server Setup
- Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- SSH access configured
- Domain name pointing to your VPS (optional but recommended)

### 2. Docker Hub Account
- Create account at [hub.docker.com](https://hub.docker.com)
- Create a new repository for your project

### 3. GitHub Repository Secrets

Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

#### Docker Hub Secrets
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token (not password)

#### VPS Connection Secrets
- `VPS_HOST`: Your VPS IP address or domain
- `VPS_USER`: SSH username (usually 'ubuntu' or 'root')
- `VPS_SSH_KEY`: Private SSH key content
- `VPS_PORT`: SSH port (usually 22)

#### Application Environment Variables
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: Clerk sign-in URL (e.g., /sign-in)
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: Clerk sign-up URL (e.g., /sign-up)
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: Redirect URL after sign-in (e.g., /)
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: Redirect URL after sign-up (e.g., /chooseProfile)
- `NEXT_CLERK_WEBHOOK_SECRET`: Clerk webhook secret
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key
- `NEXT_PUBLIC_TINY_EDITOR_API_KEY`: TinyMCE editor API key
- `NEXT_PUBLIC_SERVER_URL`: Your application URL (e.g., https://yourdomain.com)
- `MONGODB_URL`: MongoDB connection string
- `MONGODB_DB_NAME`: MongoDB database name
- `NEXT_PUBLIC_SUPPRESS_HYDRATION_WARNINGS`: Set to "true" to suppress hydration warnings
- `ADMIN_EMAILS`: Comma-separated list of admin emails
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## VPS Server Preparation

### 1. Install Docker
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
```

### 2. Configure Firewall (Optional but recommended)
```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # For direct access to app
sudo ufw enable
```

### 3. Set up SSH Key Authentication
```bash
# On your local machine, generate SSH key if you don't have one
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy public key to VPS
ssh-copy-id username@your-vps-ip

# Test connection
ssh username@your-vps-ip
```

## Deployment Process

### 1. Push to Main Branch
The deployment will automatically trigger when you push to the `main` branch:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### 2. Monitor Deployment
- Go to your GitHub repository
- Click on "Actions" tab
- Watch the deployment progress

### 3. Verify Deployment
After successful deployment, your application will be available at:
- `http://your-vps-ip:3000`
- `http://yourdomain.com:3000` (if domain is configured)

## Setting up Reverse Proxy with Nginx (Recommended)

### 1. Install Nginx
```bash
sudo apt install nginx -y
```

### 2. Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/jobi-nextjs
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/jobi-nextjs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Setup SSL with Let's Encrypt (Optional)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Troubleshooting

### Check Container Logs
```bash
docker logs jobi-nextjs
```

### Check Container Status
```bash
docker ps -a
```

### Restart Container
```bash
docker restart jobi-nextjs
```

### Manual Deployment
If automated deployment fails, you can deploy manually:

```bash
# Pull latest image
docker pull yourusername/jobi-nextjs:latest

# Stop and remove existing container
docker stop jobi-nextjs
docker rm jobi-nextjs

# Run new container
docker run -d \
  --name jobi-nextjs \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file /home/username/jobi-nextjs/.env.local \
  yourusername/jobi-nextjs:latest
```

### Environment Variables
Ensure all required environment variables are properly set in the `.env.local` file on your VPS.

### Database Connection
Make sure your MongoDB instance is accessible from your VPS. If using MongoDB Atlas, ensure your VPS IP is whitelisted.

## Monitoring and Maintenance

### 1. Set up Log Rotation
```bash
# Create log rotation config
sudo nano /etc/logrotate.d/docker-containers

# Add content:
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
```

### 2. Regular Updates
- Keep your VPS system updated
- Monitor Docker image sizes and clean up old images
- Monitor application logs for errors

### 3. Backup Strategy
- Set up regular database backups
- Consider backing up your `.env.local` file securely
- Document your deployment configuration

## Security Considerations

1. **Firewall**: Only open necessary ports
2. **SSH**: Use key-based authentication, disable password login
3. **SSL**: Always use HTTPS in production
4. **Environment Variables**: Never commit secrets to version control
5. **Updates**: Keep Docker, Node.js, and system packages updated
6. **Monitoring**: Set up monitoring and alerting for your application

## Performance Optimization

1. **Enable Gzip**: Configure Nginx to compress responses
2. **Caching**: Set up appropriate caching headers
3. **CDN**: Consider using a CDN for static assets
4. **Database**: Optimize MongoDB queries and indexes
5. **Monitoring**: Use tools like PM2 or monitoring services

## Support

If you encounter issues during deployment:

1. Check GitHub Actions logs
2. Check Docker container logs
3. Verify all environment variables are set correctly
4. Ensure VPS has sufficient resources (RAM, disk space)
5. Check network connectivity between VPS and external services