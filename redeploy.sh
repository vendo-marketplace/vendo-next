#!/bin/bash
set -e

APP_NAME="vendo-fe"
CONTAINER_NAME="vendo-fe-app"
PORT=3100

echo "📥 Pull latest changes from Git..."
git pull origin main

echo "📄 Load environment variables..."
set -a
source .env
set +a

echo "🐳 Build Docker image..."
docker build \
  --no-cache \
  --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID="$NEXT_PUBLIC_GOOGLE_CLIENT_ID" \
  -t "$APP_NAME" \
  -f ./Dockerfile .

echo "🛑 Stop old container (if exists)..."
docker stop "$CONTAINER_NAME" || true
docker rm "$CONTAINER_NAME" || true

echo "🚀 Run new container..."
docker run -d \
  --name "$CONTAINER_NAME" \
  -p "$PORT:3000" \
  "$APP_NAME"

echo "✅ Deployed successfully on port $PORT"