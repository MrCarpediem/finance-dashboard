#!/bin/bash
set -e

echo "🚀 Starting FinancePro Deployment..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# 1. Setup environment variables if .env doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file from .env.example..."
  cp .env.example .env
  
  # Generate real secrets for production
  JWT_SECRET=$(openssl rand -hex 32)
  JWT_REFRESH=$(openssl rand -hex 32)
  
  # Update the .env file with real secrets
  sed -i "s/financepro_super_secret_jwt_key_change_in_production_min50chars/$JWT_SECRET/g" .env
  sed -i "s/financepro_refresh_secret_change_in_production_min50/$JWT_REFRESH/g" .env
  
  echo "✅ Secure JWT keys generated in .env"
fi

# 2. Build and deploy via Docker Compose
echo "🐳 Building and starting Docker containers..."
docker-compose down
docker-compose up -d --build

# 3. Wait for database and auth-service to be healthy
echo "⏳ Waiting for services to initialize (this may take a few seconds)..."
sleep 15

# 4. Seed the database (Auth Service handles Prisma migrations locally, but let's seed the running container)
echo "🌱 Seeding the database..."
docker-compose exec -T auth-service npx prisma migrate deploy
docker-compose exec -T auth-service npm run seed

echo ""
echo "================================================================"
echo "🎉 FinancePro deployed successfully!"
echo "================================================================"
echo "🌐 Frontend Application: http://localhost"
echo "🔌 API Gateway:          http://localhost:3001"
echo ""
echo "Demo Accounts (Password for all: Admin@123):"
echo "  - admin@finance.com"
echo "  - analyst@finance.com"
echo "  - viewer@finance.com"
echo "================================================================"
