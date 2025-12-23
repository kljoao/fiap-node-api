import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

export class AuthController {
  private userModel: User;

  constructor() {
    this.userModel = new User();
  }

  // Registro de novo usuário
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, email, senha, tipo } = req.body;

      // Validações básicas
      if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({
          success: false,
          message: 'Nome, email, senha e tipo são obrigatórios'
        });
      }

      // Validar tipo
      if (tipo !== 'professor' && tipo !== 'aluno') {
        return res.status(400).json({
          success: false,
          message: 'Tipo deve ser "professor" ou "aluno"'
        });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
      }

      // Validar senha mínima
      if (senha.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'A senha deve ter no mínimo 6 caracteres'
        });
      }

      // Verificar se email já existe
      const emailExists = await this.userModel.emailExists(email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email já cadastrado'
        });
      }

      // Criar usuário
      const user = await this.userModel.create(nome, email, senha, tipo);

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, tipo: user.tipo },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: {
          user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo,
            data_criacao: user.data_criacao
          },
          token
        }
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao registrar usuário'
      });
    }
  }

  // Login de usuário
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha } = req.body;

      // Validações básicas
      if (!email || !senha) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      // Buscar usuário
      const user = await this.userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos'
        });
      }

      // Verificar senha
      const isPasswordValid = await this.userModel.verifyPassword(senha, user.senha);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos'
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, tipo: user.tipo },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo
          },
          token
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao fazer login'
      });
    }
  }

  // Obter dados do usuário autenticado
  async me(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user.id;

      const user = await this.userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          data_criacao: user.data_criacao
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados do usuário'
      });
    }
  }
}
