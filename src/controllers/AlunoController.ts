import { Request, Response } from 'express';
import { User } from '../models/User';

export class AlunoController {
  private userModel: User;

  constructor() {
    this.userModel = new User();
  }

  // Listar todos os alunos
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const alunos = await this.userModel.findByType('aluno', page, limit);
      const total = await this.userModel.countByType('aluno');

      return res.status(200).json({
        success: true,
        data: alunos.map(a => ({
          id: a.id,
          nome: a.nome,
          email: a.email,
          data_criacao: a.data_criacao
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao listar alunos:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar alunos'
      });
    }
  }

  // Buscar aluno por ID
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      const aluno = await this.userModel.findById(id);

      if (!aluno || aluno.tipo !== 'aluno') {
        return res.status(404).json({
          success: false,
          message: 'Aluno não encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: aluno.id,
          nome: aluno.nome,
          email: aluno.email,
          data_criacao: aluno.data_criacao
        }
      });
    } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar aluno'
      });
    }
  }

  // Criar novo aluno
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, email, senha } = req.body;

      // Validações
      if (!nome || !email || !senha) {
        return res.status(400).json({
          success: false,
          message: 'Nome, email e senha são obrigatórios'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
      }

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

      // Criar aluno
      const aluno = await this.userModel.create(nome, email, senha, 'aluno');

      return res.status(201).json({
        success: true,
        message: 'Aluno criado com sucesso',
        data: {
          id: aluno.id,
          nome: aluno.nome,
          email: aluno.email,
          data_criacao: aluno.data_criacao
        }
      });
    } catch (error) {
      console.error('Erro ao criar aluno:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar aluno'
      });
    }
  }

  // Atualizar aluno
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const { nome, email } = req.body;

      // Verificar se aluno existe
      const alunoExistente = await this.userModel.findById(id);
      if (!alunoExistente || alunoExistente.tipo !== 'aluno') {
        return res.status(404).json({
          success: false,
          message: 'Aluno não encontrado'
        });
      }

      // Validar email se fornecido
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            success: false,
            message: 'Email inválido'
          });
        }

        // Verificar se email já está em uso por outro usuário
        const emailEmUso = await this.userModel.findByEmail(email);
        if (emailEmUso && emailEmUso.id !== id) {
          return res.status(409).json({
            success: false,
            message: 'Email já está em uso'
          });
        }
      }

      // Atualizar
      const aluno = await this.userModel.update(id, nome, email);

      return res.status(200).json({
        success: true,
        message: 'Aluno atualizado com sucesso',
        data: {
          id: aluno!.id,
          nome: aluno!.nome,
          email: aluno!.email,
          data_criacao: aluno!.data_criacao
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar aluno'
      });
    }
  }

  // Deletar aluno
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      // Verificar se aluno existe
      const aluno = await this.userModel.findById(id);
      if (!aluno || aluno.tipo !== 'aluno') {
        return res.status(404).json({
          success: false,
          message: 'Aluno não encontrado'
        });
      }

      // Deletar
      await this.userModel.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Aluno deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao deletar aluno'
      });
    }
  }
}
