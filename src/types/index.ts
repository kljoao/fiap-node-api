// Tipos para Posts
export interface Post {
  id: number;
  titulo: string;
  conteudo: string;
  autor: string;
  data_criacao: Date;
  data_atualizacao: Date;
}

export interface CreatePostRequest {
  titulo: string;
  conteudo: string;
  autor: string;
}

export interface UpdatePostRequest {
  titulo?: string;
  conteudo?: string;
  autor?: string;
}

// Tipos para Respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para Busca
export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
}

// Tipos para Banco de Dados
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Tipos para Configurações
export interface AppConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  bcryptRounds: number;
  logLevel: string;
}

// Tipos para Erros
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Tipos para Validação
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
} 