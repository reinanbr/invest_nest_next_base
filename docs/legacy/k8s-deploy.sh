#!/bin/bash

# Deploy no Kubernetes
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
NAMESPACE="investsim-pro"
ACTION=${1:-"deploy"}  # deploy, update, delete, status

echo -e "${BLUE}🚀 Kubernetes Deployment Script for InvestSim Pro${NC}"

case $ACTION in
  "deploy")
    echo -e "${YELLOW}📋 Deploying InvestSim Pro to Kubernetes...${NC}"
    
    # Aplicar manifests em ordem
    kubectl apply -f k8s/01-namespace.yaml
    kubectl apply -f k8s/02-configmap.yaml
    kubectl apply -f k8s/03-persistent-volume.yaml
    kubectl apply -f k8s/04-backend-deployment.yaml
    kubectl apply -f k8s/05-backend-service.yaml
    kubectl apply -f k8s/06-frontend-deployment.yaml
    kubectl apply -f k8s/07-frontend-service.yaml
    kubectl apply -f k8s/08-ingress.yaml
    kubectl apply -f k8s/09-hpa.yaml
    kubectl apply -f k8s/10-network-policy.yaml
    
    echo -e "${GREEN}✅ Deployment completed successfully${NC}"
    ;;
    
  "update")
    echo -e "${YELLOW}🔄 Updating deployments...${NC}"
    kubectl rollout restart deployment/investsim-backend -n $NAMESPACE
    kubectl rollout restart deployment/investsim-frontend -n $NAMESPACE
    
    # Aguardar rollout
    kubectl rollout status deployment/investsim-backend -n $NAMESPACE
    kubectl rollout status deployment/investsim-frontend -n $NAMESPACE
    
    echo -e "${GREEN}✅ Update completed successfully${NC}"
    ;;
    
  "delete")
    echo -e "${RED}🗑️  Deleting InvestSim Pro from Kubernetes...${NC}"
    read -p "Are you sure? This will delete all resources (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      kubectl delete -f k8s/ --ignore-not-found=true
      echo -e "${GREEN}✅ Resources deleted successfully${NC}"
    else
      echo -e "${YELLOW}❌ Deletion cancelled${NC}"
    fi
    ;;
    
  "status")
    echo -e "${BLUE}📊 Checking deployment status...${NC}"
    
    echo -e "${YELLOW}Namespace:${NC}"
    kubectl get namespace $NAMESPACE
    
    echo -e "${YELLOW}Pods:${NC}"
    kubectl get pods -n $NAMESPACE -o wide
    
    echo -e "${YELLOW}Services:${NC}"
    kubectl get services -n $NAMESPACE
    
    echo -e "${YELLOW}Ingress:${NC}"
    kubectl get ingress -n $NAMESPACE
    
    echo -e "${YELLOW}HPA:${NC}"
    kubectl get hpa -n $NAMESPACE
    
    echo -e "${YELLOW}PV/PVC:${NC}"
    kubectl get pv,pvc -n $NAMESPACE
    ;;
    
  *)
    echo -e "${RED}❌ Unknown action: $ACTION${NC}"
    echo -e "${BLUE}Usage: $0 [deploy|update|delete|status]${NC}"
    exit 1
    ;;
esac
