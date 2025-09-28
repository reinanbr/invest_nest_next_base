#!/bin/bash

# Script para testar se a aplicação está servindo na porta 5099
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 InvestSim Pro - Port 5099 Test${NC}"

# Função para verificar se porta está em uso
check_port() {
    local port=$1
    if lsof -i:$port >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Port $port is in use${NC}"
        return 0
    else
        echo -e "${RED}❌ Port $port is not in use${NC}"
        return 1
    fi
}

# Função para testar HTTP response
test_http() {
    local url=$1
    local expected_code=${2:-200}
    
    echo -e "${YELLOW}🌐 Testing HTTP response at $url${NC}"
    
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" $url)
    
    if [ "$response_code" == "$expected_code" ]; then
        echo -e "${GREEN}✅ HTTP $response_code - OK${NC}"
        return 0
    else
        echo -e "${RED}❌ HTTP $response_code - Expected $expected_code${NC}"
        return 1
    fi
}

# Testar Docker Compose
echo -e "${YELLOW}📦 Testing Docker Compose configuration...${NC}"

if docker-compose ps | grep investsim-frontend >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend container is running${NC}"
    
    # Verificar porta 5099
    if check_port 5099; then
        echo -e "${GREEN}✅ Port 5099 is bound${NC}"
        
        # Testar HTTP response
        sleep 3  # Aguardar container iniciar
        if test_http "http://localhost:5099"; then
            echo -e "${GREEN}✅ Frontend is serving on port 5099${NC}"
            
            # Testar se é o InvestSim Pro
            local title=$(curl -s http://localhost:5099 | grep -o '<title>[^<]*' | sed 's/<title>//')
            if [[ $title == *"InvestSim"* ]]; then
                echo -e "${GREEN}✅ InvestSim Pro title found in response${NC}"
            else
                echo -e "${YELLOW}⚠️  Title: '$title'${NC}"
            fi
        else
            echo -e "${RED}❌ Frontend not responding on port 5099${NC}"
        fi
    else
        echo -e "${RED}❌ Port 5099 is not bound${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Frontend container not running - starting with Docker Compose...${NC}"
    
    # Tentar subir com Docker Compose
    echo -e "${YELLOW}🚀 Starting Docker Compose...${NC}"
    docker-compose -f docker-compose.dev.yml up -d
    
    echo -e "${YELLOW}⏰ Waiting 30 seconds for containers to start...${NC}"
    sleep 30
    
    # Testar novamente
    if check_port 5099 && test_http "http://localhost:5099"; then
        echo -e "${GREEN}🎉 Success! Frontend is now serving on port 5099${NC}"
    else
        echo -e "${RED}❌ Failed to start frontend on port 5099${NC}"
        
        # Mostrar logs para debug
        echo -e "${YELLOW}📋 Container logs:${NC}"
        docker-compose -f docker-compose.dev.yml logs frontend --tail=20
        exit 1
    fi
fi

# Testar backend também
echo -e "${YELLOW}🔧 Testing backend connection...${NC}"
if check_port 3001; then
    if test_http "http://localhost:3001/api/articles"; then
        echo -e "${GREEN}✅ Backend API is responding on port 3001${NC}"
    fi
fi

# Mostrar configuração nginx sugerida
echo -e "${BLUE}📋 Nginx Configuration Suggestion:${NC}"
cat << 'EOF'

# Add this to your nginx configuration:
upstream investsim_frontend {
    server localhost:5099;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://investsim_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

EOF

echo -e "${GREEN}🎉 Port 5099 test completed!${NC}"
echo -e "${BLUE}📋 Access points:${NC}"
echo -e "  Frontend: ${YELLOW}http://localhost:5099${NC}"
echo -e "  Backend:  ${YELLOW}http://localhost:3001${NC}"
echo -e "  API Docs: ${YELLOW}http://localhost:3001/api/docs${NC}"
