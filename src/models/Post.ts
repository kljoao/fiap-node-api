import { Database } from '../config/database';
import { Post, CreatePostRequest, UpdatePostRequest, SearchParams } from '../types';

export class PostModel {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  // Buscar todos os posts com paginação
  async findAll(page: number = 1, limit: number = 10): Promise<Post[]> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, titulo, conteudo, autor, data_criacao, data_atualizacao
      FROM posts
      ORDER BY data_criacao DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await this.db.query(query, [limit, offset]);
    return result.rows;
  }

  // Buscar post por ID
  async findById(id: number): Promise<Post | null> {
    const query = `
      SELECT id, titulo, conteudo, autor, data_criacao, data_atualizacao
      FROM posts
      WHERE id = $1
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  // Criar novo post
  async create(postData: CreatePostRequest): Promise<Post> {
    const query = `
      INSERT INTO posts (titulo, conteudo, autor, data_criacao, data_atualizacao)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, titulo, conteudo, autor, data_criacao, data_atualizacao
    `;
    
    const result = await this.db.query(query, [
      postData.titulo,
      postData.conteudo,
      postData.autor
    ]);
    
    return result.rows[0];
  }

  // Atualizar post
  async update(id: number, postData: UpdatePostRequest): Promise<Post | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (postData.titulo !== undefined) {
      fields.push(`titulo = $${paramIndex}`);
      values.push(postData.titulo);
      paramIndex++;
    }

    if (postData.conteudo !== undefined) {
      fields.push(`conteudo = $${paramIndex}`);
      values.push(postData.conteudo);
      paramIndex++;
    }

    if (postData.autor !== undefined) {
      fields.push(`autor = $${paramIndex}`);
      values.push(postData.autor);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`data_atualizacao = NOW()`);
    values.push(id);

    const query = `
      UPDATE posts
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, titulo, conteudo, autor, data_criacao, data_atualizacao
    `;
    
    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // Deletar post
  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM posts WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rowCount > 0;
  }

  // Buscar posts por palavra-chave
  async search(searchParams: SearchParams): Promise<Post[]> {
    const { q, page = 1, limit = 10 } = searchParams;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT id, titulo, conteudo, autor, data_criacao, data_atualizacao
      FROM posts
      WHERE 
        titulo ILIKE $1 OR 
        conteudo ILIKE $1 OR 
        autor ILIKE $1
      ORDER BY data_criacao DESC
      LIMIT $2 OFFSET $3
    `;
    
    const searchTerm = `%${q}%`;
    const result = await this.db.query(query, [searchTerm, limit, offset]);
    return result.rows;
  }

  // Contar total de posts
  async count(): Promise<number> {
    const query = 'SELECT COUNT(*) as total FROM posts';
    const result = await this.db.query(query);
    return parseInt(result.rows[0].total);
  }

  // Contar total de posts na busca
  async countSearch(searchTerm: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as total 
      FROM posts 
      WHERE titulo ILIKE $1 OR conteudo ILIKE $1 OR autor ILIKE $1
    `;
    const result = await this.db.query(query, [`%${searchTerm}%`]);
    return parseInt(result.rows[0].total);
  }
} 