#!/bin/bash

echo "🧪 Testando InvestSim Pro na porta 5099..."

# Verificar se a porta está em uso
if lsof -i:5099 >/dev/null 2>&1; then
    echo "✅ Porta 5099 está ativa"
    
    # Testar resposta HTTP
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" http://localhost:5099)
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$http_code" -eq "200" ]; then
        echo "✅ HTTP 200 - Aplicação respondendo corretamente"
        
        # Verificar se é o InvestSim
        if echo $response | grep -q "InvestSim"; then
            echo "✅ InvestSim Pro detectado na porta 5099"
            echo ""
            echo "🎉 SUCESSO! Aplicação configurada na porta 5099"
            echo ""
            echo "📋 Para nginx, use:"
            echo "   upstream investsim {"
            echo "       server localhost:5099;"
            echo "   }"
            echo ""
            echo "   location / {"
            echo "       proxy_pass http://investsim;"
            echo "   }"
        else
            echo "⚠️  Aplicação respondendo mas não é InvestSim"
        fi
    else
        echo "❌ HTTP $http_code - Erro na resposta"
    fi
else
    echo "❌ Porta 5099 não está ativa"
    echo "ℹ️  Execute: cd frontend && npm run dev"
fi
