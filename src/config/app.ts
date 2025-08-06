import { AppConfig } from '../types';

export class AppConfigManager {
  private static instance: AppConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = {
      port: parseInt(process.env['PORT'] || '3000'),
      nodeEnv: process.env['NODE_ENV'] || 'development',
      jwtSecret: process.env['JWT_SECRET'] || 'default_secret',
      bcryptRounds: parseInt(process.env['BCRYPT_ROUNDS'] || '12'),
      logLevel: process.env['LOG_LEVEL'] || 'info',
    };
  }

  public static getInstance(): AppConfigManager {
    if (!AppConfigManager.instance) {
      AppConfigManager.instance = new AppConfigManager();
    }
    return AppConfigManager.instance;
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  public isDevelopment(): boolean {
    return this.config.nodeEnv === 'development';
  }

  public isProduction(): boolean {
    return this.config.nodeEnv === 'production';
  }

  public isTest(): boolean {
    return this.config.nodeEnv === 'test';
  }
} 