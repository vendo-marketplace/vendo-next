#!/bin/bash
set -e

APP_NAME="vendo-fe"
CONTAINER_NAME="vendo-fe-app"
PORT=3100
API_URL="http://194.163.130.14:8030"

echo "📥 Pull latest changes from Git..."
git pull origin main

echo "🐳 Build Docker image..."
docker build \
  --no-cache \
  --build-arg VITE_API_BASE_URL=$API_URL \
  -t $APP_NAME \
  -f ./Dockerfile .

echo "🛑 Stop old container (if exists)..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

echo "🚀 Run new container..."
docker run -d --name $CONTAINER_NAME -p $PORT:80 $APP_NAME

echo "✅ Deployed successfully on port $PORT"