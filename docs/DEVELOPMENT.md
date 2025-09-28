# Guia de Desenvolvimento - InvestSim Pro

## Estrutura Detalhada da Arquitetura

### Backend (NestJS)

#### Módulo Articles
- **Controller**: Endpoints REST para artigos
- **Service**: Lógica de negócio para leitura de arquivos
- **Data**: Sistema de arquivos JSON + HTML

```typescript
// Fluxo de dados dos artigos:
articles.json → ArticlesService → ArticlesController → Frontend
content/*.html ↗
```

#### Módulo Simulation
- **Controller**: Endpoints para diferentes tipos de simulação
- **Service**: Algoritmos de cálculo financeiro
- **Validação**: Class-validator para inputs

```typescript
// Tipos de simulação disponíveis:
1. CDB Básico (taxa + período + IR)
2. CDB + IPO (diversificação)
3. CDB + IPO + Inflação (ganho real)
```

#### Módulo Market
- **Controller**: Endpoints para dados de mercado
- **Service**: Mock de dados (production → API externa)
- **Types**: Cotações, índices, gráficos

### Frontend (Next.js)

#### App Router Structure
```
app/
├── layout.tsx          # Layout principal
├── page.tsx            # Homepage
├── simulators/         # Páginas de simulação
│   ├── page.tsx        # Lista de simuladores
│   ├── cdb/page.tsx    # CDB básico
│   ├── cdb-ipo/page.tsx # CDB + IPO
│   └── cdb-ipo-inflation/page.tsx # CDB + IPO + Inflação
├── market/
│   ├── page.tsx        # Dashboard mercado
│   └── [symbol]/page.tsx # Detalhes de ativo
└── articles/
    ├── page.tsx        # Lista de artigos
    └── [slug]/page.tsx # Artigo específico
```

#### Component Architecture
```
components/
├── layout/
│   ├── Navbar.tsx      # Navegação principal
│   ├── Sidebar.tsx     # Sidebar (se necessário)
│   └── Footer.tsx      # Rodapé
├── simulation/
│   ├── SimulationCards.tsx      # Grid de simuladores
│   ├── CDBSimulator.tsx         # Formulário CDB
│   ├── CDBIPOSimulator.tsx      # Formulário CDB+IPO
│   ├── InflationSimulator.tsx   # Formulário com inflação
│   └── ResultsDisplay.tsx       # Exibição resultados
├── market/
│   ├── MarketTicker.tsx         # Ticker animado
│   ├── MarketCharts.tsx         # Dashboard gráficos
│   ├── QuoteCard.tsx            # Card cotação
│   ├── ChartWidget.tsx          # Gráfico individual
│   └── IndexCard.tsx            # Card índice
├── articles/
│   ├── FeaturedArticles.tsx     # Artigos destaque
│   ├── ArticleCard.tsx          # Card artigo
│   ├── ArticleList.tsx          # Lista com filtros
│   └── ArticleContent.tsx       # Renderização HTML
└── ui/
    ├── Button.tsx               # Botão base
    ├── Input.tsx                # Input base
    ├── Card.tsx                 # Card base
    ├── Loading.tsx              # Loading states
    └── Modal.tsx                # Modal base
```

## APIs e Integrações

### Estrutura de Response Padrão
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### Error Handling
```typescript
// Backend (NestJS)
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Tratamento padronizado de erros
  }
}

// Frontend (Axios Interceptors)
api.interceptors.response.use(
  response => response,
  error => {
    // Log de erros e tratamento
    return Promise.reject(error);
  }
);
```

### Validação de Dados
```typescript
// Backend - DTOs com class-validator
export class CDBBasicInputDto {
  @IsNumber()
  @Min(1)
  initialAmount: number;

  @IsNumber()
  @Min(0.01)
  rate: number;

  @IsNumber()
  @Min(1)
  period: number;

  @IsNumber()
  @Min(1)
  cdbRate: number;
}

// Frontend - Validação no formulário
const validateForm = (data: CDBBasicInput): string[] => {
  const errors: string[] = [];
  if (data.initialAmount <= 0) errors.push('Valor inicial inválido');
  if (data.rate <= 0) errors.push('Taxa inválida');
  // ... mais validações
  return errors;
};
```

## Sistema de Arquivos para Artigos

### Estrutura de Dados
```json
// articles.json
{
  "articles": [
    {
      "id": 1,
      "title": "CDB: Certificado de Depósito Bancário",
      "slug": "cdb-basico",
      "date": "2024-01-15",
      "thumbUrl": "/api/images/thumbs/1.jpg",
      "description": "Guia completo sobre CDB...",
      "tags": ["cdb", "renda-fixa", "iniciantes"],
      "readTime": 8
    }
  ],
  "lastUpdated": "2024-02-05T10:00:00Z"
}
```

### Conteúdo HTML
```html
<!-- content/cdb-basico.html -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>CDB: Certificado de Depósito Bancário</title>
</head>
<body>
    <article>
        <header>
            <h1>CDB: Certificado de Depósito Bancário</h1>
        </header>
        <section>
            <!-- Conteúdo estruturado -->
        </section>
    </article>
</body>
</html>
```

### Fluxo de Leitura
1. **Frontend** solicita lista de artigos
2. **Backend** lê `articles.json`
3. **Frontend** solicita artigo específico por slug  
4. **Backend** lê arquivo HTML correspondente
5. **Frontend** renderiza conteúdo com estilos

## Algoritmos de Simulação

### CDB Básico
```typescript
// Cálculo de juros compostos diários
const dailyRate = (cdiRate * cdbPercentage / 100) / 365;
const finalAmount = initialAmount * Math.pow(1 + dailyRate, days);
const grossReturn = finalAmount - initialAmount;

// Tabela regressiva IR
const taxRate = days <= 180 ? 0.225 : 
               days <= 360 ? 0.20 : 
               days <= 720 ? 0.175 : 0.15;

const tax = grossReturn * taxRate;
const netReturn = grossReturn - tax;
```

### CDB + IPO
```typescript
// Portfólio diversificado
const cdbResult = calculateCDB(cdbInput);
const ipoGrowth = ipoInitial * Math.pow(1 + growthRate/100, years);
const totalPortfolio = cdbResult.finalAmount + ipoGrowth;
```

### CDB + IPO + Inflação
```typescript
// Ganho real descontando inflação
const inflationFactor = Math.pow(1 + inflationRate/100, years);
const adjustedInitialValue = initialValue * inflationFactor;
const realReturn = totalPortfolio - adjustedInitialValue;
```

## Tema e Estilização

### Cores do Sistema
```css
:root {
  /* Cores principais */
  --color-background-dark: #0a0e1a;
  --color-background-card: #1a1f2e;
  --color-background-hover: #252b3d;
  
  /* Cores funcionais */
  --color-success: #22c55e;    /* Verde - alta */
  --color-danger: #ef4444;     /* Vermelho - baixa */
  --color-warning: #f59e0b;    /* Amarelo - neutro */
  --color-primary: #0ea5e9;    /* Azul - ações */
  
  /* Gráficos */
  --color-chart-green: #10b981;
  --color-chart-red: #ef4444;
  --color-chart-blue: #3b82f6;
  --color-chart-purple: #8b5cf6;
}
```

### Componentes Base
```css
/* Cards com backdrop blur */
.card {
  @apply bg-background-card border border-gray-700 rounded-lg p-6 shadow-lg backdrop-blur-sm;
}

/* Indicadores de mercado */
.indicator-up { @apply text-success-400; }
.indicator-down { @apply text-danger-400; }

/* Animações */
.ticker { @apply animate-[ticker_30s_linear_infinite]; }
.pulse-glow { @apply animate-[pulse-glow_2s_cubic-bezier(0.4,0,0.6,1)_infinite]; }
```

### Grid Responsivo
```css
/* Layout adaptativo */
.responsive-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}

.simulation-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}
```

## Performance e Otimizações

### Frontend
- **Code splitting** automático com Next.js
- **Image optimization** com next/image
- **Static generation** para páginas de artigos
- **Client-side caching** com React Query (futuro)

### Backend
- **File system caching** para artigos
- **Response compression** com gzip
- **Request validation** com class-validator
- **Error handling** centralizado

### Dados Mock vs Produção
```typescript
// Desenvolvimento - dados simulados
const mockQuotes = [
  { symbol: 'USDBRL', price: 5.85, change: 0.12 }
];

// Produção - integração com APIs reais
const realQuotes = await yahooFinanceAPI.getQuotes(['USDBRL=X']);
```

## Deployment e DevOps

### Scripts NPM
```json
{
  "scripts": {
    "install:all": "cd backend && npm install && cd ../frontend && npm install",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "build": "cd backend && npm run build && cd ../frontend && npm run build",
    "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
  }
}
```

### Docker (Futuro)
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]

# Frontend Dockerfile  
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
```bash
# Backend
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://investsim.com

# Frontend
API_BASE_URL=https://api.investsim.com
NEXT_PUBLIC_APP_NAME=InvestSim Pro
```

## Testes (Futuro)

### Backend - Jest
```typescript
describe('SimulationService', () => {
  it('should calculate CDB correctly', () => {
    const input = {
      initialAmount: 10000,
      rate: 13.75,
      period: 365,
      cdbRate: 110
    };
    const result = service.calculateCDB(input);
    expect(result.finalAmount).toBeGreaterThan(input.initialAmount);
  });
});
```

### Frontend - Testing Library
```typescript
describe('CDBSimulator', () => {
  it('should render form correctly', () => {
    render(<CDBSimulator />);
    expect(screen.getByLabelText('Valor inicial')).toBeInTheDocument();
  });
});
```

---

Este guia serve como referência para desenvolvimento e manutenção da plataforma InvestSim Pro.
