import { Request, Response } from 'express';
import { PostController } from '../controllers/PostController';
import { PostModel } from '../models/Post';

// Mock do PostModel
jest.mock('../models/Post');

describe('PostController', () => {
  let postController: PostController;
  let mockPostModel: jest.Mocked<PostModel>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    // Limpar todos os mocks
    jest.clearAllMocks();
    
    // Criar mock do PostModel
    mockPostModel = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn(),
      count: jest.fn(),
      countSearch: jest.fn(),
    } as any;

    // Mock do construtor do PostModel
    (PostModel as jest.Mock).mockImplementation(() => mockPostModel);
    
    postController = new PostController();

    // Mock das funções de resposta
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
  });

  describe('getAllPosts', () => {
    it('deve retornar lista de posts com paginação', async () => {
      const mockPosts = [
        {
          id: 1,
          titulo: 'Post 1',
          conteudo: 'Conteúdo 1',
          autor: 'Autor 1',
          data_criacao: new Date(),
          data_atualizacao: new Date(),
        },
      ];

      mockRequest = {
        query: { page: '1', limit: '10' },
      };

      mockPostModel.findAll.mockResolvedValue(mockPosts);
      mockPostModel.count.mockResolvedValue(1);

      await postController.getAllPosts(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPostModel.findAll).toHaveBeenCalledWith(1, 10);
      expect(mockPostModel.count).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockPosts,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('deve tratar erro interno', async () => {
      mockRequest = {
        query: {},
      };

      mockPostModel.findAll.mockRejectedValue(new Error('Erro de banco'));

      await postController.getAllPosts(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Erro interno do servidor',
      });
    });
  });

  describe('getPostById', () => {
    it('deve retornar post quando encontrado', async () => {
      const mockPost = {
        id: 1,
        titulo: 'Post',
        conteudo: 'Conteúdo',
        autor: 'Autor',
        data_criacao: new Date(),
        data_atualizacao: new Date(),
      };

      mockRequest = {
        params: { id: '1' },
      };

      mockPostModel.findById.mockResolvedValue(mockPost);

      await postController.getPostById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPostModel.findById).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockPost,
      });
    });

    it('deve retornar erro quando ID é inválido', async () => {
      mockRequest = {
        params: { id: 'abc' },
      };

      await postController.getPostById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'ID inválido',
      });
    });

    it('deve retornar erro quando post não encontrado', async () => {
      mockRequest = {
        params: { id: '999' },
      };

      mockPostModel.findById.mockResolvedValue(null);

      await postController.getPostById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Post não encontrado',
      });
    });
  });

  describe('createPost', () => {
    it('deve criar novo post com sucesso', async () => {
      const postData = {
        titulo: 'Novo Post',
        conteudo: 'Conteúdo',
        autor: 'Autor',
      };

      const mockCreatedPost = {
        id: 1,
        ...postData,
        data_criacao: new Date(),
        data_atualizacao: new Date(),
      };

      mockRequest = {
        body: postData,
      };

      mockPostModel.create.mockResolvedValue(mockCreatedPost);

      await postController.createPost(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPostModel.create).toHaveBeenCalledWith(postData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedPost,
        message: 'Post criado com sucesso',
      });
    });

    it('deve retornar erro quando dados obrigatórios estão faltando', async () => {
      mockRequest = {
        body: { titulo: 'Título' }, // Faltando conteúdo e autor
      };

      await postController.createPost(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Título, conteúdo e autor são obrigatórios',
      });
    });
  });

  describe('updatePost', () => {
    it('deve atualizar post com sucesso', async () => {
      const updateData = {
        titulo: 'Título Atualizado',
        conteudo: 'Conteúdo Atualizado',
      };

      const mockUpdatedPost = {
        id: 1,
        ...updateData,
        autor: 'Autor Original',
        data_criacao: new Date(),
        data_atualizacao: new Date(),
      };

      mockRequest = {
        params: { id: '1' },
        body: updateData,
      };

      mockPostModel.update.mockResolvedValue(mockUpdatedPost);

      await postController.updatePost(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPostModel.update).toHaveBeenCalledWith(1, updateData);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedPost,
        message: 'Post atualizado com sucesso',
      });
    });

    it('deve retornar erro quando post não encontrado', async () => {
      mockRequest = {
        params: { id: '999' },
        body: { titulo: 'Teste' },
      };

      mockPostModel.update.mockResolvedValue(null);

      await postController.updatePost(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Post não encontrado',
      });
    });
  });

  describe('deletePost', () => {
    it('deve deletar post com sucesso', async () => {
      mockRequest = {
        params: { id: '1' },
      };

      mockPostModel.delete.mockResolvedValue(true);

      await postController.deletePost(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPostModel.delete).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Post deletado com sucesso',
      });
    });

    it('deve retornar erro quando post não encontrado', async () => {
      mockRequest = {
        params: { id: '999' },
      };

      mockPostModel.delete.mockResolvedValue(false);

      await postController.deletePost(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Post não encontrado',
      });
    });
  });

  describe('searchPosts', () => {
    it('deve buscar posts por palavra-chave', async () => {
      const mockPosts = [
        {
          id: 1,
          titulo: 'Post com palavra',
          conteudo: 'Conteúdo',
          autor: 'Autor',
          data_criacao: new Date(),
          data_atualizacao: new Date(),
        },
      ];

      mockRequest = {
        query: { q: 'palavra', page: '1', limit: '10' },
      };

      mockPostModel.search.mockResolvedValue(mockPosts);
      mockPostModel.countSearch.mockResolvedValue(1);

      await postController.searchPosts(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPostModel.search).toHaveBeenCalledWith({
        q: 'palavra',
        page: 1,
        limit: 10,
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockPosts,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('deve retornar erro quando parâmetro de busca está faltando', async () => {
      mockRequest = {
        query: {},
      };

      await postController.searchPosts(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Parâmetro de busca (q) é obrigatório',
      });
    });
  });
}); 