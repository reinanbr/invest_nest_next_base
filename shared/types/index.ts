// Re-export de todos os tipos
export * from './article.types';
export * from './simulation.types';
export * from './market.types';

// Tipos de resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipos de erro
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
}
