# InvestSim Pro - Docker Only Makefile

.PHONY: help build up down dev logs clean status restart test

# Configurações
COMPOSE_FILE = docker-compose.yml
COMPOSE_DEV_FILE = docker-compose.dev.yml

help: ## Mostrar comandos disponíveis
	@echo "InvestSim Pro - Docker Commands"
	@echo "=========================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "URLs de Acesso:"
	@echo "Frontend: http://localhost:5099"
	@echo "Backend:  http://localhost:5598"
	@echo "API Docs: http://localhost:5598/api/docs"

# Docker Compose - Produção
build: ## Build das imagens Docker
	@echo "🚀 Building Docker images..."
	@docker-compose -f $(COMPOSE_FILE) build --no-cache

up: ## Subir aplicação em produção
	@echo "🚀 Starting production environment..."
	@docker-compose -f $(COMPOSE_FILE) up -d

down: ## Parar aplicação
	@echo "🛑 Stopping application..."
	@docker-compose -f $(COMPOSE_FILE) down

restart: ## Reiniciar aplicação
	@echo "🔄 Restarting application..."
	@docker-compose -f $(COMPOSE_FILE) restart

# Docker Compose - Desenvolvimento
dev: ## Subir aplicação em modo desenvolvimento
	@echo "🚀 Starting development environment..."
	@docker-compose -f $(COMPOSE_DEV_FILE) up -d

dev-down: ## Parar ambiente de desenvolvimento
	@echo "🛑 Stopping development environment..."
	@docker-compose -f $(COMPOSE_DEV_FILE) down

dev-logs: ## Ver logs do ambiente de desenvolvimento
	@docker-compose -f $(COMPOSE_DEV_FILE) logs -f

# Monitoramento
logs: ## Ver logs da aplicação
	@docker-compose -f $(COMPOSE_FILE) logs -f

logs-backend: ## Ver logs apenas do backend
	@docker-compose -f $(COMPOSE_FILE) logs -f backend

logs-frontend: ## Ver logs apenas do frontend
	@docker-compose -f $(COMPOSE_FILE) logs -f frontend

status: ## Verificar status dos containers
	@echo "📊 Container Status:"
	@docker-compose -f $(COMPOSE_FILE) ps
	@echo ""
	@echo "🔍 Resource Usage:"
	@docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

# Utilidades
shell-backend: ## Conectar no shell do backend
	@docker-compose -f $(COMPOSE_FILE) exec backend sh

shell-frontend: ## Conectar no shell do frontend
	@docker-compose -f $(COMPOSE_FILE) exec frontend sh

# Limpeza
clean: ## Limpar containers, volumes e imagens
	@echo "🧹 Cleaning up Docker resources..."
	@docker-compose -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans
	@docker-compose -f $(COMPOSE_DEV_FILE) down --rmi all --volumes --remove-orphans
	@docker system prune -f

clean-light: ## Limpar apenas containers parados
	@echo "🧹 Cleaning stopped containers..."
	@docker-compose -f $(COMPOSE_FILE) down
	@docker-compose -f $(COMPOSE_DEV_FILE) down

# Deploy & Test
deploy: build up ## Build e deploy completo
	@echo "✅ Full deployment completed!"
	@echo "🌐 Access application:"
	@echo "   Frontend: http://localhost:5099" 
	@echo "   Backend:  http://localhost:5598/api/docs"

test: ## Executar testes completos
	@echo "🧪 Running complete tests..."
	@chmod +x test-complete.sh
	@./test-complete.sh

monitor: ## Monitorar aplicação (interativo)
	@echo "📊 Starting monitoring..."
	@chmod +x monitor.sh
	@./monitor.sh

# All-in-one
fresh-start: clean deploy ## Limpeza completa e deploy
	@echo "🎉 Fresh start completed!"

# Aliases para compatibilidade
prod-up: up ## Alias para 'up'
prod-down: down ## Alias para 'down'
full-deploy: deploy ## Alias para 'deploy'
