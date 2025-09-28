#!/bin/bash

# InvestSim Pro - Menu Principal de Scripts
# =========================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

show_banner() {
    clear
    echo -e "${CYAN}"
    echo "======================================================"
    echo "        🚀 InvestSim Pro - Menu Principal 🚀         "
    echo "======================================================"
    echo -e "${NC}"
    echo "Selecione uma opção para executar:"
    echo
}

show_menu() {
    echo -e "${BLUE}📋 DEPLOY E IMPLEMENTAÇÃO:${NC}"
    echo -e "   ${GREEN}1)${NC} Deploy Local (desenvolvimento)"
    echo -e "   ${GREEN}2)${NC} Deploy Docker (produção)"
    echo -e "   ${GREEN}3)${NC} Deploy Docker Dev"
    echo -e "   ${GREEN}4)${NC} Deploy Kubernetes"
    echo
    
    echo -e "${BLUE}🧪 TESTES:${NC}"
    echo -e "   ${YELLOW}5)${NC} Suite Completa de Testes"
    echo -e "   ${YELLOW}6)${NC} Teste de Segurança"
    echo -e "   ${YELLOW}7)${NC} Teste de Recursos"
    echo -e "   ${YELLOW}8)${NC} Teste Rápido de Portas"
    echo
    
    echo -e "${BLUE}🔧 GERENCIAMENTO:${NC}"
    echo -e "   ${MAGENTA}9)${NC}  Monitor em Tempo Real"
    echo -e "   ${MAGENTA}10)${NC} Parar Todos os Serviços"
    echo
    
    echo -e "${BLUE}📚 INFORMAÇÕES:${NC}"
    echo -e "   ${CYAN}11)${NC} Status dos Serviços"
    echo -e "   ${CYAN}12)${NC} Ver Logs"
    echo -e "   ${CYAN}13)${NC} Ajuda e Documentação"
    echo
    
    echo -e "${RED}0)${NC}  Sair"
    echo
}

check_services_status() {
    echo -e "${BLUE}🔍 Verificando status dos serviços...${NC}"
    echo
    
    # Frontend
    if lsof -i:5099 >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Frontend rodando (porta 5099)${NC}"
    else
        echo -e "   ${RED}❌ Frontend não encontrado (porta 5099)${NC}"
    fi
    
    # Backend
    if lsof -i:5098 >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Backend rodando (porta 5098)${NC}"
    else
        echo -e "   ${RED}❌ Backend não encontrado (porta 5098)${NC}"
    fi
    
    # Docker
    if docker ps --filter "name=investsim" --format "{{.Names}}" | grep -q investsim 2>/dev/null; then
        echo -e "   ${GREEN}✅ Containers Docker rodando${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Nenhum container Docker ativo${NC}"
    fi
    
    echo
    echo -e "${BLUE}🌐 Endpoints:${NC}"
    echo -e "   Frontend: ${YELLOW}http://localhost:5099${NC}"
    echo -e "   Backend:  ${YELLOW}http://localhost:5098${NC}"
    echo -e "   API Docs: ${YELLOW}http://localhost:5098/api/docs${NC}"
    echo
}

show_logs() {
    echo -e "${BLUE}📝 Escolha qual log visualizar:${NC}"
    echo -e "   ${GREEN}1)${NC} Backend"
    echo -e "   ${GREEN}2)${NC} Frontend"
    echo -e "   ${GREEN}3)${NC} Ambos (paralelo)"
    echo -e "   ${GREEN}0)${NC} Voltar"
    echo
    read -p "Opção: " log_choice
    
    case $log_choice in
        1)
            if [ -f "logs/backend.log" ]; then
                tail -f logs/backend.log
            elif [ -f "backend-5098.log" ]; then
                tail -f backend-5098.log
            else
                echo "Log do backend não encontrado"
            fi
            ;;
        2)
            if [ -f "logs/frontend.log" ]; then
                tail -f logs/frontend.log
            elif [ -f "frontend-5099.log" ]; then
                tail -f frontend-5099.log
            else
                echo "Log do frontend não encontrado"
            fi
            ;;
        3)
            if [ -f "logs/backend.log" ] && [ -f "logs/frontend.log" ]; then
                tail -f logs/backend.log logs/frontend.log
            else
                echo "Logs não encontrados no diretório logs/"
            fi
            ;;
        0)
            return
            ;;
    esac
}

show_help() {
    echo -e "${BLUE}📚 Documentação Rápida:${NC}"
    echo
    echo -e "${GREEN}Scripts Principais:${NC}"
    echo -e "   ./deploy.sh [local|docker|dev|kubernetes] - Deploy do sistema"
    echo -e "   ./test-complete.sh                        - Suite de testes"
    echo -e "   ./monitor.sh                              - Monitor em tempo real"
    echo -e "   ./stop.sh                                 - Parar serviços"
    echo
    echo -e "${GREEN}Arquitetura:${NC}"
    echo -e "   Frontend (Next.js): Porta 5099 - Público para nginx"
    echo -e "   Backend (NestJS):   Porta 5098 - Localhost apenas"
    echo -e "   Limites:           2GB RAM, 1 CPU por serviço"
    echo
    echo -e "${GREEN}Documentação Completa:${NC}"
    echo -e "   README-SCRIPTS.md      - Guia completo dos scripts"
    echo -e "   README-SECURITY-CONFIG.md - Configuração de segurança"
    echo -e "   README-PORT-5099.md    - Configuração nginx"
    echo
}

execute_option() {
    local option=$1
    
    case $option in
        1)
            echo -e "${GREEN}🚀 Iniciando deploy local...${NC}"
            ./deploy.sh local
            ;;
        2)
            echo -e "${GREEN}🐳 Iniciando deploy Docker (produção)...${NC}"
            ./deploy.sh docker
            ;;
        3)
            echo -e "${GREEN}🐳 Iniciando deploy Docker (dev)...${NC}"
            ./deploy.sh dev
            ;;
        4)
            echo -e "${GREEN}☸️  Iniciando deploy Kubernetes...${NC}"
            ./deploy.sh kubernetes
            ;;
        5)
            echo -e "${YELLOW}🧪 Executando suite completa de testes...${NC}"
            ./test-complete.sh
            ;;
        6)
            echo -e "${YELLOW}🔒 Executando teste de segurança...${NC}"
            ./test-security-config.sh
            ;;
        7)
            echo -e "${YELLOW}📊 Executando teste de recursos...${NC}"
            ./test-resource-limits.sh
            ;;
        8)
            echo -e "${YELLOW}🔌 Executando teste rápido de portas...${NC}"
            ./test-port.sh
            ;;
        9)
            echo -e "${MAGENTA}📊 Iniciando monitor...${NC}"
            ./monitor.sh
            ;;
        10)
            echo -e "${RED}🛑 Parando todos os serviços...${NC}"
            ./stop.sh
            ;;
        11)
            check_services_status
            ;;
        12)
            show_logs
            ;;
        13)
            show_help
            ;;
        0)
            echo -e "${GREEN}👋 Até logo!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Opção inválida!${NC}"
            ;;
    esac
}

main() {
    while true; do
        show_banner
        show_menu
        
        read -p "Digite sua opção (0-13): " choice
        echo
        
        execute_option $choice
        
        if [ "$choice" != "0" ]; then
            echo
            echo -e "${BLUE}Pressione Enter para continuar...${NC}"
            read
        fi
    done
}

# Verificar se os scripts estão executáveis
if [ ! -x "deploy.sh" ]; then
    echo -e "${YELLOW}⚠️  Tornando scripts executáveis...${NC}"
    chmod +x *.sh
fi

main
