#!/bin/bash

# InvestSim Pro - Script de Implementação Completa
# ================================================
# Este script implementa o sistema completo do InvestSim Pro
# com configurações de segurança e limites de recursos

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Variáveis de configuração
PROJECT_NAME="InvestSim Pro"
FRONTEND_PORT=5099
BACKEND_PORT=5098
DEPLOY_MODE=""

# Banner
print_banner() {
    echo -e "${CYAN}"
    echo "======================================================"
    echo "      🚀 InvestSim Pro - Deploy Automático 🚀      "
    echo "======================================================"
    echo -e "${NC}"
}

# Log com timestamp
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Verificar dependências
check_dependencies() {
    log "${BLUE}🔍 Verificando dependências...${NC}"
    
    local deps=("node" "npm" "docker" "docker-compose")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v $dep >/dev/null 2>&1; then
            missing+=($dep)
        else
            local version=""
            case $dep in
                "node") version=$(node --version) ;;
                "npm") version=$(npm --version) ;;
                "docker") version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1) ;;
                "docker-compose") version=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1) ;;
            esac
            log "   ${GREEN}✅ $dep${NC} ($version)"
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        log "${RED}❌ Dependências faltando: ${missing[*]}${NC}"
        echo "Instale as dependências faltando e execute novamente."
        exit 1
    fi
    
    log "${GREEN}✅ Todas as dependências encontradas!${NC}"
}

# Verificar sistema
check_system() {
    log "${BLUE}💻 Verificando recursos do sistema...${NC}"
    
    # RAM
    if command -v free >/dev/null 2>&1; then
        local total_ram_kb=$(free | awk '/^Mem:/ {print $2}')
        local total_ram_gb=$((total_ram_kb / 1024 / 1024))
        log "   ${GREEN}RAM Total:${NC} ${total_ram_gb}GB"
        
        if [ $total_ram_gb -lt 6 ]; then
            log "   ${YELLOW}⚠️  Aviso: RAM baixa. Recomendado: 8GB+${NC}"
        fi
    fi
    
    # CPUs
    if command -v nproc >/dev/null 2>&1; then
        local cpu_cores=$(nproc)
        log "   ${GREEN}CPU Cores:${NC} $cpu_cores"
        
        if [ $cpu_cores -lt 4 ]; then
            log "   ${YELLOW}⚠️  Aviso: Poucos cores. Recomendado: 4+${NC}"
        fi
    fi
    
    # Espaço em disco
    local disk_space=$(df -h . | awk 'NR==2 {print $4}')
    log "   ${GREEN}Espaço Disponível:${NC} $disk_space"
}

# Verificar portas
check_ports() {
    log "${BLUE}🔌 Verificando portas...${NC}"
    
    local ports=($FRONTEND_PORT $BACKEND_PORT)
    local occupied=()
    
    for port in "${ports[@]}"; do
        if lsof -i:$port >/dev/null 2>&1; then
            occupied+=($port)
            log "   ${YELLOW}⚠️  Porta $port ocupada${NC}"
        else
            log "   ${GREEN}✅ Porta $port disponível${NC}"
        fi
    done
    
    if [ ${#occupied[@]} -ne 0 ]; then
        echo -e "\n${YELLOW}Deseja parar processos nas portas ocupadas? (y/N)${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            for port in "${occupied[@]}"; do
                log "   🛑 Parando processos na porta $port..."
                lsof -ti:$port | xargs kill -9 2>/dev/null || true
            done
        fi
    fi
}

# Instalar dependências do projeto
install_dependencies() {
    log "${BLUE}📦 Instalando dependências do projeto...${NC}"
    
    # Backend
    if [ -d "backend" ]; then
        log "   📥 Instalando dependências do backend..."
        cd backend
        npm install --silent
        cd ..
        log "   ${GREEN}✅ Backend dependencies installed${NC}"
    fi
    
    # Frontend
    if [ -d "frontend" ]; then
        log "   📥 Instalando dependências do frontend..."
        cd frontend
        npm install --silent
        cd ..
        log "   ${GREEN}✅ Frontend dependencies installed${NC}"
    fi
}

# Construir aplicação
build_application() {
    log "${BLUE}🏗️  Construindo aplicação...${NC}"
    
    # Build backend
    if [ -d "backend" ]; then
        log "   🔨 Building backend..."
        cd backend
        npm run build
        cd ..
        log "   ${GREEN}✅ Backend build completed${NC}"
    fi
    
    # Build frontend
    if [ -d "frontend" ]; then
        log "   🔨 Building frontend..."
        cd frontend
        npm run build
        cd ..
        log "   ${GREEN}✅ Frontend build completed${NC}"
    fi
}

# Deploy local (desenvolvimento)
deploy_local() {
    log "${BLUE}🚀 Iniciando deploy local...${NC}"
    
    # Parar processos existentes
    pkill -f "nest start" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    sleep 2
    
    # Iniciar backend
    log "   🔧 Iniciando backend na porta $BACKEND_PORT..."
    cd backend
    nohup npm run dev > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Aguardar backend inicializar
    sleep 5
    
    # Iniciar frontend
    log "   🌐 Iniciando frontend na porta $FRONTEND_PORT..."
    cd frontend
    nohup npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    # Salvar PIDs
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
    
    log "${GREEN}✅ Deploy local concluído!${NC}"
    log "   Backend PID: $BACKEND_PID"
    log "   Frontend PID: $FRONTEND_PID"
}

# Deploy com Docker
deploy_docker() {
    log "${BLUE}🐳 Iniciando deploy com Docker...${NC}"
    
    # Criar diretório de logs se não existir
    mkdir -p logs
    
    # Parar containers existentes
    docker-compose down 2>/dev/null || true
    
    # Construir e iniciar containers
    if [ "$DEPLOY_MODE" == "dev" ]; then
        log "   🔨 Construindo containers (desenvolvimento)..."
        docker-compose -f docker-compose.dev.yml build
        log "   🚀 Iniciando containers (desenvolvimento)..."
        docker-compose -f docker-compose.dev.yml up -d
    else
        log "   🔨 Construindo containers (produção)..."
        docker-compose build
        log "   🚀 Iniciando containers (produção)..."
        docker-compose up -d
    fi
    
    log "${GREEN}✅ Deploy Docker concluído!${NC}"
}

# Deploy com Kubernetes
deploy_kubernetes() {
    log "${BLUE}☸️  Iniciando deploy com Kubernetes...${NC}"
    
    # Verificar kubectl
    if ! command -v kubectl >/dev/null 2>&1; then
        log "${RED}❌ kubectl não encontrado${NC}"
        exit 1
    fi
    
    # Aplicar manifests
    log "   📋 Aplicando manifests do Kubernetes..."
    kubectl apply -f k8s/
    
    # Aguardar pods ficarem prontos
    log "   ⏳ Aguardando pods ficarem prontos..."
    kubectl wait --for=condition=ready pod -l app=investsim-pro -n investsim-pro --timeout=300s
    
    log "${GREEN}✅ Deploy Kubernetes concluído!${NC}"
}

# Verificar saúde dos serviços
health_check() {
    log "${BLUE}🏥 Verificando saúde dos serviços...${NC}"
    
    local max_attempts=30
    local attempt=0
    
    # Verificar backend
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:$BACKEND_PORT/api/articles >/dev/null 2>&1; then
            log "   ${GREEN}✅ Backend healthy (porta $BACKEND_PORT)${NC}"
            break
        fi
        ((attempt++))
        if [ $attempt -eq $max_attempts ]; then
            log "   ${RED}❌ Backend não respondeu após $max_attempts tentativas${NC}"
            return 1
        fi
        sleep 2
    done
    
    # Verificar frontend
    attempt=0
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:$FRONTEND_PORT >/dev/null 2>&1; then
            log "   ${GREEN}✅ Frontend healthy (porta $FRONTEND_PORT)${NC}"
            break
        fi
        ((attempt++))
        if [ $attempt -eq $max_attempts ]; then
            log "   ${RED}❌ Frontend não respondeu após $max_attempts tentativas${NC}"
            return 1
        fi
        sleep 2
    done
    
    return 0
}

# Executar testes
run_tests() {
    log "${BLUE}🧪 Executando testes...${NC}"
    
    # Teste de configuração de segurança
    if [ -f "./test-security-config.sh" ]; then
        log "   🔒 Executando teste de segurança..."
        chmod +x ./test-security-config.sh
        ./test-security-config.sh
    fi
    
    # Teste de limites de recursos
    if [ -f "./test-resource-limits.sh" ]; then
        log "   📊 Executando teste de recursos..."
        chmod +x ./test-resource-limits.sh
        ./test-resource-limits.sh
    fi
}

# Mostrar informações finais
show_final_info() {
    log "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
    
    echo -e "\n${BLUE}📋 Informações de Acesso:${NC}"
    echo -e "   🌐 Frontend: ${YELLOW}http://localhost:$FRONTEND_PORT${NC}"
    echo -e "   🔧 Backend:  ${YELLOW}http://localhost:$BACKEND_PORT${NC}"
    echo -e "   📚 API Docs: ${YELLOW}http://localhost:$BACKEND_PORT/api/docs${NC}"
    
    if [ "$DEPLOY_MODE" != "kubernetes" ]; then
        echo -e "\n${BLUE}🛠️  Comandos Úteis:${NC}"
        echo -e "   📊 Monitorar recursos: ${YELLOW}./test-resource-limits.sh${NC}"
        echo -e "   🔒 Teste segurança: ${YELLOW}./test-security-config.sh${NC}"
        
        if [ -f ".backend.pid" ] && [ -f ".frontend.pid" ]; then
            echo -e "   🛑 Parar serviços: ${YELLOW}./scripts/stop.sh${NC}"
        elif [ "$DEPLOY_MODE" == "docker" ] || [ "$DEPLOY_MODE" == "dev" ]; then
            echo -e "   🛑 Parar containers: ${YELLOW}docker-compose down${NC}"
        fi
    fi
    
    echo -e "\n${BLUE}📁 Logs:${NC}"
    echo -e "   Backend: ${YELLOW}logs/backend.log${NC}"
    echo -e "   Frontend: ${YELLOW}logs/frontend.log${NC}"
}

# Função principal
main() {
    print_banner
    
    # Verificar argumentos
    case "${1:-local}" in
        "local")
            DEPLOY_MODE="local"
            ;;
        "docker")
            DEPLOY_MODE="docker"
            ;;
        "docker-dev"|"dev")
            DEPLOY_MODE="dev"
            ;;
        "kubernetes"|"k8s")
            DEPLOY_MODE="kubernetes"
            ;;
        "--help"|"-h")
            echo "Uso: $0 [local|docker|dev|kubernetes]"
            echo "  local      - Deploy local com npm (padrão)"
            echo "  docker     - Deploy com Docker (produção)"
            echo "  dev        - Deploy com Docker (desenvolvimento)"
            echo "  kubernetes - Deploy com Kubernetes"
            exit 0
            ;;
        *)
            log "${RED}❌ Modo inválido: $1${NC}"
            echo "Use: $0 --help para ver opções disponíveis"
            exit 1
            ;;
    esac
    
    log "${BLUE}🎯 Modo de deploy: ${DEPLOY_MODE}${NC}"
    
    # Criar diretório de logs
    mkdir -p logs
    
    # Executar verificações
    check_dependencies
    check_system
    check_ports
    
    # Executar deploy baseado no modo
    case $DEPLOY_MODE in
        "local")
            install_dependencies
            build_application
            deploy_local
            ;;
        "docker")
            deploy_docker
            ;;
        "dev")
            deploy_docker
            ;;
        "kubernetes")
            deploy_kubernetes
            ;;
    esac
    
    # Aguardar um pouco para os serviços iniciarem
    if [ "$DEPLOY_MODE" != "kubernetes" ]; then
        log "${BLUE}⏳ Aguardando serviços iniciarem...${NC}"
        sleep 10
    fi
    
    # Verificar saúde e executar testes
    if health_check; then
        run_tests
        show_final_info
    else
        log "${RED}❌ Falha na verificação de saúde dos serviços${NC}"
        exit 1
    fi
}

# Tratamento de sinais
cleanup() {
    log "${YELLOW}🛑 Limpando processos...${NC}"
    if [ -f ".backend.pid" ]; then
        kill $(cat .backend.pid) 2>/dev/null || true
        rm .backend.pid
    fi
    if [ -f ".frontend.pid" ]; then
        kill $(cat .frontend.pid) 2>/dev/null || true
        rm .frontend.pid
    fi
}

trap cleanup EXIT

# Executar função principal
main "$@"
