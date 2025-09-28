import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SimulationService } from './simulation.service';

// Definir tipos localmente para usar no controller
interface CDBBasicInput {
  initialAmount: number;
  rate: number;
  period: number;
  cdbRate: number;
}

interface CDBBasicResult {
  initialAmount: number;
  finalAmount: number;
  grossReturn: number;
  tax: number;
  netReturn: number;
  netYield: number;
  taxRate: number;
  period: number;
}

interface CDBWithIPOInput extends CDBBasicInput {
  ipoShares: number;
  ipoPrice: number;
  ipoGrowthRate: number;
}

interface CDBWithIPOResult extends CDBBasicResult {
  ipoInitialValue: number;
  ipoFinalValue: number;
  ipoReturn: number;
  totalPortfolioValue: number;
  totalReturn: number;
}

interface CDBWithIPOInflationInput extends CDBWithIPOInput {
  inflationRate: number;
}

interface CDBWithIPOInflationResult extends CDBWithIPOResult {
  inflationRate: number;
  realReturn: number;
  realYield: number;
  purchasingPowerLoss: number;
}

enum SimulationType {
  CDB_BASIC = 'cdb_basic',
  CDB_WITH_IPO = 'cdb_with_ipo',
  CDB_WITH_IPO_INFLATION = 'cdb_with_ipo_inflation'
}

@ApiTags('simulation')
@Controller('api/simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post('cdb-basic')
  @ApiOperation({ summary: 'Simular investimento em CDB básico' })
  @ApiResponse({ 
    status: 200, 
    description: 'Simulação calculada com sucesso'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados de entrada inválidos' 
  })
  calculateCDBBasic(@Body() input: CDBBasicInput): CDBBasicResult {
    // Validar entrada
    const errors = this.simulationService.validateCDBBasicInput(input);
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Dados de entrada inválidos',
        errors
      });
    }

    return this.simulationService.calculateCDBBasic(input);
  }

  @Post('cdb-ipo')
  @ApiOperation({ summary: 'Simular investimento em CDB + IPO' })
  @ApiResponse({ 
    status: 200, 
    description: 'Simulação calculada com sucesso'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados de entrada inválidos' 
  })
  calculateCDBWithIPO(@Body() input: CDBWithIPOInput): CDBWithIPOResult {
    // Validações básicas do CDB
    const errors = this.simulationService.validateCDBBasicInput(input);
    
    // Validações específicas do IPO
    if (!input.ipoShares || input.ipoShares <= 0) {
      errors.push('Quantidade de ações deve ser maior que zero');
    }

    if (!input.ipoPrice || input.ipoPrice <= 0) {
      errors.push('Preço da ação deve ser maior que zero');
    }

    if (input.ipoGrowthRate === undefined || input.ipoGrowthRate < -100) {
      errors.push('Taxa de crescimento do IPO deve ser maior que -100%');
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Dados de entrada inválidos',
        errors
      });
    }

    return this.simulationService.calculateCDBWithIPO(input);
  }

  @Post('cdb-ipo-inflation')
  @ApiOperation({ summary: 'Simular investimento em CDB + IPO considerando inflação' })
  @ApiResponse({ 
    status: 200, 
    description: 'Simulação calculada com sucesso'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados de entrada inválidos' 
  })
  calculateCDBWithIPOInflation(@Body() input: CDBWithIPOInflationInput): CDBWithIPOInflationResult {
    // Validações do CDB + IPO
    const errors = this.simulationService.validateCDBBasicInput(input);
    
    if (!input.ipoShares || input.ipoShares <= 0) {
      errors.push('Quantidade de ações deve ser maior que zero');
    }

    if (!input.ipoPrice || input.ipoPrice <= 0) {
      errors.push('Preço da ação deve ser maior que zero');
    }

    if (input.ipoGrowthRate === undefined || input.ipoGrowthRate < -100) {
      errors.push('Taxa de crescimento do IPO deve ser maior que -100%');
    }

    // Validações específicas da inflação
    if (input.inflationRate === undefined) {
      errors.push('Taxa de inflação é obrigatória');
    }

    if (input.inflationRate < -50 || input.inflationRate > 50) {
      errors.push('Taxa de inflação deve estar entre -50% e 50%');
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Dados de entrada inválidos',
        errors
      });
    }

    return this.simulationService.calculateCDBWithIPOInflation(input);
  }

  @Post('helpers/years-to-days')
  @ApiOperation({ summary: 'Converter anos para dias' })
  @ApiResponse({ status: 200, description: 'Conversão realizada' })
  convertYearsToDays(@Body('years') years: number): { days: number } {
    if (!years || years <= 0) {
      throw new BadRequestException('Número de anos deve ser maior que zero');
    }

    return {
      days: this.simulationService.yearsToDays(years)
    };
  }

  @Post('helpers/months-to-days')
  @ApiOperation({ summary: 'Converter meses para dias' })
  @ApiResponse({ status: 200, description: 'Conversão realizada' })
  convertMonthsToDays(@Body('months') months: number): { days: number } {
    if (!months || months <= 0) {
      throw new BadRequestException('Número de meses deve ser maior que zero');
    }

    return {
      days: this.simulationService.monthsToDays(months)
    };
  }
}
