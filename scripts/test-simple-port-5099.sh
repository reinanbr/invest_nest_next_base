#!/bin/bash

# Script simplificado para testar porta 5099 sem Docker
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 InvestSim Pro - Simple Port 5099 Test${NC}"

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
    
    local response=$(curl -s -w "HTTPSTATUS:%{http_code}\n" $url)
    local response_code=$(echo $response | grep -o 'HTTPSTATUS:[0-9]*' | cut -d: -f2)
    
    if [ "$response_code" == "$expected_code" ]; then
        echo -e "${GREEN}✅ HTTP $response_code - OK${NC}"
        return 0
    else
        echo -e "${RED}❌ HTTP $response_code - Expected $expected_code${NC}"
        return 1
    fi
}

echo -e "${YELLOW}🔍 Checking what's running on common ports...${NC}"

# Verificar portas conhecidas
for port in 3000 3001 3002 3003 5099; do
    echo -e "${BLUE}Checking port $port:${NC}"
    if lsof -i:$port 2>/dev/null | grep -v "COMMAND" | head -1; then
        if check_port $port; then
            if test_http "http://localhost:$port" 200; then
                echo -e "${GREEN}✅ Service responding on port $port${NC}"
                
                # Verificar se é nosso frontend
                response=$(curl -s http://localhost:$port || echo "")
                if [[ $response == *"InvestSim"* ]] || [[ $response == *"Next.js"* ]]; then
                    echo -e "${GREEN}🎯 This looks like our frontend!${NC}"
                fi
            fi
        fi
    else
        echo -e "${YELLOW}  No service running${NC}"
    fi
    echo ""
done

# Testar desenvolvimento local com npm
echo -e "${YELLOW}📦 Testing local development mode...${NC}"

if [ -d "frontend" ]; then
    cd frontend
    
    if [ -f "package.json" ]; then
        echo -e "${BLUE}📋 Checking Next.js configuration:${NC}"
        
        if [ -f "next.config.js" ]; then
            echo -e "${GREEN}✅ next.config.js found${NC}"
            cat next.config.js | grep -E "(port|hostname|server)" || echo "No port config found"
        fi
        
        # Verificar se dependências estão instaladas
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}📦 Installing dependencies...${NC}"
            npm install
        fi
        
        echo -e "${YELLOW}🚀 Starting development server on port 5099...${NC}"
        
        # Criar script temporário para rodar na porta 5099
        cat > .env.local << EOF
PORT=5099
HOSTNAME=localhost
EOF
        
        # Tentar iniciar o servidor
        echo -e "${YELLOW}⏰ Starting Next.js dev server (this will run in background)...${NC}"
        
        # Rodar em background e capturar PID
        nohup npm run dev > /tmp/nextjs-dev.log 2>&1 &
        server_pid=$!
        
        echo -e "${BLUE}📋 Server PID: $server_pid${NC}"
        echo -e "${YELLOW}⏰ Waiting 15 seconds for server to start...${NC}"
        
        sleep 15
        
        # Testar se o servidor iniciou
        if check_port 5099; then
            if test_http "http://localhost:5099"; then
                echo -e "${GREEN}🎉 SUCCESS! Frontend is serving on port 5099${NC}"
                
                # Verificar conteúdo
                title=$(curl -s http://localhost:5099 | grep -o '<title>[^<]*' | sed 's/<title>//' || echo "No title found")
                echo -e "${BLUE}📄 Page title: $title${NC}"
                
                # Mostrar logs
                echo -e "${YELLOW}📋 Server logs:${NC}"
                tail -10 /tmp/nextjs-dev.log
            else
                echo -e "${RED}❌ Server not responding properly${NC}"
            fi
        else
            echo -e "${RED}❌ Port 5099 not bound${NC}"
            echo -e "${YELLOW}📋 Server logs:${NC}"
            cat /tmp/nextjs-dev.log
        fi
        
        echo -e "${YELLOW}🔧 To stop the server: kill $server_pid${NC}"
        
    else
        echo -e "${RED}❌ No package.json found in frontend directory${NC}"
    fi
    
    cd ..
else
    echo -e "${RED}❌ Frontend directory not found${NC}"
fi

# Mostrar resumo final
echo -e "${BLUE}📋 Configuration Summary:${NC}"
echo -e "  Target port: ${YELLOW}5099${NC}"
echo -e "  Nginx should proxy: ${YELLOW}http://localhost:5099${NC}"

# Configuração nginx sugerida
echo -e "${BLUE}📋 Nginx Configuration:${NC}"
cat << 'EOF'

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
        proxy_cache_bypass $http_upgrade;
    }
}

EOF

echo -e "${GREEN}🎉 Port 5099 test completed!${NC}"
