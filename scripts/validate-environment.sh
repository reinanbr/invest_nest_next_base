#!/bin/bash

# Script de validação do ambiente para deploy
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 InvestSim Pro - Environment Validation${NC}"

# Função para verificar se comando existe
check_command() {
    if command -v $1 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $1 is installed${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 is not installed${NC}"
        return 1
    fi
}

# Função para verificar versão do Kubernetes
check_k8s_version() {
    if kubectl version --client >/dev/null 2>&1; then
        local version=$(kubectl version --client --short 2>/dev/null | cut -d' ' -f3)
        echo -e "${GREEN}✅ kubectl version: $version${NC}"
        return 0
    else
        echo -e "${RED}❌ kubectl not working properly${NC}"
        return 1
    fi
}

# Verificar pré-requisitos básicos
echo -e "${YELLOW}📋 Checking basic requirements...${NC}"
check_command "docker"
check_command "kubectl"
check_command "make"

# Verificar versões
echo -e "${YELLOW}📋 Checking versions...${NC}"
check_k8s_version

# Verificar conexão com cluster Kubernetes
echo -e "${YELLOW}📋 Checking Kubernetes cluster...${NC}"
if kubectl cluster-info >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Kubernetes cluster is accessible${NC}"
    
    # Verificar nós
    local nodes=$(kubectl get nodes --no-headers | wc -l)
    echo -e "${GREEN}✅ Cluster has $nodes node(s)${NC}"
    
    # Verificar ingress controller
    if kubectl get ingressclass >/dev/null 2>&1; then
        local ingress_classes=$(kubectl get ingressclass --no-headers | wc -l)
        echo -e "${GREEN}✅ Found $ingress_classes ingress class(es)${NC}"
    else
        echo -e "${YELLOW}⚠️  No ingress classes found - you may need to install nginx-ingress${NC}"
    fi
    
    # Verificar metrics server
    if kubectl get deployment metrics-server -n kube-system >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Metrics server is available${NC}"
    else
        echo -e "${YELLOW}⚠️  Metrics server not found - HPA may not work${NC}"
    fi
else
    echo -e "${RED}❌ Cannot connect to Kubernetes cluster${NC}"
fi

# Verificar arquivos de configuração
echo -e "${YELLOW}📋 Checking configuration files...${NC}"
config_files=(
    "backend/Dockerfile"
    "frontend/Dockerfile"
    "docker-compose.yml"
    "docker-compose.dev.yml"
    "k8s/01-namespace.yaml"
    "k8s/08-ingress.yaml"
    "Makefile"
)

for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file is missing${NC}"
    fi
done

# Verificar dados dos artigos
echo -e "${YELLOW}📋 Checking article data...${NC}"
if [ -d "backend/data" ] && [ -f "backend/data/articles.json" ]; then
    local article_count=$(ls backend/data/articles/ 2>/dev/null | wc -l)
    echo -e "${GREEN}✅ Article data directory exists with $article_count files${NC}"
else
    echo -e "${RED}❌ Article data directory or articles.json is missing${NC}"
fi

# Verificar espaço em disco
echo -e "${YELLOW}📋 Checking disk space...${NC}"
local available_space=$(df -h . | awk 'NR==2 {print $4}')
echo -e "${GREEN}✅ Available disk space: $available_space${NC}"

# Verificar portas em uso
echo -e "${YELLOW}📋 Checking ports...${NC}"
ports=(3000 3001)
for port in "${ports[@]}"; do
    if lsof -i:$port >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port $port is in use${NC}"
    else
        echo -e "${GREEN}✅ Port $port is available${NC}"
    fi
done

echo -e "${BLUE}🎉 Environment validation completed!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "1. Run: ${BLUE}make build-local${NC} to build Docker images"
echo -e "2. Run: ${BLUE}make k8s-deploy${NC} to deploy to Kubernetes"
echo -e "3. Run: ${BLUE}make k8s-status${NC} to check deployment status"
