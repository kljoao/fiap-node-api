import { PostModel } from '../models/Post';
import { Database } from '../config/database';
import { CreatePostRequest, UpdatePostRequest } from '../types';

// Mock do Database
jest.mock('../config/database');

describe('PostModel', () => {
  let postModel: PostModel;
  let mockDatabase: jest.Mocked<Database>;

  beforeEach(() => {
    // Limpar todos os mocks
    jest.clearAllMocks();
    
    // Criar mock do Database
    mockDatabase = {
      query: jest.fn(),
      getPool: jest.fn(),
      close: jest.fn(),
      testConnection: jest.fn(),
    } as any;

    // Mock do getInstance
    (Database.getInstance as jest.Mock).mockReturnValue(mockDatabase);
    
    postModel = new PostModel();
  });

  describe('findAll', () => {
    it('deve retornar lista de posts com paginação', async () => {
      const mockPosts = [
        {
          id: 1,
          titulo: 'Teste 1',
          conteudo: 'Conteúdo 1',
          autor: 'Autor 1',
          data_criacao: new Date(),
          data_atualizacao: new Date(),
        },
        {
          id: 2,
          titulo: 'Teste 2',
          conteudo: 'Conteúdo 2',
          autor: 'Autor 2',
          data_criacao: new Date(),
          data_atualizacao: new Date(),
        },
      ];

      mockDatabase.query.mockResolvedValue({ rows: mockPosts });

      const result = await postModel.findAll(1, 10);

      expect(result).toEqual(mockPosts);
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [10, 0]
      );
    });
  });

  describe('findById', () => {
    it('deve retornar post quando encontrado', async () => {
      const mockPost = {
        id: 1,
        titulo: 'Teste',
        conteudo: 'Conteúdo',
        autor: 'Autor',
        data_criacao: new Date(),
        data_atualizacao: new Date(),
      };

      mockDatabase.query.mockResolvedValue({ rows: [mockPost] });

      const result = await postModel.findById(1);

      expect(result).toEqual(mockPost);
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1]
      );
    });

    it('deve retornar null quando post não encontrado', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [] });

      const result = await postModel.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar novo post', async () => {
      const postData: CreatePostRequest = {
        titulo: 'Novo Post',
        conteudo: 'Conteúdo do post',
        autor: 'Autor',
      };

      const mockCreatedPost = {
        id: 1,
        ...postData,
        data_criacao: new Date(),
        data_atualizacao: new Date(),
      };

      mockDatabase.query.mockResolvedValue({ rows: [mockCreatedPost] });

      const result = await postModel.create(postData);

      expect(result).toEqual(mockCreatedPost);
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT'),
        [postData.titulo, postData.conteudo, postData.autor]
      );
    });
  });

  describe('update', () => {
    it('deve atualizar post existente', async () => {
      const updateData: UpdatePostRequest = {
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

      mockDatabase.query.mockResolvedValue({ rows: [mockUpdatedPost] });

      const result = await postModel.update(1, updateData);

      expect(result).toEqual(mockUpdatedPost);
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        expect.arrayContaining([updateData.titulo, updateData.conteudo, 1])
      );
    });

    it('deve retornar null quando post não existe', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [] });

      const result = await postModel.update(999, { titulo: 'Teste' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('deve deletar post existente', async () => {
      mockDatabase.query.mockResolvedValue({ rowCount: 1 });

      const result = await postModel.delete(1);

      expect(result).toBe(true);
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE'),
        [1]
      );
    });

    it('deve retornar false quando post não existe', async () => {
      mockDatabase.query.mockResolvedValue({ rowCount: 0 });

      const result = await postModel.delete(999);

      expect(result).toBe(false);
    });
  });

  describe('search', () => {
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

      mockDatabase.query.mockResolvedValue({ rows: mockPosts });

      const result = await postModel.search({ q: 'palavra', page: 1, limit: 10 });

      expect(result).toEqual(mockPosts);
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        ['%palavra%', 10, 0]
      );
    });
  });

  describe('count', () => {
    it('deve retornar total de posts', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [{ total: '5' }] });

      const result = await postModel.count();

      expect(result).toBe(5);
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('COUNT')
      );
    });
  });

  describe('countSearch', () => {
    it('deve retornar total de posts na busca', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [{ total: '3' }] });

      const result = await postModel.countSearch('palavra');

      expect(result).toBe(3);
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('COUNT'),
        ['%palavra%']
      );
    });
  });
}); 