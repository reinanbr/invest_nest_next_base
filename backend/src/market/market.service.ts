import { Injectable } from '@nestjs/common';

// Definir tipos localmente
interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number; // Variação absoluta
  changePercent: number; // Variação percentual
  lastUpdate: string;
  currency: string;
}

interface CurrencyQuote extends MarketQuote {
  bidPrice: number; // Preço de compra
  askPrice: number; // Preço de venda
}

interface StockIndex {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
}

// Dados para gráficos
interface ChartDataPoint {
  timestamp: string;
  value: number;
  volume?: number;
}

interface ChartData {
  symbol: string;
  period: string; // '1D', '1W', '1M', '1Y'
  data: ChartDataPoint[];
}

// CDI e Taxa Selic para simulações
interface CDIRate {
  date: string;
  rate: number; // Taxa CDI do dia
}

interface SelicRate {
  date: string;
  rate: number; // Taxa Selic
}

@Injectable()
export class MarketService {

  /**
   * Busca cotações principais (simulação com dados mock)
   * Em produção, isso se conectaria a APIs reais como Yahoo Finance, Alpha Vantage, etc.
   */
  async getMainQuotes(): Promise<MarketQuote[]> {
    // Simula delay de API
    await this.delay(200);

    return [
      {
        symbol: 'USDBRL',
        name: 'Dólar Americano',
        price: 5.85,
        change: 0.12,
        changePercent: 2.09,
        lastUpdate: new Date().toISOString(),
        currency: 'BRL'
      },
      {
        symbol: 'EURBRL',
        name: 'Euro',
        price: 6.32,
        change: -0.08,
        changePercent: -1.25,
        lastUpdate: new Date().toISOString(),
        currency: 'BRL'
      },
      {
        symbol: 'BTCBRL',
        name: 'Bitcoin',
        price: 485000,
        change: 15420,
        changePercent: 3.28,
        lastUpdate: new Date().toISOString(),
        currency: 'BRL'
      }
    ];
  }

  /**
   * Busca cotações de moedas específicas
   */
  async getCurrencyQuotes(): Promise<CurrencyQuote[]> {
    await this.delay(150);

    return [
      {
        symbol: 'USDBRL',
        name: 'Dólar Americano',
        price: 5.85,
        change: 0.12,
        changePercent: 2.09,
        lastUpdate: new Date().toISOString(),
        currency: 'BRL',
        bidPrice: 5.84,
        askPrice: 5.86
      },
      {
        symbol: 'EURBRL',
        name: 'Euro',
        price: 6.32,
        change: -0.08,
        changePercent: -1.25,
        lastUpdate: new Date().toISOString(),
        currency: 'BRL',
        bidPrice: 6.31,
        askPrice: 6.33
      },
      {
        symbol: 'GBPBRL',
        name: 'Libra Esterlina',
        price: 7.42,
        change: 0.25,
        changePercent: 3.50,
        lastUpdate: new Date().toISOString(),
        currency: 'BRL',
        bidPrice: 7.41,
        askPrice: 7.43
      }
    ];
  }

  /**
   * Busca índices do mercado de ações
   */
  async getStockIndices(): Promise<StockIndex[]> {
    await this.delay(100);

    return [
      {
        name: 'Ibovespa',
        code: 'IBOV',
        value: 125430.85,
        change: 1250.20,
        changePercent: 1.01,
        lastUpdate: new Date().toISOString()
      },
      {
        name: 'IFIX',
        code: 'IFIX',
        value: 3215.67,
        change: -15.30,
        changePercent: -0.47,
        lastUpdate: new Date().toISOString()
      },
      {
        name: 'SMLL',
        code: 'SMLL',
        value: 4580.92,
        change: 89.45,
        changePercent: 1.99,
        lastUpdate: new Date().toISOString()
      }
    ];
  }

  /**
   * Busca dados para gráficos
   */
  async getChartData(symbol: string, period: string = '1D'): Promise<ChartData> {
    await this.delay(300);

    // Gera dados mock para demonstração
    const data = this.generateMockChartData(symbol, period);

    return {
      symbol,
      period,
      data
    };
  }

  /**
   * Busca taxa CDI atual
   */
  async getCurrentCDIRate(): Promise<CDIRate> {
    await this.delay(100);

    return {
      date: new Date().toISOString().split('T')[0],
      rate: 13.75 // Taxa atual simulada
    };
  }

  /**
   * Busca taxa Selic atual
   */
  async getCurrentSelicRate(): Promise<SelicRate> {
    await this.delay(100);

    return {
      date: new Date().toISOString().split('T')[0],
      rate: 13.25 // Taxa atual simulada
    };
  }

  /**
   * Busca histórico de taxas CDI
   */
  async getCDIHistory(days: number = 30): Promise<CDIRate[]> {
    await this.delay(200);

    const history: CDIRate[] = [];
    const currentRate = 13.75;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simula pequenas variações na taxa
      const variation = (Math.random() - 0.5) * 0.2;
      const rate = Math.max(0, currentRate + variation);

      history.push({
        date: date.toISOString().split('T')[0],
        rate: Math.round(rate * 100) / 100
      });
    }

    return history;
  }

  /**
   * Gera dados mock para gráficos
   */
  private generateMockChartData(symbol: string, period: string): ChartDataPoint[] {
    const data: ChartDataPoint[] = [];
    let basePrice = 100;
    
    // Define base price baseado no símbolo
    switch (symbol.toUpperCase()) {
      case 'USDBRL':
        basePrice = 5.85;
        break;
      case 'IBOV':
        basePrice = 125430;
        break;
      case 'BTCBRL':
        basePrice = 485000;
        break;
    }

    const points = this.getDataPoints(period);
    
    for (let i = 0; i < points; i++) {
      const timestamp = this.getTimestamp(i, period);
      const variation = (Math.random() - 0.5) * 0.05; // Variação de ±5%
      const value = basePrice * (1 + variation * i * 0.1);
      
      data.push({
        timestamp,
        value: Math.round(value * 100) / 100,
        volume: Math.floor(Math.random() * 1000000)
      });
    }

    return data;
  }

  /**
   * Define número de pontos baseado no período
   */
  private getDataPoints(period: string): number {
    switch (period) {
      case '1D': return 24;   // 24 horas
      case '1W': return 7;    // 7 dias
      case '1M': return 30;   // 30 dias
      case '1Y': return 12;   // 12 meses
      default: return 24;
    }
  }

  /**
   * Gera timestamp baseado no índice e período
   */
  private getTimestamp(index: number, period: string): string {
    const now = new Date();
    
    switch (period) {
      case '1D':
        now.setHours(now.getHours() - (24 - index));
        break;
      case '1W':
        now.setDate(now.getDate() - (7 - index));
        break;
      case '1M':
        now.setDate(now.getDate() - (30 - index));
        break;
      case '1Y':
        now.setMonth(now.getMonth() - (12 - index));
        break;
    }
    
    return now.toISOString();
  }

  /**
   * Simula delay de API
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
