import { Request, Response } from 'express';
import { User } from '../models/User';

export class ProfessorController {
  private userModel: User;

  constructor() {
    this.userModel = new User();
  }

  // Listar todos os professores
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const professores = await this.userModel.findByType('professor', page, limit);
      const total = await this.userModel.countByType('professor');

      return res.status(200).json({
        success: true,
        data: professores.map(p => ({
          id: p.id,
          nome: p.nome,
          email: p.email,
          data_criacao: p.data_criacao
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao listar professores:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar professores'
      });
    }
  }

  // Buscar professor por ID
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      const professor = await this.userModel.findById(id);

      if (!professor || professor.tipo !== 'professor') {
        return res.status(404).json({
          success: false,
          message: 'Professor não encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: professor.id,
          nome: professor.nome,
          email: professor.email,
          data_criacao: professor.data_criacao
        }
      });
    } catch (error) {
      console.error('Erro ao buscar professor:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar professor'
      });
    }
  }

  // Criar novo professor
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

      // Criar professor
      const professor = await this.userModel.create(nome, email, senha, 'professor');

      return res.status(201).json({
        success: true,
        message: 'Professor criado com sucesso',
        data: {
          id: professor.id,
          nome: professor.nome,
          email: professor.email,
          data_criacao: professor.data_criacao
        }
      });
    } catch (error) {
      console.error('Erro ao criar professor:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar professor'
      });
    }
  }

  // Atualizar professor
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const { nome, email } = req.body;

      // Verificar se professor existe
      const professorExistente = await this.userModel.findById(id);
      if (!professorExistente || professorExistente.tipo !== 'professor') {
        return res.status(404).json({
          success: false,
          message: 'Professor não encontrado'
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
      const professor = await this.userModel.update(id, nome, email);

      return res.status(200).json({
        success: true,
        message: 'Professor atualizado com sucesso',
        data: {
          id: professor!.id,
          nome: professor!.nome,
          email: professor!.email,
          data_criacao: professor!.data_criacao
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar professor:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar professor'
      });
    }
  }

  // Deletar professor
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      // Verificar se professor existe
      const professor = await this.userModel.findById(id);
      if (!professor || professor.tipo !== 'professor') {
        return res.status(404).json({
          success: false,
          message: 'Professor não encontrado'
        });
      }

      // Deletar
      await this.userModel.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Professor deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar professor:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao deletar professor'
      });
    }
  }
}
