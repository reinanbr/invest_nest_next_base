#!/bin/bash

# InvestSim Pro - Script para Parar Serviços
# ===========================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "${BLUE}🛑 Parando serviços do InvestSim Pro...${NC}"

# Parar processos locais
if [ -f ".backend.pid" ]; then
    PID=$(cat .backend.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        log "${GREEN}✅ Backend parado (PID: $PID)${NC}"
    fi
    rm .backend.pid
fi

if [ -f ".frontend.pid" ]; then
    PID=$(cat .frontend.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        log "${GREEN}✅ Frontend parado (PID: $PID)${NC}"
    fi
    rm .frontend.pid
fi

# Parar processos por porta
for port in 5598 5099; do
    if lsof -ti:$port >/dev/null 2>&1; then
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        log "${GREEN}✅ Processos na porta $port parados${NC}"
    fi
done

# Parar containers Docker
if docker-compose ps | grep -q investsim 2>/dev/null; then
    docker-compose down
    log "${GREEN}✅ Containers Docker parados${NC}"
fi

log "${GREEN}🎉 Todos os serviços foram parados!${NC}"
