import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

export class ErrorHandler {
  static handle(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    console.error('Erro capturado:', err);

    if (err instanceof Error && 'statusCode' in err) {
      const appError = err as AppError;
      res.status(appError.statusCode).json({
        success: false,
        error: appError.message,
      });
      return;
    }

    // Erro padrão
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
    });
  }

  static notFound(_req: Request, res: Response, _next: NextFunction): void {
    res.status(404).json({
      success: false,
      error: 'Endpoint não encontrado',
    });
  }
} 