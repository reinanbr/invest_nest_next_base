#!/bin/bash

# Build das imagens Docker para Kubernetes
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
REGISTRY=${1:-"local"}  # local ou registry remoto
TAG=${2:-"latest"}

echo -e "${BLUE}🚀 Iniciando build das imagens Docker para InvestSim Pro${NC}"

# Build Backend
echo -e "${YELLOW}📦 Building Backend image...${NC}"
cd backend
docker build -t ${REGISTRY}/investsim-backend:${TAG} .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend image built successfully${NC}"
else
    echo -e "${RED}❌ Failed to build backend image${NC}"
    exit 1
fi
cd ..

# Build Frontend
echo -e "${YELLOW}📦 Building Frontend image...${NC}"
cd frontend
docker build -t ${REGISTRY}/investsim-frontend:${TAG} .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend image built successfully${NC}"
else
    echo -e "${RED}❌ Failed to build frontend image${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}🎉 All images built successfully!${NC}"

# Se não for local registry, fazer push
if [ "$REGISTRY" != "local" ]; then
    echo -e "${YELLOW}📤 Pushing images to registry...${NC}"
    docker push ${REGISTRY}/investsim-backend:${TAG}
    docker push ${REGISTRY}/investsim-frontend:${TAG}
    echo -e "${GREEN}✅ Images pushed to registry${NC}"
fi

# Mostrar imagens
echo -e "${BLUE}📋 Built images:${NC}"
docker images | grep investsim
