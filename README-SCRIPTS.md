# InvestSim Pro - Scripts de Implementação e Teste

Este diretório contém os scripts principais para implementação, teste e monitoramento do sistema InvestSim Pro.

## 📜 Scripts Disponíveis

### 🚀 Deploy e Implementação

#### `./deploy.sh` - Script Principal de Deploy
Script completo para implementação do sistema com diferentes modos.

**Uso:**
```bash
# Deploy local (desenvolvimento)
./deploy.sh local

# Deploy com Docker (produção)
./deploy.sh docker

# Deploy com Docker (desenvolvimento)
./deploy.sh dev

# Deploy com Kubernetes
./deploy.sh kubernetes

# Ajuda
./deploy.sh --help
```

**Funcionalidades:**
- ✅ Verificação de dependências (Node.js, npm, Docker, etc.)
- ✅ Análise de recursos do sistema
- ✅ Verificação de portas disponíveis
- ✅ Instalação de dependências do projeto
- ✅ Build da aplicação
- ✅ Deploy baseado no modo escolhido
- ✅ Health checks automáticos
- ✅ Execução de testes básicos

---

### 🧪 Testes

#### `./test-complete.sh` - Suite Completa de Testes
Executa todos os testes do sistema de forma automatizada.

**Testes Incluídos:**
1. **Serviços Rodando** - Verifica se backend e frontend estão ativos
2. **Conectividade HTTP** - Testa códigos de resposta HTTP
3. **APIs do Backend** - Testa todos os endpoints da API
4. **Simulação CDB** - Testa funcionalidade de simulação
5. **Conteúdo Frontend** - Verifica componentes da interface
6. **Segurança CORS** - Testa configurações de CORS
7. **Performance** - Mede tempo de resposta
8. **Uso de Recursos** - Verifica limites de RAM/CPU
9. **Logs do Sistema** - Verifica geração de logs
10. **Integração Completa** - Teste end-to-end

**Resultado:**
- Gera relatório detalhado
- Salva arquivo de relatório com timestamp
- Retorna código de saída baseado no sucesso

---

#### Scripts de Teste Específicos

##### `./test-security-config.sh` - Testes de Segurança
- Verifica configuração de portas
- Testa CORS e acesso restrito
- Valida configuração nginx

##### `./test-resource-limits.sh` - Testes de Recursos
- Verifica limites de RAM (2GB por serviço)
- Testa limites de CPU (1 core por serviço)
- Monitora uso real vs. configurado

##### `./test-port.sh` - Teste Rápido de Portas
- Teste simples de conectividade
- Verificação rápida de status

---

### 🔧 Gerenciamento

#### `./stop.sh` - Parar Serviços
Para todos os serviços do InvestSim Pro.

**Funcionalidades:**
- Para processos locais (por PID)
- Mata processos nas portas 5098/5099
- Para containers Docker
- Limpeza completa

#### `./monitor.sh` - Monitor em Tempo Real
Monitor interativo dos serviços em tempo real.

**Funcionalidades:**
- Status dos serviços (verde/vermelho)
- Recursos do sistema (RAM, CPU, Load)
- Status dos containers Docker
- Logs recentes (últimas linhas)
- Estatísticas de performance
- Lista de endpoints disponíveis
- Atualização automática a cada 5 segundos

---

## 🎯 Fluxo de Uso Recomendado

### 1. Deploy Inicial
```bash
# Tornar scripts executáveis
chmod +x *.sh

# Deploy local para desenvolvimento
./deploy.sh local

# OU deploy com Docker para produção
./deploy.sh docker
```

### 2. Executar Testes
```bash
# Suite completa de testes
./test-complete.sh

# Testes específicos
./test-security-config.sh
./test-resource-limits.sh
```

### 3. Monitoramento
```bash
# Monitor em tempo real
./monitor.sh
```

### 4. Parar Serviços
```bash
# Parar tudo
./stop.sh
```

---

## 📊 Configurações dos Serviços

### Portas
- **Frontend**: 5099 (público, para nginx)
- **Backend**: 5098 (localhost apenas)

### Limites de Recursos
- **RAM**: 2GB máximo por serviço
- **CPU**: 1 core máximo por serviço
- **Reservas**: 512MB RAM, 0.25 CPU (produção)

### Segurança
- Backend escuta apenas localhost
- CORS configurado para aceitar apenas frontend local
- Nginx como proxy reverso para acesso externo

---

## 🔍 Logs e Debugging

### Locais de Logs
```
logs/
├── backend.log      # Logs do backend
├── frontend.log     # Logs do frontend
└── deploy.log       # Logs de deploy

# Ou na raiz do projeto:
├── backend-5098.log
├── frontend-5099.log
└── test-report-YYYYMMDD-HHMMSS.txt
```

### Comandos de Debug
```bash
# Ver logs em tempo real
tail -f logs/backend.log
tail -f logs/frontend.log

# Status dos processos
lsof -i:5098  # Backend
lsof -i:5099  # Frontend

# Docker stats
docker stats

# Kubernetes
kubectl top pods -n investsim-pro
kubectl logs -f deployment/investsim-backend -n investsim-pro
```

---

## 🚨 Troubleshooting

### Problema: Portas Ocupadas
```bash
# Verificar o que está usando as portas
lsof -i:5098
lsof -i:5099

# Parar serviços
./stop.sh

# Ou manualmente
lsof -ti:5098 | xargs kill -9
lsof -ti:5099 | xargs kill -9
```

### Problema: Falha no Build
```bash
# Limpar node_modules
rm -rf frontend/node_modules backend/node_modules
rm -rf frontend/.next backend/dist

# Reinstalar dependências
cd backend && npm install
cd ../frontend && npm install

# Deploy novamente
./deploy.sh
```

### Problema: Containers Docker
```bash
# Parar e remover containers
docker-compose down
docker system prune -f

# Rebuild containers
docker-compose build --no-cache
./deploy.sh docker
```

---

## 📈 Métricas de Sucesso

### Testes Aprovados (Mínimo para Produção)
- ✅ Todos os serviços rodando
- ✅ HTTP 200 em todos os endpoints
- ✅ Simulação CDB funcionando
- ✅ Frontend carregando componentes
- ✅ CORS configurado
- ✅ Tempo de resposta < 1s
- ✅ Recursos dentro dos limites

### Performance Esperada
- **Frontend**: < 500ms primeira carga
- **Backend API**: < 200ms resposta
- **Simulação CDB**: < 100ms processamento
- **Uso de RAM**: < 1GB por serviço em produção
- **Uso de CPU**: < 50% por core em operação normal

---

## 🎉 Scripts Prontos para Produção

Todos os scripts incluem:
- ✅ Tratamento de erros (set -e)
- ✅ Logs com timestamp
- ✅ Códigos de saída apropriados
- ✅ Cores para melhor legibilidade
- ✅ Verificações de pré-requisitos
- ✅ Limpeza automática (cleanup)
- ✅ Documentação inline
- ✅ Tratamento de sinais (Ctrl+C)

**Sistema pronto para implementação em produção! 🚀**
