// Configuração global para testes
import dotenv from 'dotenv';

// Carregar variáveis de ambiente para testes
dotenv.config({ path: '.env.test' });

// Configurar timeout global para testes
jest.setTimeout(10000);

// Mock do console para evitar logs durante testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Configurações globais
process.env['NODE_ENV'] = 'test';
process.env['DB_NAME'] = 'posts_api_test';
process.env['PORT'] = '3001'; 