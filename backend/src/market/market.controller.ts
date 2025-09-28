import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MarketService } from './market.service';

// Definir tipos localmente
interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
  currency: string;
}

interface CurrencyQuote extends MarketQuote {
  bidPrice: number;
  askPrice: number;
}

interface StockIndex {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
}

interface ChartDataPoint {
  timestamp: string;
  value: number;
  volume?: number;
}

interface ChartData {
  symbol: string;
  period: string;
  data: ChartDataPoint[];
}

interface CDIRate {
  date: string;
  rate: number;
}

interface SelicRate {
  date: string;
  rate: number;
}

@ApiTags('market')
@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('quotes')
  @ApiOperation({ summary: 'Buscar cotações principais do mercado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cotações recuperadas com sucesso'
  })
  async getMainQuotes(): Promise<MarketQuote[]> {
    return this.marketService.getMainQuotes();
  }

  @Get('currencies')
  @ApiOperation({ summary: 'Buscar cotações de moedas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cotações de moedas recuperadas com sucesso'
  })
  async getCurrencyQuotes(): Promise<CurrencyQuote[]> {
    return this.marketService.getCurrencyQuotes();
  }

  @Get('indices')
  @ApiOperation({ summary: 'Buscar índices do mercado de ações' })
  @ApiResponse({ 
    status: 200, 
    description: 'Índices recuperados com sucesso'
  })
  async getStockIndices(): Promise<StockIndex[]> {
    return this.marketService.getStockIndices();
  }

  @Get('chart/:symbol')
  @ApiOperation({ summary: 'Buscar dados para gráficos de um símbolo específico' })
  @ApiParam({ 
    name: 'symbol', 
    description: 'Símbolo do ativo (ex: USDBRL, IBOV, BTCBRL)' 
  })
  @ApiQuery({ 
    name: 'period', 
    required: false, 
    description: 'Período do gráfico (1D, 1W, 1M, 1Y)',
    enum: ['1D', '1W', '1M', '1Y']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Dados do gráfico recuperados com sucesso'
  })
  async getChartData(
    @Param('symbol') symbol: string,
    @Query('period') period?: string
  ): Promise<ChartData> {
    return this.marketService.getChartData(symbol, period || '1D');
  }

  @Get('rates/cdi')
  @ApiOperation({ summary: 'Buscar taxa CDI atual' })
  @ApiResponse({ 
    status: 200, 
    description: 'Taxa CDI recuperada com sucesso'
  })
  async getCurrentCDIRate(): Promise<CDIRate> {
    return this.marketService.getCurrentCDIRate();
  }

  @Get('rates/selic')
  @ApiOperation({ summary: 'Buscar taxa Selic atual' })
  @ApiResponse({ 
    status: 200, 
    description: 'Taxa Selic recuperada com sucesso'
  })
  async getCurrentSelicRate(): Promise<SelicRate> {
    return this.marketService.getCurrentSelicRate();
  }

  @Get('rates/cdi/history')
  @ApiOperation({ summary: 'Buscar histórico da taxa CDI' })
  @ApiQuery({ 
    name: 'days', 
    required: false, 
    description: 'Número de dias do histórico (padrão: 30)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Histórico CDI recuperado com sucesso'
  })
  async getCDIHistory(@Query('days') days?: number): Promise<CDIRate[]> {
    return this.marketService.getCDIHistory(days ? Number(days) : 30);
  }
}
