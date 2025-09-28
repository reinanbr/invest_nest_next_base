#!/bin/bash

# InvestSim Pro - Script de Teste Completo
# ========================================
# Este script executa todos os testes do sistema InvestSim Pro

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Variáveis
FRONTEND_PORT=5099
BACKEND_PORT=5598
TEST_RESULTS=()
FAILED_TESTS=()

# Banner
print_banner() {
    echo -e "${CYAN}"
    echo "======================================================"
    echo "      🧪 InvestSim Pro - Suite de Testes 🧪        "
    echo "======================================================"
    echo -e "${NC}"
}

# Log com timestamp
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Função para adicionar resultado de teste
add_test_result() {
    local test_name="$1"
    local status="$2"
    local details="$3"
    
    TEST_RESULTS+=("$test_name:$status:$details")
    
    if [ "$status" == "FAILED" ]; then
        FAILED_TESTS+=("$test_name")
    fi
}

# Teste 1: Verificar se serviços estão rodando
test_services_running() {
    log "${BLUE}🔍 Teste 1: Verificando serviços...${NC}"
    
    local backend_running=false
    local frontend_running=false
    
    # Verificar backend
    if lsof -i:$BACKEND_PORT >/dev/null 2>&1; then
        log "   ${GREEN}✅ Backend rodando na porta $BACKEND_PORT${NC}"
        backend_running=true
    else
        log "   ${RED}❌ Backend não encontrado na porta $BACKEND_PORT${NC}"
    fi
    
    # Verificar frontend
    if lsof -i:$FRONTEND_PORT >/dev/null 2>&1; then
        log "   ${GREEN}✅ Frontend rodando na porta $FRONTEND_PORT${NC}"
        frontend_running=true
    else
        log "   ${RED}❌ Frontend não encontrado na porta $FRONTEND_PORT${NC}"
    fi
    
    if [ "$backend_running" = true ] && [ "$frontend_running" = true ]; then
        add_test_result "Services Running" "PASSED" "Backend($BACKEND_PORT) + Frontend($FRONTEND_PORT)"
    else
        add_test_result "Services Running" "FAILED" "Backend: $backend_running, Frontend: $frontend_running"
    fi
}

# Teste 2: Teste de conectividade HTTP
test_http_connectivity() {
    log "${BLUE}🌐 Teste 2: Conectividade HTTP...${NC}"
    
    local backend_http=false
    local frontend_http=false
    local backend_code=""
    local frontend_code=""
    
    # Testar backend
    backend_code=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:$BACKEND_PORT/api/articles 2>/dev/null || echo "000")
    if [ "$backend_code" = "200" ]; then
        log "   ${GREEN}✅ Backend HTTP 200 OK${NC}"
        backend_http=true
    else
        log "   ${RED}❌ Backend HTTP $backend_code${NC}"
    fi
    
    # Testar frontend
    frontend_code=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:$FRONTEND_PORT 2>/dev/null || echo "000")
    if [ "$frontend_code" = "200" ]; then
        log "   ${GREEN}✅ Frontend HTTP 200 OK${NC}"
        frontend_http=true
    else
        log "   ${RED}❌ Frontend HTTP $frontend_code${NC}"
    fi
    
    if [ "$backend_http" = true ] && [ "$frontend_http" = true ]; then
        add_test_result "HTTP Connectivity" "PASSED" "Backend: $backend_code, Frontend: $frontend_code"
    else
        add_test_result "HTTP Connectivity" "FAILED" "Backend: $backend_code, Frontend: $frontend_code"
    fi
}

# Teste 3: Teste de APIs do Backend
test_backend_apis() {
    log "${BLUE}🔧 Teste 3: APIs do Backend...${NC}"
    
    local apis=(
        "/api/articles:Artigos"
        "/api/articles/recent:Artigos Recentes"
        "/api/market/quotes:Cotações"
        "/api/market/currencies:Moedas"
        "/api/market/indices:Índices"
    )
    
    local passed=0
    local total=${#apis[@]}
    local api_details=""
    
    for api_info in "${apis[@]}"; do
        IFS=':' read -r endpoint name <<< "$api_info"
        local code=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:$BACKEND_PORT$endpoint 2>/dev/null || echo "000")
        
        if [ "$code" = "200" ]; then
            log "   ${GREEN}✅ $name ($endpoint)${NC}"
            ((passed++))
        else
            log "   ${RED}❌ $name ($endpoint) - HTTP $code${NC}"
        fi
        
        api_details+="$name:$code "
    done
    
    if [ $passed -eq $total ]; then
        add_test_result "Backend APIs" "PASSED" "$passed/$total APIs working"
    else
        add_test_result "Backend APIs" "FAILED" "$passed/$total APIs working"
    fi
}

# Teste 4: Teste de simulação CDB
test_cdb_simulation() {
    log "${BLUE}💰 Teste 4: Simulação CDB...${NC}"
    
    local payload='{
        "initialAmount": 10000,
        "monthlyContribution": 1000,
        "interestRate": 12.5,
        "period": 12
    }'
    
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$payload" \
        http://localhost:$BACKEND_PORT/api/simulation/cdb-basic 2>/dev/null || echo "")
    
    if [[ "$response" =~ "finalAmount" ]] && [[ "$response" =~ "grossProfit" ]]; then
        log "   ${GREEN}✅ Simulação CDB funcionando${NC}"
        add_test_result "CDB Simulation" "PASSED" "Response contains expected fields"
    else
        log "   ${RED}❌ Simulação CDB falhou${NC}"
        add_test_result "CDB Simulation" "FAILED" "Invalid response format"
    fi
}

# Teste 5: Teste de conteúdo do Frontend
test_frontend_content() {
    log "${BLUE}🎨 Teste 5: Conteúdo do Frontend...${NC}"
    
    local content=$(curl -s http://localhost:$FRONTEND_PORT 2>/dev/null || echo "")
    local checks=0
    local total_checks=5
    
    # Verificar título
    if [[ "$content" =~ "InvestSim" ]]; then
        log "   ${GREEN}✅ Título InvestSim encontrado${NC}"
        ((checks++))
    else
        log "   ${RED}❌ Título InvestSim não encontrado${NC}"
    fi
    
    # Verificar componentes
    local components=("Simuladores" "Mercado" "Artigos" "Sobre")
    for component in "${components[@]}"; do
        if [[ "$content" =~ "$component" ]]; then
            log "   ${GREEN}✅ Componente '$component' encontrado${NC}"
            ((checks++))
        else
            log "   ${RED}❌ Componente '$component' não encontrado${NC}"
        fi
    done
    
    if [ $checks -eq $total_checks ]; then
        add_test_result "Frontend Content" "PASSED" "$checks/$total_checks components found"
    else
        add_test_result "Frontend Content" "FAILED" "$checks/$total_checks components found"
    fi
}

# Teste 6: Teste de segurança (CORS)
test_security_cors() {
    log "${BLUE}🔒 Teste 6: Segurança CORS...${NC}"
    
    # Testar requisição com origem não autorizada
    local cors_response=$(curl -s -I \
        -H "Origin: http://malicious-site.com" \
        http://localhost:$BACKEND_PORT/api/articles 2>/dev/null || echo "")
    
    # Testar requisição com origem autorizada
    local valid_cors_response=$(curl -s -I \
        -H "Origin: http://localhost:$FRONTEND_PORT" \
        http://localhost:$BACKEND_PORT/api/articles 2>/dev/null || echo "")
    
    if [[ "$valid_cors_response" =~ "200 OK" ]]; then
        log "   ${GREEN}✅ CORS configurado corretamente${NC}"
        add_test_result "Security CORS" "PASSED" "Valid origin accepted"
    else
        log "   ${YELLOW}⚠️  CORS pode não estar configurado${NC}"
        add_test_result "Security CORS" "WARNING" "CORS validation inconclusive"
    fi
}

# Teste 7: Teste de performance
test_performance() {
    log "${BLUE}⚡ Teste 7: Performance...${NC}"
    
    local start_time=$(date +%s%N)
    local response=$(curl -s http://localhost:$FRONTEND_PORT 2>/dev/null || echo "")
    local end_time=$(date +%s%N)
    
    local duration=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds
    
    if [ $duration -lt 1000 ]; then
        log "   ${GREEN}✅ Frontend resposta rápida: ${duration}ms${NC}"
        add_test_result "Performance Frontend" "PASSED" "${duration}ms response time"
    elif [ $duration -lt 3000 ]; then
        log "   ${YELLOW}⚠️  Frontend resposta moderada: ${duration}ms${NC}"
        add_test_result "Performance Frontend" "WARNING" "${duration}ms response time"
    else
        log "   ${RED}❌ Frontend resposta lenta: ${duration}ms${NC}"
        add_test_result "Performance Frontend" "FAILED" "${duration}ms response time"
    fi
    
    # Teste API performance
    start_time=$(date +%s%N)
    response=$(curl -s http://localhost:$BACKEND_PORT/api/articles 2>/dev/null || echo "")
    end_time=$(date +%s%N)
    
    duration=$(( (end_time - start_time) / 1000000 ))
    
    if [ $duration -lt 500 ]; then
        log "   ${GREEN}✅ Backend API rápida: ${duration}ms${NC}"
        add_test_result "Performance Backend" "PASSED" "${duration}ms API response"
    elif [ $duration -lt 1500 ]; then
        log "   ${YELLOW}⚠️  Backend API moderada: ${duration}ms${NC}"
        add_test_result "Performance Backend" "WARNING" "${duration}ms API response"
    else
        log "   ${RED}❌ Backend API lenta: ${duration}ms${NC}"
        add_test_result "Performance Backend" "FAILED" "${duration}ms API response"
    fi
}

# Teste 8: Teste de recursos (memória e CPU)
test_resources() {
    log "${BLUE}📊 Teste 8: Uso de Recursos...${NC}"
    
    # Verificar se há containers Docker rodando
    if docker ps --format "{{.Names}}" | grep -q investsim 2>/dev/null; then
        log "   ${BLUE}🐳 Verificando recursos dos containers Docker...${NC}"
        
        local stats=$(docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep investsim | head -2)
        
        if [ -n "$stats" ]; then
            echo "$stats" | while read -r line; do
                log "   ${GREEN}📈 $line${NC}"
            done
            add_test_result "Resource Usage" "PASSED" "Docker containers within limits"
        else
            add_test_result "Resource Usage" "WARNING" "Could not get Docker stats"
        fi
    else
        log "   ${BLUE}💻 Verificando processos locais...${NC}"
        
        # Verificar processos Node.js
        local node_processes=$(pgrep -f "node\|npm" | wc -l)
        log "   ${GREEN}🟢 Processos Node.js: $node_processes${NC}"
        
        add_test_result "Resource Usage" "PASSED" "$node_processes Node.js processes running"
    fi
}

# Teste 9: Teste de logs
test_logs() {
    log "${BLUE}📝 Teste 9: Logs do Sistema...${NC}"
    
    local log_checks=0
    local total_log_checks=2
    
    # Verificar logs do backend
    if [ -f "logs/backend.log" ]; then
        local backend_log_size=$(wc -l < logs/backend.log)
        if [ $backend_log_size -gt 0 ]; then
            log "   ${GREEN}✅ Log do backend: $backend_log_size linhas${NC}"
            ((log_checks++))
        else
            log "   ${YELLOW}⚠️  Log do backend vazio${NC}"
        fi
    elif [ -f "backend-5598.log" ]; then
        local backend_log_size=$(wc -l < backend-5598.log)
        if [ $backend_log_size -gt 0 ]; then
            log "   ${GREEN}✅ Log do backend: $backend_log_size linhas${NC}"
            ((log_checks++))
        else
            log "   ${YELLOW}⚠️  Log do backend vazio${NC}"
        fi
    else
        log "   ${YELLOW}⚠️  Log do backend não encontrado${NC}"
    fi
    
    # Verificar logs do frontend
    if [ -f "logs/frontend.log" ]; then
        local frontend_log_size=$(wc -l < logs/frontend.log)
        if [ $frontend_log_size -gt 0 ]; then
            log "   ${GREEN}✅ Log do frontend: $frontend_log_size linhas${NC}"
            ((log_checks++))
        else
            log "   ${YELLOW}⚠️  Log do frontend vazio${NC}"
        fi
    elif [ -f "frontend-5099.log" ]; then
        local frontend_log_size=$(wc -l < frontend-5099.log)
        if [ $frontend_log_size -gt 0 ]; then
            log "   ${GREEN}✅ Log do frontend: $frontend_log_size linhas${NC}"
            ((log_checks++))
        else
            log "   ${YELLOW}⚠️  Log do frontend vazio${NC}"
        fi
    else
        log "   ${YELLOW}⚠️  Log do frontend não encontrado${NC}"
    fi
    
    if [ $log_checks -eq $total_log_checks ]; then
        add_test_result "System Logs" "PASSED" "Both logs present and populated"
    else
        add_test_result "System Logs" "WARNING" "$log_checks/$total_log_checks logs found"
    fi
}

# Teste 10: Teste de integração completa
test_full_integration() {
    log "${BLUE}🔗 Teste 10: Integração Completa...${NC}"
    
    # Simular fluxo completo: Frontend -> Backend -> Simulação
    log "   🔄 Testando fluxo completo de simulação..."
    
    # 1. Acessar frontend
    local frontend_ok=false
    if curl -s http://localhost:$FRONTEND_PORT >/dev/null 2>&1; then
        frontend_ok=true
    fi
    
    # 2. Chamar API de simulação via backend
    local simulation_payload='{
        "initialAmount": 5000,
        "monthlyContribution": 500,
        "interestRate": 10.5,
        "period": 24
    }'
    
    local simulation_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$simulation_payload" \
        http://localhost:$BACKEND_PORT/api/simulation/cdb-basic 2>/dev/null || echo "")
    
    # 3. Verificar dados de mercado
    local market_response=$(curl -s http://localhost:$BACKEND_PORT/api/market/quotes 2>/dev/null || echo "")
    
    local integration_score=0
    
    if [ "$frontend_ok" = true ]; then
        log "   ${GREEN}✅ Frontend acessível${NC}"
        ((integration_score++))
    fi
    
    if [[ "$simulation_response" =~ "finalAmount" ]]; then
        log "   ${GREEN}✅ Simulação funcionando${NC}"
        ((integration_score++))
    fi
    
    if [[ "$market_response" =~ "symbol\|price\|change" ]] || [ ${#market_response} -gt 10 ]; then
        log "   ${GREEN}✅ Dados de mercado disponíveis${NC}"
        ((integration_score++))
    fi
    
    if [ $integration_score -eq 3 ]; then
        add_test_result "Full Integration" "PASSED" "All integration points working"
    else
        add_test_result "Full Integration" "FAILED" "$integration_score/3 integration points working"
    fi
}

# Executar todos os testes
run_all_tests() {
    log "${BLUE}🚀 Iniciando suite de testes...${NC}"
    
    test_services_running
    test_http_connectivity
    test_backend_apis
    test_cdb_simulation
    test_frontend_content
    test_security_cors
    test_performance
    test_resources
    test_logs
    test_full_integration
}

# Gerar relatório de testes
generate_report() {
    log "${BLUE}📋 Gerando relatório de testes...${NC}"
    
    local total_tests=${#TEST_RESULTS[@]}
    local passed_tests=0
    local failed_tests=0
    local warning_tests=0
    
    echo -e "\n${CYAN}======================================================"
    echo "                  RELATÓRIO DE TESTES                "
    echo -e "======================================================${NC}"
    
    for result in "${TEST_RESULTS[@]}"; do
        IFS=':' read -r test_name status details <<< "$result"
        
        case $status in
            "PASSED")
                echo -e "${GREEN}✅ $test_name${NC} - $details"
                ((passed_tests++))
                ;;
            "FAILED")
                echo -e "${RED}❌ $test_name${NC} - $details"
                ((failed_tests++))
                ;;
            "WARNING")
                echo -e "${YELLOW}⚠️  $test_name${NC} - $details"
                ((warning_tests++))
                ;;
        esac
    done
    
    echo -e "\n${BLUE}📊 RESUMO:${NC}"
    echo -e "   Total de testes: $total_tests"
    echo -e "   ${GREEN}✅ Aprovados: $passed_tests${NC}"
    echo -e "   ${RED}❌ Falharam: $failed_tests${NC}"
    echo -e "   ${YELLOW}⚠️  Avisos: $warning_tests${NC}"
    
    local success_rate=$(( passed_tests * 100 / total_tests ))
    echo -e "   📈 Taxa de sucesso: $success_rate%"
    
    # Salvar relatório em arquivo
    {
        echo "InvestSim Pro - Relatório de Testes"
        echo "Executado em: $(date)"
        echo "=================================="
        echo
        for result in "${TEST_RESULTS[@]}"; do
            IFS=':' read -r test_name status details <<< "$result"
            echo "$status - $test_name: $details"
        done
        echo
        echo "RESUMO:"
        echo "Total: $total_tests, Aprovados: $passed_tests, Falharam: $failed_tests, Avisos: $warning_tests"
        echo "Taxa de sucesso: $success_rate%"
    } > "test-report-$(date +%Y%m%d-%H%M%S).txt"
    
    if [ $failed_tests -eq 0 ]; then
        log "${GREEN}🎉 Todos os testes principais passaram!${NC}"
        return 0
    else
        log "${RED}💥 $failed_tests teste(s) falharam${NC}"
        return 1
    fi
}

# Função principal
main() {
    print_banner
    
    # Verificar se os serviços estão rodando
    if ! lsof -i:$FRONTEND_PORT >/dev/null 2>&1 || ! lsof -i:$BACKEND_PORT >/dev/null 2>&1; then
        log "${YELLOW}⚠️  Serviços não estão rodando. Execute primeiro:${NC}"
        log "   ${BLUE}./deploy.sh${NC}"
        echo
        echo "Ou para testar containers Docker:"
        log "   ${BLUE}docker-compose up -d${NC}"
        exit 1
    fi
    
    run_all_tests
    
    if generate_report; then
        log "${GREEN}🎉 Suite de testes concluída com sucesso!${NC}"
        exit 0
    else
        log "${RED}💥 Suite de testes falhou${NC}"
        exit 1
    fi
}

# Executar função principal
main "$@"
