import { Injectable } from '@nestjs/common';

// Definir tipos localmente
interface CDBBasicInput {
  initialAmount: number;
  rate: number; // Taxa CDI (ex: 13.75 para 13.75%)
  period: number; // Período em dias
  cdbRate: number; // Percentual do CDI (ex: 110 para 110% do CDI)
}

interface CDBBasicResult {
  initialAmount: number;
  finalAmount: number;
  grossReturn: number;
  tax: number; // Imposto de Renda
  netReturn: number;
  netYield: number; // Rendimento líquido percentual
  taxRate: number; // Alíquota aplicada
  period: number;
}

// Simulação CDB com IPO
interface CDBWithIPOInput extends CDBBasicInput {
  ipoShares: number; // Quantidade de ações do IPO
  ipoPrice: number; // Preço inicial da ação
  ipoGrowthRate: number; // Taxa de crescimento esperada (% ao ano)
}

interface CDBWithIPOResult extends CDBBasicResult {
  ipoInitialValue: number;
  ipoFinalValue: number;
  ipoReturn: number;
  totalPortfolioValue: number;
  totalReturn: number;
}

// Simulação CDB com IPO + Inflação
interface CDBWithIPOInflationInput extends CDBWithIPOInput {
  inflationRate: number; // Taxa de inflação anual (%)
}

interface CDBWithIPOInflationResult extends CDBWithIPOResult {
  inflationRate: number;
  realReturn: number; // Retorno descontada a inflação
  realYield: number; // Rendimento real percentual
  purchasingPowerLoss: number; // Perda do poder de compra
}

enum SimulationType {
  CDB_BASIC = 'cdb_basic',
  CDB_WITH_IPO = 'cdb_with_ipo',
  CDB_WITH_IPO_INFLATION = 'cdb_with_ipo_inflation'
}

@Injectable()
export class SimulationService {

  /**
   * Calcula simulação de CDB básico
   */
  calculateCDBBasic(input: CDBBasicInput): CDBBasicResult {
    const { initialAmount, rate, period, cdbRate } = input;
    
    // Taxa efetiva: (CDI * percentual do CDB) / 100
    const effectiveRate = (rate * cdbRate / 100) / 100;
    
    // Cálculo do montante final com juros compostos diários
    const dailyRate = effectiveRate / 365;
    const finalAmount = initialAmount * Math.pow(1 + dailyRate, period);
    
    const grossReturn = finalAmount - initialAmount;
    const taxRate = this.getTaxRate(period);
    const tax = grossReturn * taxRate;
    const netReturn = grossReturn - tax;
    const netYield = (netReturn / initialAmount) * 100;

    return {
      initialAmount,
      finalAmount: finalAmount,
      grossReturn,
      tax,
      netReturn,
      netYield,
      taxRate,
      period
    };
  }

  /**
   * Calcula simulação de CDB com IPO
   */
  calculateCDBWithIPO(input: CDBWithIPOInput): CDBWithIPOResult {
    // Primeiro calcula o CDB
    const cdbResult = this.calculateCDBBasic(input);
    
    const { ipoShares, ipoPrice, ipoGrowthRate, period } = input;
    
    // Calcula o valor inicial do IPO
    const ipoInitialValue = ipoShares * ipoPrice;
    
    // Calcula crescimento do IPO (assumindo crescimento anual composto)
    const years = period / 365;
    const ipoFinalValue = ipoInitialValue * Math.pow(1 + ipoGrowthRate / 100, years);
    const ipoReturn = ipoFinalValue - ipoInitialValue;
    
    // Portfolio total
    const totalPortfolioValue = cdbResult.finalAmount + ipoFinalValue;
    const totalInitialValue = cdbResult.initialAmount + ipoInitialValue;
    const totalReturn = totalPortfolioValue - totalInitialValue;

    return {
      ...cdbResult,
      ipoInitialValue,
      ipoFinalValue,
      ipoReturn,
      totalPortfolioValue,
      totalReturn
    };
  }

  /**
   * Calcula simulação de CDB com IPO considerando inflação
   */
  calculateCDBWithIPOInflation(input: CDBWithIPOInflationInput): CDBWithIPOInflationResult {
    // Primeiro calcula CDB + IPO
    const portfolioResult = this.calculateCDBWithIPO(input);
    
    const { inflationRate, period } = input;
    
    // Calcula o impacto da inflação
    const years = period / 365;
    const inflationFactor = Math.pow(1 + inflationRate / 100, years);
    const adjustedInitialValue = (portfolioResult.initialAmount + portfolioResult.ipoInitialValue) * inflationFactor;
    
    // Retorno real (descontada a inflação)
    const realReturn = portfolioResult.totalPortfolioValue - adjustedInitialValue;
    const realYield = (realReturn / (portfolioResult.initialAmount + portfolioResult.ipoInitialValue)) * 100;
    
    // Perda do poder de compra
    const purchasingPowerLoss = adjustedInitialValue - (portfolioResult.initialAmount + portfolioResult.ipoInitialValue);

    return {
      ...portfolioResult,
      inflationRate,
      realReturn,
      realYield,
      purchasingPowerLoss
    };
  }

  /**
   * Calcula a alíquota de IR baseada no período de investimento
   */
  private getTaxRate(period: number): number {
    if (period <= 180) return 0.225;      // 22,5%
    if (period <= 360) return 0.20;       // 20%
    if (period <= 720) return 0.175;      // 17,5%
    return 0.15;                          // 15%
  }

  /**
   * Converte período em anos para dias
   */
  yearsToDays(years: number): number {
    return Math.round(years * 365);
  }

  /**
   * Converte período em meses para dias
   */
  monthsToDays(months: number): number {
    return Math.round(months * 30);
  }

  /**
   * Formata valor monetário para exibição
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Formata percentual para exibição
   */
  formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Valida dados de entrada para simulação básica
   */
  validateCDBBasicInput(input: CDBBasicInput): string[] {
    const errors: string[] = [];

    if (!input.initialAmount || input.initialAmount <= 0) {
      errors.push('Valor inicial deve ser maior que zero');
    }

    if (!input.rate || input.rate <= 0) {
      errors.push('Taxa CDI deve ser maior que zero');
    }

    if (!input.period || input.period <= 0) {
      errors.push('Período deve ser maior que zero');
    }

    if (!input.cdbRate || input.cdbRate <= 0) {
      errors.push('Percentual do CDI deve ser maior que zero');
    }

    if (input.initialAmount > 10000000) {
      errors.push('Valor inicial não pode ser superior a R$ 10.000.000');
    }

    return errors;
  }
}
