// Interfaces para simulações de investimento

// Simulação CDB Básico
export interface CDBBasicInput {
  initialAmount: number;
  rate: number; // Taxa CDI (ex: 13.75 para 13.75%)
  period: number; // Período em dias
  cdbRate: number; // Percentual do CDI (ex: 110 para 110% do CDI)
}

export interface CDBBasicResult {
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
export interface CDBWithIPOInput extends CDBBasicInput {
  ipoShares: number; // Quantidade de ações do IPO
  ipoPrice: number; // Preço inicial da ação
  ipoGrowthRate: number; // Taxa de crescimento esperada (% ao ano)
}

export interface CDBWithIPOResult extends CDBBasicResult {
  ipoInitialValue: number;
  ipoFinalValue: number;
  ipoReturn: number;
  totalPortfolioValue: number;
  totalReturn: number;
}

// Simulação CDB com IPO + Inflação
export interface CDBWithIPOInflationInput extends CDBWithIPOInput {
  inflationRate: number; // Taxa de inflação anual (%)
}

export interface CDBWithIPOInflationResult extends CDBWithIPOResult {
  inflationRate: number;
  realReturn: number; // Retorno descontada a inflação
  realYield: number; // Rendimento real percentual
  purchasingPowerLoss: number; // Perda do poder de compra
}

// Union types para facilitar o uso
export type SimulationInput = CDBBasicInput | CDBWithIPOInput | CDBWithIPOInflationInput;
export type SimulationResult = CDBBasicResult | CDBWithIPOResult | CDBWithIPOInflationResult;

export enum SimulationType {
  CDB_BASIC = 'cdb_basic',
  CDB_WITH_IPO = 'cdb_with_ipo',
  CDB_WITH_IPO_INFLATION = 'cdb_with_ipo_inflation'
}
