import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
  tipo: 'professor' | 'aluno';
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
  try {
    // Obter token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    // Verificar formato do token (Bearer token)
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido'
      });
    }

    const token = parts[1];

    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;

    // Adicionar informações do usuário na requisição
    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      tipo: decoded.tipo
    };

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erro ao validar token'
    });
  }
};

// Middleware para verificar se o usuário é professor
export const isProfessor = (req: Request, res: Response, next: NextFunction): Response | void => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  if (user.tipo !== 'professor') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas professores podem acessar este recurso.'
    });
  }

  return next();
};
