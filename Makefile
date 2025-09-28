# InvestSim Pro - Makefile for Docker and Kubernetes

.PHONY: help build-local build-registry deploy-dev deploy-k8s status clean logs

# Configurações
REGISTRY ?= local
TAG ?= latest
NAMESPACE = investsim-pro

help: ## Mostrar ajuda
	@echo "InvestSim Pro - Docker & Kubernetes Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Docker Commands
build-local: ## Build imagens Docker localmente
	@echo "🚀 Building Docker images locally..."
	@chmod +x scripts/build-images.sh
	@./scripts/build-images.sh local $(TAG)

build-registry: ## Build e push imagens para registry
	@echo "🚀 Building and pushing Docker images to registry..."
	@chmod +x scripts/build-images.sh
	@./scripts/build-images.sh $(REGISTRY) $(TAG)

# Docker Compose Commands
dev-up: ## Subir ambiente de desenvolvimento com Docker Compose
	@echo "🚀 Starting development environment..."
	@docker-compose -f docker-compose.dev.yml up -d

dev-down: ## Parar ambiente de desenvolvimento
	@echo "🛑 Stopping development environment..."
	@docker-compose -f docker-compose.dev.yml down

dev-logs: ## Ver logs do ambiente de desenvolvimento
	@docker-compose -f docker-compose.dev.yml logs -f

prod-up: ## Subir ambiente de produção com Docker Compose
	@echo "🚀 Starting production environment..."
	@docker-compose up -d

prod-down: ## Parar ambiente de produção
	@echo "🛑 Stopping production environment..."
	@docker-compose down

# Kubernetes Commands
k8s-deploy: ## Deploy no Kubernetes
	@echo "🚀 Deploying to Kubernetes..."
	@chmod +x scripts/k8s-deploy.sh
	@./scripts/k8s-deploy.sh deploy

k8s-update: ## Atualizar deployment no Kubernetes
	@echo "🔄 Updating Kubernetes deployment..."
	@chmod +x scripts/k8s-deploy.sh
	@./scripts/k8s-deploy.sh update

k8s-delete: ## Deletar recursos do Kubernetes
	@echo "🗑️  Deleting from Kubernetes..."
	@chmod +x scripts/k8s-deploy.sh
	@./scripts/k8s-deploy.sh delete

k8s-status: ## Ver status do Kubernetes
	@echo "📊 Checking Kubernetes status..."
	@chmod +x scripts/k8s-deploy.sh
	@./scripts/k8s-deploy.sh status

# Utility Commands
logs-backend: ## Ver logs do backend no Kubernetes
	@kubectl logs -f -l component=backend -n $(NAMESPACE)

logs-frontend: ## Ver logs do frontend no Kubernetes
	@kubectl logs -f -l component=frontend -n $(NAMESPACE)

shell-backend: ## Conectar no shell do backend
	@kubectl exec -it deployment/investsim-backend -n $(NAMESPACE) -- /bin/sh

shell-frontend: ## Conectar no shell do frontend  
	@kubectl exec -it deployment/investsim-frontend -n $(NAMESPACE) -- /bin/sh

port-forward-backend: ## Port forward para backend (localhost:3001)
	@kubectl port-forward service/investsim-backend-service -n $(NAMESPACE) 3001:3000

port-forward-frontend: ## Port forward para frontend (localhost:5099)
	@kubectl port-forward service/investsim-frontend-service -n $(NAMESPACE) 5099:5099

# Clean Commands
clean-docker: ## Limpar imagens Docker não utilizadas
	@echo "🧹 Cleaning unused Docker images..."
	@docker system prune -a -f

clean-k8s: ## Limpar recursos não utilizados do Kubernetes
	@echo "🧹 Cleaning unused Kubernetes resources..."
	@kubectl delete pods --field-selector=status.phase=Succeeded -n $(NAMESPACE)
	@kubectl delete pods --field-selector=status.phase=Failed -n $(NAMESPACE)

# All-in-one Commands
full-deploy: build-local k8s-deploy ## Build local e deploy no Kubernetes
	@echo "✅ Full deployment completed!"

full-update: build-local k8s-update ## Build local e atualizar Kubernetes
	@echo "✅ Full update completed!"

# Monitoring
monitor: ## Monitorar recursos do Kubernetes
	@watch kubectl get pods,svc,ingress,hpa -n $(NAMESPACE)
