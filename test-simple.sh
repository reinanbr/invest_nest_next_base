#!/bin/bash

# Script de teste para containers Docker simples
echo "🧪 Testando InvestSim Pro - Containers Simples"
echo "==============================================="

# Verificar se os containers estão rodando
echo ""
echo "📊 Status dos Containers:"
sudo docker-compose -f docker-compose.simple.yml ps

echo ""
echo "🔍 Verificando Portas:"
echo "Backend (5598):"
if lsof -i:5598 >/dev/null 2>&1; then
    echo "  ✅ Porta 5598 ativa"
else
    echo "  ❌ Porta 5598 não está ativa"
fi

echo "Frontend (5099):"
if lsof -i:5099 >/dev/null 2>&1; then
    echo "  ✅ Porta 5099 ativa"
else
    echo "  ❌ Porta 5099 não está ativa"
fi

echo ""
echo "🌐 URLs de Acesso:"
echo "  Frontend: http://localhost:5099"
echo "  Backend:  http://localhost:5598"
echo "  API Docs: http://localhost:5598/api/docs"

echo ""
echo "📋 Comandos Úteis:"
echo "  # Ver logs:"
echo "  sudo docker-compose -f docker-compose.simple.yml logs -f"
echo ""
echo "  # Parar containers:"
echo "  sudo docker-compose -f docker-compose.simple.yml down"
echo ""
echo "  # Reconstruir:"
echo "  sudo docker-compose -f docker-compose.simple.yml build"
echo ""
echo "  # Subir novamente:"
echo "  sudo docker-compose -f docker-compose.simple.yml up -d"

echo ""
echo "🔧 Logs Recentes:"
echo "Backend:"
sudo docker-compose -f docker-compose.simple.yml logs --tail=3 backend 2>/dev/null | sed 's/^/  /'

echo ""
echo "Frontend:" 
sudo docker-compose -f docker-compose.simple.yml logs --tail=3 frontend 2>/dev/null | sed 's/^/  /'
