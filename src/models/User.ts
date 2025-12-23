import { Database } from '../config/database';
import bcrypt from 'bcryptjs';

export type UserType = 'professor' | 'aluno';

export interface IUser {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  tipo: UserType;
  data_criacao?: Date;
}

export class User {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  // Criar novo usuário
  async create(nome: string, email: string, senha: string, tipo: UserType): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(senha, parseInt(process.env.BCRYPT_ROUNDS || '12'));

    const query = `
      INSERT INTO users (nome, email, senha, tipo)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, email, tipo, data_criacao
    `;

    const result = await this.db.query(query, [nome, email, hashedPassword, tipo]);
    return result.rows[0];
  }

  // Buscar usuário por email
  async findByEmail(email: string): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.db.query(query, [email]);
    return result.rows[0] || null;
  }

  // Buscar usuário por ID
  async findById(id: number): Promise<IUser | null> {
    const query = 'SELECT id, nome, email, tipo, data_criacao FROM users WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  // Listar usuários por tipo com paginação
  async findByType(tipo: UserType, page: number = 1, limit: number = 10): Promise<IUser[]> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, nome, email, tipo, data_criacao
      FROM users
      WHERE tipo = $1
      ORDER BY data_criacao DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await this.db.query(query, [tipo, limit, offset]);
    return result.rows;
  }

  // Atualizar usuário
  async update(id: number, nome?: string, email?: string): Promise<IUser | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (nome !== undefined) {
      fields.push(`nome = $${paramIndex}`);
      values.push(nome);
      paramIndex++;
    }

    if (email !== undefined) {
      fields.push(`email = $${paramIndex}`);
      values.push(email);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, nome, email, tipo, data_criacao
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // Deletar usuário
  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rowCount > 0;
  }

  // Contar usuários por tipo
  async countByType(tipo: UserType): Promise<number> {
    const query = 'SELECT COUNT(*) as total FROM users WHERE tipo = $1';
    const result = await this.db.query(query, [tipo]);
    return parseInt(result.rows[0].total);
  }

  // Verificar senha
  async verifyPassword(senha: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(senha, hashedPassword);
  }

  // Verificar se email já existe
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}
