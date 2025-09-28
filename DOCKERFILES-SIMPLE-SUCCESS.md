# ✅ Dockerfiles Simples Criados - InvestSim Pro

## 🎯 Resumo

Foram criados **Dockerfiles simples e independentes** para backend e frontend, permitindo containerização individual de cada serviço.

---

## 📁 Arquivos Criados

### 1. **Backend Dockerfile** (`backend/Dockerfile.simple`)
```dockerfile
# Backend Dockerfile - NestJS
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm ci --only=production && npm cache clean --force

EXPOSE 5598
ENV PORT=5598
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
```

### 2. **Frontend Dockerfile** (`frontend/Dockerfile.simple`) 
```dockerfile
# Frontend Dockerfile - Next.js
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ENV NEXT_PUBLIC_API_URL=http://localhost:5598
ENV API_BASE_URL=http://backend:5598

RUN npm run build
EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]
```

### 3. **Docker Compose Simples** (`docker-compose.simple.yml`)
```yaml
version: '3.8'

services:
  # Backend - NestJS na porta 5598
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile.simple
    container_name: investsim-backend
    ports:
      - "5598:5598"
    environment:
      - NODE_ENV=production
      - PORT=5598
    volumes:
      - ./backend/data:/app/data
    restart: unless-stopped

  # Frontend - Next.js na porta 5099
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.simple
    container_name: investsim-frontend
    ports:
      - "5099:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://localhost:5598
      - API_BASE_URL=http://backend:5598
    depends_on:
      - backend
    restart: unless-stopped
```

---

## 🚀 Como Usar

### **Construir as Imagens**
```bash
# Construir ambos
sudo docker-compose -f docker-compose.simple.yml build

# Construir apenas backend
sudo docker-compose -f docker-compose.simple.yml build backend

# Construir apenas frontend  
sudo docker-compose -f docker-compose.simple.yml build frontend
```

### **Executar os Containers**
```bash
# Subir ambos os serviços
sudo docker-compose -f docker-compose.simple.yml up -d

# Verificar status
sudo docker-compose -f docker-compose.simple.yml ps

# Ver logs
sudo docker-compose -f docker-compose.simple.yml logs -f
```

### **Parar os Containers**
```bash
# Parar tudo
sudo docker-compose -f docker-compose.simple.yml down

# Parar e remover tudo
sudo docker-compose -f docker-compose.simple.yml down --rmi all
```

---

## 🔗 URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5099 | Interface web Next.js |
| **Backend** | http://localhost:5598 | API REST NestJS |
| **API Docs** | http://localhost:5598/api/docs | Swagger UI |

---

## ✅ Status dos Builds

### **Backend** - ✅ **SUCESSO**
- ✅ Imagem construída: `invest_nest_next_base_backend:latest`
- ✅ Container rodando: `investsim-backend`
- ✅ Porta: 5598
- ✅ Logs: API iniciada com sucesso

### **Frontend** - ✅ **SUCESSO** 
- ✅ Imagem construída: `invest_nest_next_base_frontend:latest`
- ✅ Container rodando: `investsim-frontend`
- ✅ Porta: 5099 (mapeada para 3000 interno)
- ✅ Logs: Next.js iniciado

---

## 🧪 Teste Automatizado

Foi criado um script de teste: `test-simple.sh`

```bash
# Executar teste
./test-simple.sh
```

**Saída esperada:**
- Status dos containers
- Verificação de portas
- URLs de acesso
- Comandos úteis
- Logs recentes

---

## 🔧 Troubleshooting

### **Problema: Porta ocupada**
```bash
# Verificar processos
sudo lsof -i:5598 -i:5099

# Parar containers existentes
sudo docker-compose down
sudo docker-compose -f docker-compose.simple.yml down
```

### **Problema: Erro de build**
```bash
# Limpar cache Docker
sudo docker system prune -a

# Reconstruir sem cache
sudo docker-compose -f docker-compose.simple.yml build --no-cache
```

### **Problema: Container não inicia**
```bash
# Ver logs detalhados
sudo docker-compose -f docker-compose.simple.yml logs backend
sudo docker-compose -f docker-compose.simple.yml logs frontend
```

---

## 💡 Vantagens dos Dockerfiles Simples

### **✅ Simplicidade**
- Dockerfiles diretos e fáceis de entender
- Menos layers, builds mais rápidos
- Configuração mínima necessária

### **✅ Independência**
- Cada serviço tem seu próprio Dockerfile
- Builds independentes
- Fácil manutenção individual

### **✅ Flexibilidade**
- Pode rodar serviços separadamente
- Fácil integração com CI/CD
- Personalização individual por serviço

### **✅ Performance**
- Images otimizadas
- Startup rápido
- Menos overhead

---

## 📊 Comparação com Dockerfile Original

| Aspecto | Original | Simples |
|---------|----------|---------|
| **Linhas** | ~70 linhas | ~25 linhas |
| **Stages** | Multi-stage | Single-stage |
| **Complexidade** | Alta | Baixa |
| **Build Time** | Mais lento | Mais rápido |
| **Size** | Otimizado | Compacto |
| **Manutenção** | Complexa | Simples |

---

## 🎉 Conclusão

Os **Dockerfiles simples** foram criados com sucesso! 

✅ **Backend e Frontend containerizados individualmente**  
✅ **Builds funcionando perfeitamente**  
✅ **Containers rodando com sucesso**  
✅ **Scripts de teste automatizados**  
✅ **Documentação completa**

**Sistema pronto para uso com Docker simples! 🚀**
