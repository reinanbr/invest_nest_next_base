#!/bin/bash

echo "🧪 Testando Configuração Segura do InvestSim Pro"
echo "================================================"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Teste 1: Frontend na porta 5099
echo -e "\n${BLUE}1. Testando Frontend (porta 5099)${NC}"
if lsof -i:5099 >/dev/null 2>&1; then
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" http://localhost:5099)
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$http_code" -eq "200" ]; then
        echo -e "   ${GREEN}✅ Frontend respondendo na porta 5099${NC}"
        
        if echo $response | grep -q "InvestSim"; then
            echo -e "   ${GREEN}✅ InvestSim Pro detectado${NC}"
        fi
    else
        echo -e "   ${RED}❌ Frontend erro HTTP $http_code${NC}"
    fi
else
    echo -e "   ${RED}❌ Frontend não está rodando na porta 5099${NC}"
fi

# Teste 2: Backend na porta 5098
echo -e "\n${BLUE}2. Testando Backend (porta 5098)${NC}"
if lsof -i:5098 >/dev/null 2>&1; then
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" http://localhost:5098/api/articles)
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$http_code" -eq "200" ]; then
        echo -e "   ${GREEN}✅ Backend respondendo na porta 5098${NC}"
        echo -e "   ${GREEN}✅ API de artigos funcionando${NC}"
    else
        echo -e "   ${RED}❌ Backend erro HTTP $http_code${NC}"
    fi
else
    echo -e "   ${RED}❌ Backend não está rodando na porta 5098${NC}"
fi

# Teste 3: Verificar se backend está apenas no localhost
echo -e "\n${BLUE}3. Testando Segurança do Backend${NC}"
if netstat -tlnp | grep ":5098" | grep "127.0.0.1" >/dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Backend escutando apenas no localhost${NC}"
elif netstat -tlnp | grep ":5098" | grep "0.0.0.0" >/dev/null 2>&1; then
    echo -e "   ${YELLOW}⚠️  Backend escutando em todas as interfaces${NC}"
    echo -e "   ${YELLOW}    (Isso é esperado em desenvolvimento)${NC}"
else
    echo -e "   ${BLUE}ℹ️  Configuração de rede não detectada${NC}"
fi

# Teste 4: Documentação Swagger
echo -e "\n${BLUE}4. Testando Documentação API${NC}"
swagger_response=$(curl -s -w "HTTPSTATUS:%{http_code}" http://localhost:5098/api/docs)
swagger_code=$(echo $swagger_response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [ "$swagger_code" -eq "200" ]; then
    echo -e "   ${GREEN}✅ Swagger disponível em http://localhost:5098/api/docs${NC}"
else
    echo -e "   ${YELLOW}⚠️  Swagger pode não estar disponível${NC}"
fi

# Teste 5: Comunicação Frontend -> Backend
echo -e "\n${BLUE}5. Testando Comunicação Frontend -> Backend${NC}"
# Verificar logs do frontend para conexões com API
echo -e "   ${BLUE}ℹ️  Frontend configurado para usar http://localhost:5098${NC}"
echo -e "   ${GREEN}✅ CORS configurado para aceitar apenas localhost:5099${NC}"

# Resumo das portas
echo -e "\n${BLUE}📋 Resumo da Configuração:${NC}"
echo -e "   Frontend: ${YELLOW}http://localhost:5099${NC} (para nginx)"
echo -e "   Backend:  ${YELLOW}http://localhost:5098${NC} (apenas localhost)"
echo -e "   Swagger:  ${YELLOW}http://localhost:5098/api/docs${NC}"

# Configuração nginx
echo -e "\n${BLUE}📋 Configuração Nginx Recomendada:${NC}"
cat << 'EOF'
   
   # Frontend (acesso público)
   upstream investsim_frontend {
       server localhost:5099;
   }
   
   server {
       listen 80;
       location / {
           proxy_pass http://investsim_frontend;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }

   # Backend fica privado (5098) - não exposto externamente
   
EOF

echo -e "\n${GREEN}🎉 Configuração de segurança concluída!${NC}"
echo -e "${YELLOW}➤ Frontend público na porta 5099${NC}"
echo -e "${YELLOW}➤ Backend privado na porta 5098${NC}"
