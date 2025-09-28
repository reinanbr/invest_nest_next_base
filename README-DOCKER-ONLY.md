# InvestSim Pro - Docker Only Deployment

## 📋 Visão Geral

O InvestSim Pro agora utiliza **apenas Docker** para deployment, removendo a complexidade do Kubernetes para uma solução mais simples e eficiente.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    InvestSim Pro                             │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)          Backend (NestJS)               │
│  Porta: 5099                 Porta: 5598                    │
│  ├── React Components        ├── API REST                   │
│  ├── Tailwind CSS           ├── Simulações                  │
│  ├── SSR/SSG                ├── Artigos                     │
│  └── TypeScript             └── Market Data                 │
├─────────────────────────────────────────────────────────────┤
│                    Docker Compose                           │
│  ├── Networking interno (backend:5598)                     │
│  ├── Volumes persistentes                                   │
│  ├── Health checks                                          │
│  ├── Resource limits (2GB RAM / 1 CPU)                     │
│  └── Auto-restart                                          │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Rápido

### Modo Produção
```bash
# Construir e executar
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

### Modo Desenvolvimento
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# Parar desenvolvimento
docker-compose -f docker-compose.dev.yml down
```

## 📦 Scripts NPM Disponíveis

```bash
# Docker - Produção
npm run docker:up         # Subir containers
npm run docker:down       # Parar containers
npm run docker:build      # Construir imagens
npm run docker:logs       # Ver logs
npm run docker:status     # Status dos containers

# Docker - Desenvolvimento
npm run docker:dev        # Subir em modo dev
npm run docker:dev:down   # Parar modo dev

# Utilitários Docker
npm run docker:restart    # Reiniciar containers
npm run docker:clean      # Limpar tudo (imagens, volumes)
```

## 🔧 Configuração de Portas

| Serviço  | Porta Externa | Porta Interna | Descrição |
|----------|---------------|---------------|-----------|
| Frontend | 5099          | 3000          | Interface web |
| Backend  | 5598          | 5598          | API REST |

### Comunicação Interna
- Frontend → Backend: `http://backend:5598`
- Docker networking automático

## 🔐 Configurações de Segurança

### Backend (Porta 5598)
- ✅ Acesso restrito via Docker network
- ✅ CORS configurado apenas para frontend
- ✅ Rate limiting implementado
- ✅ Input validation
- ✅ Health checks ativos

### Frontend (Porta 5099)
- ✅ Next.js com SSR/SSG
- ✅ API calls via proxy interno
- ✅ Otimizações de produção
- ✅ Static files otimizados

## 📊 Limites de Recursos

```yaml
# Cada serviço:
deploy:
  resources:
    limits:
      memory: 2G      # Máximo 2GB RAM
      cpus: '1'       # Máximo 1 CPU core
    reservations:
      memory: 512M    # Mínimo garantido
      cpus: '0.25'    # Mínimo garantido
```

## 🏥 Monitoramento

### Health Checks
- **Backend**: `http://localhost:5598/health`
- **Frontend**: `http://localhost:5099`

### Logs
```bash
# Logs em tempo real
docker-compose logs -f

# Logs específicos
docker-compose logs backend
docker-compose logs frontend

# Logs salvos
tail -f backend-5598.log
tail -f frontend-5099.log
```

## 🛠️ Scripts de Gerenciamento

### Scripts Disponíveis
- `./deploy.sh` - Deploy automatizado completo
- `./test-complete.sh` - Suite de testes completa
- `./monitor.sh` - Monitoramento em tempo real
- `./menu.sh` - Menu interativo
- `./stop.sh` - Parar todos os serviços

### Menu Interativo
```bash
./menu.sh
```
Fornece interface amigável para:
- ✅ Status dos serviços
- 🚀 Deploy/Start/Stop
- 📊 Monitoramento
- 🧪 Testes
- 📋 Logs

## 📁 Estrutura de Arquivos

```
invest_nest_next_base/
├── docker-compose.yml          # Produção
├── docker-compose.dev.yml      # Desenvolvimento
├── backend/
│   ├── Dockerfile              # Build multi-stage
│   ├── src/                    # Código NestJS
│   └── data/                   # Armazenamento local
├── frontend/
│   ├── Dockerfile              # Build otimizado
│   ├── src/                    # Código Next.js
│   └── public/                 # Assets estáticos
├── scripts/                    # Scripts de automação
├── docs/                       # Documentação
└── *.sh                        # Scripts de gerenciamento
```

## 🔄 Workflow de Deployment

### 1. Desenvolvimento
```bash
# Clonar projeto
git clone <repo>
cd invest_nest_next_base

# Subir em modo desenvolvimento
npm run docker:dev

# Acessar
# Frontend: http://localhost:5099
# Backend:  http://localhost:5598
```

### 2. Produção
```bash
# Build e deploy
npm run docker:build
npm run docker:up

# Verificar
npm run docker:status
npm run docker:logs
```

### 3. Monitoramento
```bash
# Menu interativo
./menu.sh

# Ou monitoramento direto
./monitor.sh
```

## 🚨 Troubleshooting

### Problema: Container não inicia
```bash
# Verificar logs
docker-compose logs backend
docker-compose logs frontend

# Reconstruir
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Porta ocupada
```bash
# Verificar processos
lsof -i:5598  # Backend
lsof -i:5099  # Frontend

# Parar containers
docker-compose down

# Limpar tudo
npm run docker:clean
```

### Problema: Comunicação entre serviços
```bash
# Verificar network
docker network ls
docker network inspect invest_nest_next_base_investsim-network

# Testar conectividade
docker-compose exec frontend ping backend
```

## 📈 Performance

### Otimizações Implementadas
- ✅ Multi-stage Docker builds
- ✅ Layer caching otimizado
- ✅ Static file compression
- ✅ Resource limits configurados
- ✅ Health checks eficientes
- ✅ Log rotation automático

### Métricas Esperadas
- **Startup time**: < 60 segundos
- **Memory usage**: < 4GB total
- **CPU usage**: < 2 cores total
- **Response time**: < 200ms (API)

## 🔗 URLs de Acesso

### Produção
- **Frontend**: http://localhost:5099
- **Backend API**: http://localhost:5598
- **API Docs**: http://localhost:5598/api/docs
- **Health Check**: http://localhost:5598/health

### Desenvolvimento
- **Frontend**: http://localhost:5099
- **Backend API**: http://localhost:5598
- **Hot Reload**: Ativado automaticamente

## 💡 Vantagens do Docker Only

### ✅ Simplicidade
- Uma única ferramenta (Docker Compose)
- Configuração simplificada
- Menos overhead operacional

### ✅ Performance
- Startup mais rápido
- Menos consumo de recursos
- Networking otimizado

### ✅ Manutenibilidade
- Logs centralizados
- Debugging mais fácil
- Deploy simples

### ✅ Portabilidade
- Funciona em qualquer ambiente com Docker
- Configuração consistente
- Fácil replicação

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs: `docker-compose logs`
2. Executar testes: `./test-complete.sh`
3. Menu interativo: `./menu.sh`
4. Monitoramento: `./monitor.sh`
