#!/bin/bash

# InvestSim Pro - Script de Monitoramento
# =======================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

FRONTEND_PORT=5099
BACKEND_PORT=5598

print_header() {
    clear
    echo -e "${CYAN}"
    echo "======================================================"
    echo "       📊 InvestSim Pro - Monitor Sistema 📊        "
    echo "======================================================"
    echo -e "${NC}"
    echo "Atualização automática a cada 5 segundos (Ctrl+C para sair)"
    echo
}

check_services() {
    echo -e "${BLUE}🔍 Status dos Serviços:${NC}"
    
    # Backend
    if lsof -i:$BACKEND_PORT >/dev/null 2>&1; then
        local backend_response=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:$BACKEND_PORT/api/articles 2>/dev/null || echo "000")
        if [ "$backend_response" = "200" ]; then
            echo -e "   ${GREEN}✅ Backend (porta $BACKEND_PORT) - Saudável${NC}"
        else
            echo -e "   ${YELLOW}⚠️  Backend (porta $BACKEND_PORT) - HTTP $backend_response${NC}"
        fi
    else
        echo -e "   ${RED}❌ Backend (porta $BACKEND_PORT) - Parado${NC}"
    fi
    
    # Frontend
    if lsof -i:$FRONTEND_PORT >/dev/null 2>&1; then
        local frontend_response=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:$FRONTEND_PORT 2>/dev/null || echo "000")
        if [ "$frontend_response" = "200" ]; then
            echo -e "   ${GREEN}✅ Frontend (porta $FRONTEND_PORT) - Saudável${NC}"
        else
            echo -e "   ${YELLOW}⚠️  Frontend (porta $FRONTEND_PORT) - HTTP $frontend_response${NC}"
        fi
    else
        echo -e "   ${RED}❌ Frontend (porta $FRONTEND_PORT) - Parado${NC}"
    fi
    
    echo
}

check_resources() {
    echo -e "${BLUE}💻 Recursos do Sistema:${NC}"
    
    # RAM
    if command -v free >/dev/null 2>&1; then
        local mem_info=$(free -h | awk '/^Mem:/ {printf "Usado: %s / %s (%.1f%%)", $3, $2, ($3/$2)*100}' | sed 's/Gi//g')
        echo -e "   ${GREEN}🧠 RAM: $mem_info${NC}"
    fi
    
    # CPU Load
    if command -v uptime >/dev/null 2>&1; then
        local load=$(uptime | awk -F'load average:' '{print $2}' | xargs)
        echo -e "   ${GREEN}⚡ Load Average: $load${NC}"
    fi
    
    # Processos Node.js
    local node_count=$(pgrep -f "node\|npm" | wc -l)
    echo -e "   ${GREEN}🟢 Processos Node.js: $node_count${NC}"
    
    echo
}

check_docker() {
    echo -e "${BLUE}🐳 Status Docker:${NC}"
    
    if command -v docker >/dev/null 2>&1; then
        local containers=$(docker ps --filter "name=investsim" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "")
        
        if [ -n "$containers" ]; then
            echo "$containers" | sed 's/^/   /'
            echo
            
            # Stats dos containers
            local stats=$(docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null | grep investsim || echo "")
            if [ -n "$stats" ]; then
                echo -e "   ${BLUE}📊 Uso de Recursos:${NC}"
                echo "$stats" | sed 's/^/   /'
            fi
        else
            echo -e "   ${YELLOW}⚠️  Nenhum container InvestSim rodando${NC}"
        fi
    else
        echo -e "   ${YELLOW}⚠️  Docker não disponível${NC}"
    fi
    
    echo
}

check_logs() {
    echo -e "${BLUE}📝 Logs Recentes:${NC}"
    
    # Backend logs
    if [ -f "logs/backend.log" ]; then
        echo -e "   ${GREEN}📄 Backend (últimas 3 linhas):${NC}"
        tail -3 logs/backend.log 2>/dev/null | sed 's/^/      /' || echo "      (vazio)"
    elif [ -f "backend-5598.log" ]; then
        echo -e "   ${GREEN}📄 Backend (últimas 3 linhas):${NC}"
        tail -3 backend-5598.log 2>/dev/null | sed 's/^/      /' || echo "      (vazio)"
    fi
    
    # Frontend logs
    if [ -f "logs/frontend.log" ]; then
        echo -e "   ${GREEN}📄 Frontend (últimas 3 linhas):${NC}"
        tail -3 logs/frontend.log 2>/dev/null | sed 's/^/      /' || echo "      (vazio)"
    elif [ -f "frontend-5099.log" ]; then
        echo -e "   ${GREEN}📄 Frontend (últimas 3 linhas):${NC}"
        tail -3 frontend-5099.log 2>/dev/null | sed 's/^/      /' || echo "      (vazio)"
    fi
    
    echo
}

show_quick_stats() {
    echo -e "${BLUE}⚡ Estatísticas Rápidas:${NC}"
    
    # Testar tempo de resposta
    local start=$(date +%s%N)
    curl -s http://localhost:$FRONTEND_PORT >/dev/null 2>&1
    local end=$(date +%s%N)
    local frontend_time=$(( (end - start) / 1000000 ))
    
    start=$(date +%s%N)
    curl -s http://localhost:$BACKEND_PORT/api/articles >/dev/null 2>&1
    end=$(date +%s%N)
    local backend_time=$(( (end - start) / 1000000 ))
    
    echo -e "   ${GREEN}🌐 Frontend Response: ${frontend_time}ms${NC}"
    echo -e "   ${GREEN}🔧 Backend API: ${backend_time}ms${NC}"
    
    # Uptime do sistema
    if command -v uptime >/dev/null 2>&1; then
        local system_uptime=$(uptime -p)
        echo -e "   ${GREEN}⏰ System Uptime: $system_uptime${NC}"
    fi
    
    echo
}

show_endpoints() {
    echo -e "${BLUE}🔗 Endpoints Disponíveis:${NC}"
    echo -e "   ${CYAN}🌐 Frontend:${NC} http://localhost:$FRONTEND_PORT"
    echo -e "   ${CYAN}🔧 Backend:${NC} http://localhost:$BACKEND_PORT"
    echo -e "   ${CYAN}📚 API Docs:${NC} http://localhost:$BACKEND_PORT/api/docs"
    echo -e "   ${CYAN}📊 Artigos:${NC} http://localhost:$BACKEND_PORT/api/articles"
    echo -e "   ${CYAN}💰 Simulação:${NC} http://localhost:$BACKEND_PORT/api/simulation/cdb-basic"
    echo
}

main_loop() {
    while true; do
        print_header
        check_services
        check_resources
        check_docker
        show_quick_stats
        show_endpoints
        
        echo -e "${YELLOW}Próxima atualização em 5 segundos... (Ctrl+C para sair)${NC}"
        sleep 5
    done
}

# Tratamento de sinal para saída limpa
cleanup() {
    echo -e "\n${GREEN}👋 Monitor finalizado!${NC}"
    exit 0
}

trap cleanup SIGINT

# Verificar se pelo menos um serviço está rodando
if ! lsof -i:$FRONTEND_PORT >/dev/null 2>&1 && ! lsof -i:$BACKEND_PORT >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Nenhum serviço InvestSim detectado.${NC}"
    echo -e "${BLUE}Para iniciar os serviços:${NC}"
    echo -e "   ./deploy.sh              # Deploy local"
    echo -e "   docker-compose up -d     # Deploy Docker"
    echo
    echo -e "${BLUE}Mesmo assim, iniciando monitor...${NC}"
    sleep 3
fi

main_loop
