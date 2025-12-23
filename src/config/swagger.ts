import swaggerJsdoc from 'swagger-jsdoc';
import { AppConfigManager } from './app';

const config = AppConfigManager.getInstance().getConfig();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Posts API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de posts com autenticação JWT',
      contact: {
        name: 'Desenvolvedor',
        email: 'dev@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do usuário',
              example: 1,
            },
            nome: {
              type: 'string',
              description: 'Nome do usuário',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao@example.com',
            },
            tipo: {
              type: 'string',
              enum: ['professor', 'aluno'],
              description: 'Tipo de usuário',
              example: 'professor',
            },
            data_criacao: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do usuário',
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do post',
              example: 1,
            },
            titulo: {
              type: 'string',
              description: 'Título do post',
              example: 'Meu primeiro post',
            },
            conteudo: {
              type: 'string',
              description: 'Conteúdo do post',
              example: 'Este é o conteúdo do meu primeiro post.',
            },
            autor: {
              type: 'string',
              description: 'Autor do post',
              example: 'João Silva',
            },
            data_criacao: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do post',
            },
            data_atualizacao: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização do post',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['nome', 'email', 'senha', 'tipo'],
          properties: {
            nome: {
              type: 'string',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com',
            },
            senha: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'senha123',
            },
            tipo: {
              type: 'string',
              enum: ['professor', 'aluno'],
              description: 'Tipo de usuário',
              example: 'professor',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com',
            },
            senha: {
              type: 'string',
              format: 'password',
              example: 'senha123',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login realizado com sucesso',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'Token JWT',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
        CreatePostRequest: {
          type: 'object',
          required: ['titulo', 'conteudo', 'autor'],
          properties: {
            titulo: {
              type: 'string',
              example: 'Meu primeiro post',
            },
            conteudo: {
              type: 'string',
              example: 'Este é o conteúdo do meu primeiro post.',
            },
            autor: {
              type: 'string',
              example: 'João Silva',
            },
          },
        },
        UpdatePostRequest: {
          type: 'object',
          properties: {
            titulo: {
              type: 'string',
              example: 'Título atualizado',
            },
            conteudo: {
              type: 'string',
              example: 'Conteúdo atualizado.',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso',
            },
            data: {
              type: 'object',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Mensagem de erro',
            },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: {
              type: 'string',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com',
            },
            senha: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'senha123',
            },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            nome: {
              type: 'string',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com',
            },
          },
        },
        UserListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 10,
                },
                total: {
                  type: 'integer',
                  example: 50,
                },
                totalPages: {
                  type: 'integer',
                  example: 5,
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints de autenticação e gerenciamento de usuários',
      },
      {
        name: 'Posts',
        description: 'Endpoints de gerenciamento de posts',
      },
      {
        name: 'Professores',
        description: 'Endpoints de gerenciamento de professores (apenas professores)',
      },
      {
        name: 'Alunos',
        description: 'Endpoints de gerenciamento de alunos (apenas professores)',
      },
      {
        name: 'Health',
        description: 'Endpoint de verificação de saúde da API',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/server.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
