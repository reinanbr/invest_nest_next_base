# InvestSim Pro - Docker & Kubernetes Deployment

Sistema completo de simulação de investimentos com backend NestJS, frontend Next.js e deploy automatizado com Docker e Kubernetes.

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Nginx Ingress │    │   Frontend       │    │   Backend       │
│   (External)    │────│   (Next.js)      │────│   (NestJS)      │
│   Port 80/443   │    │   Port 3000      │    │   Port 3000     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                ┌─────────────────┐
                                                │   File Storage  │
                                                │   (Articles)    │
                                                └─────────────────┘
```

## 🚀 Quick Start

### Opção 1: Kubernetes (Recomendado para Produção)

```bash
# 1. Build das imagens
make build-local

# 2. Deploy completo no Kubernetes
make k8s-deploy

# 3. Verificar status
make k8s-status
```

### Opção 2: Docker Compose (Desenvolvimento)

```bash
# Ambiente de desenvolvimento
make dev-up

# Ambiente de produção
make prod-up
```

## 📋 Pré-requisitos

### Para Kubernetes:
- Docker
- Kubernetes cluster (local com minikube/kind ou cloud)
- kubectl configurado
- Ingress Controller (nginx-ingress)
- Metrics Server (para HPA)

### Para Docker Compose:
- Docker
- Docker Compose

## 🔧 Configuração

### 1. Configurar Domínios
Edite o arquivo `k8s/08-ingress.yaml`:
```yaml
# Substitua pelos seus domínios
- host: investsim.yourdomain.com
- host: api.investsim.yourdomain.com
```

### 2. Configurar Persistent Volume
Edite o arquivo `k8s/03-persistent-volume.yaml`:
```yaml
# Substitua pelo nome do seu nó
values:
- node-name  # Seu nó do Kubernetes
```

### 3. Preparar Dados dos Artigos
```bash
# Copie os dados para o nó Kubernetes
sudo mkdir -p /opt/investsim-data
sudo cp -r backend/data/* /opt/investsim-data/
sudo chown -R 1001:1001 /opt/investsim-data
```

## 🛠️ Comandos Disponíveis

### Build e Deploy
```bash
make build-local          # Build imagens localmente
make build-registry        # Build e push para registry
make k8s-deploy           # Deploy no Kubernetes
make k8s-update           # Atualizar deployment
make full-deploy          # Build + Deploy em um comando
```

### Desenvolvimento
```bash
make dev-up               # Subir com Docker Compose
make dev-down             # Parar Docker Compose
make dev-logs             # Ver logs do desenvolvimento
```

### Monitoramento
```bash
make k8s-status           # Status dos recursos
make logs-backend         # Logs do backend
make logs-frontend        # Logs do frontend
make monitor              # Monitoramento em tempo real
```

### Port Forwarding (Teste Local)
```bash
make port-forward-frontend  # Frontend em localhost:3000
make port-forward-backend   # Backend em localhost:3001
```

### Debug
```bash
make shell-backend        # Shell no container backend
make shell-frontend       # Shell no container frontend
```

### Limpeza
```bash
make clean-docker         # Limpar imagens não utilizadas
make clean-k8s           # Limpar recursos Kubernetes
make k8s-delete          # Deletar todos os recursos
```

## 🌐 URLs de Acesso

### Produção (após deploy):
- **Frontend**: https://investsim.yourdomain.com
- **API**: https://api.investsim.yourdomain.com
- **API Docs**: https://api.investsim.yourdomain.com/api/docs

### Desenvolvimento (Docker Compose):
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

## 📊 Recursos do Kubernetes

### Deployments
- **Frontend**: 2 réplicas (escalável até 10)
- **Backend**: 2 réplicas (escalável até 10)

### Recursos por Pod
- **Backend**: 256Mi-512Mi RAM, 250m-500m CPU
- **Frontend**: 512Mi-1Gi RAM, 250m-500m CPU

### Features
- ✅ Auto-scaling (HPA)
- ✅ Health checks
- ✅ Rolling updates
- ✅ Network policies
- ✅ Resource limits
- ✅ Persistent storage
- ✅ SSL/TLS (via Ingress)

## 🔍 Troubleshooting

### Ver logs de erro:
```bash
kubectl logs -f deployment/investsim-backend -n investsim-pro
kubectl logs -f deployment/investsim-frontend -n investsim-pro
```

### Verificar recursos:
```bash
kubectl describe pod <pod-name> -n investsim-pro
kubectl get events -n investsim-pro --sort-by=.metadata.creationTimestamp
```

### Resetar deployment:
```bash
make k8s-delete
make k8s-deploy
```

## 🔒 Segurança

- Containers executam como usuário não-root
- Network policies restringem comunicação
- Resource limits evitam resource exhaustion  
- Health checks garantem disponibilidade
- TLS/SSL via Ingress Controller

## 📈 Monitoramento

- Health checks em `/api/articles` (backend) e `/` (frontend)
- Metrics via Kubernetes Metrics Server
- Auto-scaling baseado em CPU e memória
- Logs centralizados via kubectl

## 🎯 Próximos Passos

1. Configure cert-manager para SSL automático
2. Integre com sistema de monitoramento (Prometheus/Grafana)
3. Configure backup dos dados dos artigos
4. Implemente CI/CD pipeline
5. Configure alertas de monitoramento
