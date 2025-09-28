// Interfaces para dados de mercado (cotações, índices)

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number; // Variação absoluta
  changePercent: number; // Variação percentual
  lastUpdate: string;
  currency: string;
}

export interface CurrencyQuote extends MarketQuote {
  bidPrice: number; // Preço de compra
  askPrice: number; // Preço de venda
}

export interface StockIndex {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
}

// Dados para gráficos
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  volume?: number;
}

export interface ChartData {
  symbol: string;
  period: string; // '1D', '1W', '1M', '1Y'
  data: ChartDataPoint[];
}

// CDI e Taxa Selic para simulações
export interface CDIRate {
  date: string;
  rate: number; // Taxa CDI do dia
}

export interface SelicRate {
  date: string;
  rate: number; // Taxa Selic
}
