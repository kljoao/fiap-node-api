import { Request, Response } from 'express';
import { PostModel } from '../models/Post';
import { ApiResponse, PaginatedResponse, CreatePostRequest, UpdatePostRequest, SearchParams } from '../types';

export class PostController {
  private postModel: PostModel;

  constructor() {
    this.postModel = new PostModel();
  }

  // GET /posts - Listar todos os posts
  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;

      const posts = await this.postModel.findAll(page, limit);
      const total = await this.postModel.count();
      const totalPages = Math.ceil(total / limit);

      const response: PaginatedResponse<any> = {
        success: true,
        data: posts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Erro interno do servidor',
      };
      res.status(500).json(response);
    }
  }

  // GET /posts/:id - Buscar post por ID
  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '0');
      
      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'ID inválido',
        };
        res.status(400).json(response);
        return;
      }

      const post = await this.postModel.findById(id);
      
      if (!post) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Post não encontrado',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        data: post,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao buscar post:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Erro interno do servidor',
      };
      res.status(500).json(response);
    }
  }

  // POST /posts - Criar novo post
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const postData: CreatePostRequest = req.body;

      // Validação básica
      if (!postData.titulo || !postData.conteudo || !postData.autor) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Título, conteúdo e autor são obrigatórios',
        };
        res.status(400).json(response);
        return;
      }

      const newPost = await this.postModel.create(postData);
      
      const response: ApiResponse<any> = {
        success: true,
        data: newPost,
        message: 'Post criado com sucesso',
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Erro ao criar post:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Erro interno do servidor',
      };
      res.status(500).json(response);
    }
  }

  // PUT /posts/:id - Atualizar post
  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '0');
      
      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'ID inválido',
        };
        res.status(400).json(response);
        return;
      }

      const postData: UpdatePostRequest = req.body;
      const updatedPost = await this.postModel.update(id, postData);
      
      if (!updatedPost) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Post não encontrado',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        data: updatedPost,
        message: 'Post atualizado com sucesso',
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Erro interno do servidor',
      };
      res.status(500).json(response);
    }
  }

  // DELETE /posts/:id - Deletar post
  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '0');
      
      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'ID inválido',
        };
        res.status(400).json(response);
        return;
      }

      const deleted = await this.postModel.delete(id);
      
      if (!deleted) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Post não encontrado',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Post deletado com sucesso',
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Erro interno do servidor',
      };
      res.status(500).json(response);
    }
  }

  // GET /posts/search - Buscar posts por palavra-chave
  async searchPosts(req: Request, res: Response): Promise<void> {
    try {
      const { q, page, limit } = req.query;
      
      if (!q || typeof q !== 'string') {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Parâmetro de busca (q) é obrigatório',
        };
        res.status(400).json(response);
        return;
      }

      const searchParams: SearchParams = {
        q,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const posts = await this.postModel.search(searchParams);
      const total = await this.postModel.countSearch(q);
      const totalPages = Math.ceil(total / searchParams.limit!);

      const response: PaginatedResponse<any> = {
        success: true,
        data: posts,
        pagination: {
          page: searchParams.page!,
          limit: searchParams.limit!,
          total,
          totalPages,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Erro interno do servidor',
      };
      res.status(500).json(response);
    }
  }
} 