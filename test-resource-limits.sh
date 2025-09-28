#!/bin/bash

echo "🔧 InvestSim Pro - Configuração de Limites de Recursos"
echo "====================================================="

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${BLUE}📋 Resumo dos Limites Configurados:${NC}"
echo -e "   ${YELLOW}Backend:${NC} 2GB RAM, 1 CPU"
echo -e "   ${YELLOW}Frontend:${NC} 2GB RAM, 1 CPU"

echo -e "\n${BLUE}🐳 Docker Compose - Limites de Recursos:${NC}"
echo -e "${GREEN}Production (docker-compose.yml):${NC}"
echo "   Backend & Frontend:"
echo "   - Limite: 2GB RAM, 1 CPU"
echo "   - Reserva: 512MB RAM, 0.25 CPU"

echo -e "\n${GREEN}Development (docker-compose.dev.yml):${NC}"
echo "   Backend & Frontend:"
echo "   - Limite: 2GB RAM, 1 CPU"
echo "   - Reserva: 256MB RAM, 0.1 CPU"

echo -e "\n${BLUE}☸️  Kubernetes - Limites de Recursos:${NC}"
echo -e "${GREEN}Backend Deployment:${NC}"
echo "   - Requests: 512Mi RAM, 250m CPU"
echo "   - Limits: 2Gi RAM, 1000m CPU"

echo -e "\n${GREEN}Frontend Deployment:${NC}"
echo "   - Requests: 512Mi RAM, 250m CPU"
echo "   - Limits: 2Gi RAM, 1000m CPU"

echo -e "\n${BLUE}📊 Autoscaling (HPA):${NC}"
echo "   - CPU Target: 70% utilization"
echo "   - Memory Target: 80% utilization"
echo "   - Min Replicas: 2"
echo "   - Max Replicas: 10"

# Função para testar se containers Docker estão rodando
check_docker_resources() {
    echo -e "\n${BLUE}🔍 Verificando Containers Docker:${NC}"
    
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(investsim-backend|investsim-frontend)" >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Containers encontrados:${NC}"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(investsim-backend|investsim-frontend)" | sed 's/^/      /'
        
        echo -e "\n   ${BLUE}📈 Estatísticas de Recursos:${NC}"
        docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep -E "(investsim-backend|investsim-frontend)" | sed 's/^/      /'
    else
        echo -e "   ${YELLOW}⚠️  Nenhum container do InvestSim rodando${NC}"
        echo -e "   ${BLUE}ℹ️  Para testar: docker-compose up -d${NC}"
    fi
}

# Função para verificar recursos do sistema
check_system_resources() {
    echo -e "\n${BLUE}💻 Recursos do Sistema:${NC}"
    
    # RAM total
    if command -v free >/dev/null 2>&1; then
        total_ram=$(free -h | awk '/^Mem:/ {print $2}')
        echo -e "   ${GREEN}RAM Total:${NC} $total_ram"
    fi
    
    # CPUs
    if command -v nproc >/dev/null 2>&1; then
        total_cpu=$(nproc)
        echo -e "   ${GREEN}CPUs Total:${NC} $total_cpu cores"
    fi
    
    # Verificar se há recursos suficientes
    echo -e "\n   ${BLUE}📊 Análise de Capacidade:${NC}"
    echo -e "   ${YELLOW}Cada serviço pode usar até:${NC}"
    echo -e "      - 2GB RAM (máximo)"
    echo -e "      - 1 CPU core (máximo)"
    echo -e "   ${YELLOW}Total para ambos os serviços:${NC}"
    echo -e "      - 4GB RAM (recomendado 8GB+ no sistema)"
    echo -e "      - 2 CPU cores (recomendado 4+ cores no sistema)"
}

# Executar verificações
check_docker_resources
check_system_resources

echo -e "\n${BLUE}🚀 Comandos para Testar:${NC}"
echo -e "${YELLOW}Desenvolvimento:${NC}"
echo "   docker-compose -f docker-compose.dev.yml up -d"
echo "   docker stats"

echo -e "\n${YELLOW}Produção:${NC}"
echo "   docker-compose up -d"
echo "   docker stats"

echo -e "\n${YELLOW}Kubernetes:${NC}"
echo "   kubectl apply -f k8s/"
echo "   kubectl top pods -n investsim-pro"
echo "   kubectl describe hpa -n investsim-pro"

echo -e "\n${GREEN}✅ Limites de recursos configurados com sucesso!${NC}"
echo -e "${BLUE}📚 Veja README-SECURITY-CONFIG.md para mais detalhes${NC}"
