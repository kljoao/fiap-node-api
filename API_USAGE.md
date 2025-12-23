# Documentação da API - Tech Challenge FIAP

## Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Perfis de Usuário](#perfis-de-usuário)
4. [Endpoints de Autenticação](#endpoints-de-autenticação)
5. [Endpoints de Posts](#endpoints-de-posts)
6. [Endpoints de Professores](#endpoints-de-professores)
7. [Endpoints de Alunos](#endpoints-de-alunos)
8. [Matriz de Permissões](#matriz-de-permissões)
9. [Códigos de Status](#códigos-de-status)
10. [Exemplos React Native](#exemplos-react-native)
11. [Tratamento de Erros](#tratamento-de-erros)

---

## Visão Geral

API REST para gerenciamento de posts com sistema de autenticação JWT e diferenciação de perfis (Professores e Alunos).

**Base URL:** `http://localhost:3000`

**Formato de Dados:** JSON

**Autenticação:** JWT (JSON Web Token)

**Swagger:** http://localhost:3000/api-docs

---

## Autenticação

### Como Funciona

1. **Registre-se** ou **faça login** para obter um token JWT
2. **Inclua o token** no header `Authorization` nas requisições protegidas
3. O token expira em **24 horas**
4. O token contém: `id`, `email` e `tipo` do usuário

### Header de Autenticação

```
Authorization: Bearer <seu_token_jwt>
```

### Exemplo de Token Decodificado

```json
{
  "id": 1,
  "email": "professor@fiap.com",
  "tipo": "professor",
  "iat": 1703260800,
  "exp": 1703347200
}
```

---

## Perfis de Usuário

### Professor
- ✅ Pode visualizar posts
- ✅ Pode criar posts
- ✅ Pode editar posts
- ✅ Pode deletar posts
- ✅ Pode gerenciar professores (CRUD)
- ✅ Pode gerenciar alunos (CRUD)

### Aluno
- ✅ Pode visualizar posts
- ✅ Pode buscar posts
- ❌ **NÃO** pode criar/editar/deletar posts
- ❌ **NÃO** pode gerenciar professores
- ❌ **NÃO** pode gerenciar alunos

---

## Endpoints de Autenticação

### 1. Registrar Usuário

Cria uma nova conta de usuário (Professor ou Aluno).

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@fiap.com",
  "senha": "senha123",
  "tipo": "professor"
}
```

**Campos:**
- `nome` (string, obrigatório) - Nome completo
- `email` (string, obrigatório) - Email válido
- `senha` (string, obrigatório) - Mínimo 6 caracteres
- `tipo` (string, obrigatório) - "professor" ou "aluno"

**Response (201 - Sucesso):**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@fiap.com",
      "tipo": "professor",
      "data_criacao": "2025-12-22T14:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Possíveis Erros:**
- `400` - Dados inválidos ou incompletos
- `400` - Tipo deve ser "professor" ou "aluno"
- `409` - Email já cadastrado

---

### 2. Fazer Login

Autentica um usuário e retorna um token JWT.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "joao@fiap.com",
  "senha": "senha123"
}
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@fiap.com",
      "tipo": "professor"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Possíveis Erros:**
- `400` - Email ou senha não fornecidos
- `401` - Email ou senha incorretos

---

### 3. Obter Dados do Usuário Autenticado

Retorna os dados do usuário logado.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@fiap.com",
    "tipo": "professor",
    "data_criacao": "2025-12-22T14:00:00.000Z"
  }
}
```

**Possíveis Erros:**
- `401` - Token não fornecido, inválido ou expirado
- `404` - Usuário não encontrado

---

## Endpoints de Posts

### 1. Listar Todos os Posts

Lista todos os posts com paginação. **Público** (professores e alunos).

**Endpoint:** `GET /posts`

**Query Parameters:**
- `page` (opcional) - Número da página (padrão: 1)
- `limit` (opcional) - Itens por página (padrão: 10)

**Exemplo:**
```
GET /posts?page=1&limit=10
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Bem-vindo à API de Posts",
      "conteudo": "Esta é a primeira postagem...",
      "autor": "Sistema",
      "data_criacao": "2025-12-22T14:00:00.000Z",
      "data_atualizacao": "2025-12-22T14:00:00.000Z"
    }
  ]
}
```

---

### 2. Buscar Post por ID

Retorna um post específico. **Público** (professores e alunos).

**Endpoint:** `GET /posts/:id`

**Exemplo:**
```
GET /posts/1
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "titulo": "Bem-vindo à API de Posts",
    "conteudo": "Esta é a primeira postagem...",
    "autor": "Sistema",
    "data_criacao": "2025-12-22T14:00:00.000Z",
    "data_atualizacao": "2025-12-22T14:00:00.000Z"
  }
}
```

**Possíveis Erros:**
- `404` - Post não encontrado

---

### 3. Buscar Posts por Palavra-chave

Busca posts que contenham a palavra-chave. **Público** (professores e alunos).

**Endpoint:** `GET /posts/search`

**Query Parameters:**
- `q` (obrigatório) - Palavra-chave para busca
- `page` (opcional) - Número da página
- `limit` (opcional) - Itens por página

**Exemplo:**
```
GET /posts/search?q=tecnologia&page=1&limit=5
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "titulo": "Tecnologias utilizadas",
      "conteudo": "Esta API foi construída com Node.js...",
      "autor": "Desenvolvedor",
      "data_criacao": "2025-12-22T14:00:00.000Z",
      "data_atualizacao": "2025-12-22T14:00:00.000Z"
    }
  ]
}
```

---

### 4. Criar Novo Post

Cria uma nova postagem. **Apenas Professores** 🔒

**Endpoint:** `POST /posts`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Meu Primeiro Post",
  "conteudo": "Este é o conteúdo do meu primeiro post.",
  "autor": "João Silva"
}
```

**Response (201 - Sucesso):**
```json
{
  "success": true,
  "message": "Post criado com sucesso",
  "data": {
    "id": 4,
    "titulo": "Meu Primeiro Post",
    "conteudo": "Este é o conteúdo do meu primeiro post.",
    "autor": "João Silva",
    "data_criacao": "2025-12-22T14:00:00.000Z",
    "data_atualizacao": "2025-12-22T14:00:00.000Z"
  }
}
```

**Possíveis Erros:**
- `400` - Dados inválidos ou incompletos
- `401` - Token não fornecido ou inválido
- `403` - Acesso negado - apenas professores

---

### 5. Atualizar Post

Atualiza uma postagem existente. **Apenas Professores** 🔒

**Endpoint:** `PUT /posts/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (campos opcionais):**
```json
{
  "titulo": "Título Atualizado",
  "conteudo": "Conteúdo atualizado."
}
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "message": "Post atualizado com sucesso",
  "data": {
    "id": 4,
    "titulo": "Título Atualizado",
    "conteudo": "Conteúdo atualizado.",
    "autor": "João Silva",
    "data_criacao": "2025-12-22T14:00:00.000Z",
    "data_atualizacao": "2025-12-22T14:05:00.000Z"
  }
}
```

**Possíveis Erros:**
- `400` - Dados inválidos
- `401` - Token não fornecido ou inválido
- `403` - Acesso negado - apenas professores
- `404` - Post não encontrado

---

### 6. Deletar Post

Deleta uma postagem. **Apenas Professores** 🔒

**Endpoint:** `DELETE /posts/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "message": "Post deletado com sucesso"
}
```

**Possíveis Erros:**
- `401` - Token não fornecido ou inválido
- `403` - Acesso negado - apenas professores
- `404` - Post não encontrado

---

## Endpoints de Professores

**Todas as rotas requerem autenticação de PROFESSOR** 🔒

### 1. Listar Professores

**Endpoint:** `GET /professores`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional) - Número da página (padrão: 1)
- `limit` (opcional) - Itens por página (padrão: 10)

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Prof. João Silva",
      "email": "joao@fiap.com",
      "data_criacao": "2025-12-22T14:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### 2. Buscar Professor por ID

**Endpoint:** `GET /professores/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Prof. João Silva",
    "email": "joao@fiap.com",
    "data_criacao": "2025-12-22T14:00:00.000Z"
  }
}
```

**Possíveis Erros:**
- `404` - Professor não encontrado

---

### 3. Criar Professor

**Endpoint:** `POST /professores`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Prof. Maria Santos",
  "email": "maria@fiap.com",
  "senha": "senha123"
}
```

**Response (201 - Sucesso):**
```json
{
  "success": true,
  "message": "Professor criado com sucesso",
  "data": {
    "id": 2,
    "nome": "Prof. Maria Santos",
    "email": "maria@fiap.com",
    "data_criacao": "2025-12-22T14:00:00.000Z"
  }
}
```

**Possíveis Erros:**
- `400` - Dados inválidos
- `409` - Email já cadastrado
- `403` - Acesso negado - apenas professores

---

### 4. Atualizar Professor

**Endpoint:** `PUT /professores/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (campos opcionais):**
```json
{
  "nome": "Prof. Maria Santos Silva",
  "email": "maria.santos@fiap.com"
}
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "message": "Professor atualizado com sucesso",
  "data": {
    "id": 2,
    "nome": "Prof. Maria Santos Silva",
    "email": "maria.santos@fiap.com",
    "data_criacao": "2025-12-22T14:00:00.000Z"
  }
}
```

**Possíveis Erros:**
- `404` - Professor não encontrado
- `400` - Dados inválidos
- `409` - Email já em uso

---

### 5. Deletar Professor

**Endpoint:** `DELETE /professores/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "message": "Professor deletado com sucesso"
}
```

**Possíveis Erros:**
- `404` - Professor não encontrado
- `403` - Acesso negado

---

## Endpoints de Alunos

**Todas as rotas requerem autenticação de PROFESSOR** 🔒

### 1. Listar Alunos

**Endpoint:** `GET /alunos`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional) - Número da página (padrão: 1)
- `limit` (opcional) - Itens por página (padrão: 10)

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "nome": "Aluno Pedro Costa",
      "email": "pedro@fiap.com",
      "data_criacao": "2025-12-22T14:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

### 2. Buscar Aluno por ID

**Endpoint:** `GET /alunos/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "nome": "Aluno Pedro Costa",
    "email": "pedro@fiap.com",
    "data_criacao": "2025-12-22T14:00:00.000Z"
  }
}
```

**Possíveis Erros:**
- `404` - Aluno não encontrado

---

### 3. Criar Aluno

**Endpoint:** `POST /alunos`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Aluno Ana Paula",
  "email": "ana@fiap.com",
  "senha": "senha123"
}
```

**Response (201 - Sucesso):**
```json
{
  "success": true,
  "message": "Aluno criado com sucesso",
  "data": {
    "id": 4,
    "nome": "Aluno Ana Paula",
    "email": "ana@fiap.com",
    "data_criacao": "2025-12-22T14:00:00.000Z"
  }
}
```

**Possíveis Erros:**
- `400` - Dados inválidos
- `409` - Email já cadastrado
- `403` - Acesso negado - apenas professores

---

### 4. Atualizar Aluno

**Endpoint:** `PUT /alunos/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (campos opcionais):**
```json
{
  "nome": "Aluno Ana Paula Silva",
  "email": "ana.paula@fiap.com"
}
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "message": "Aluno atualizado com sucesso",
  "data": {
    "id": 4,
    "nome": "Aluno Ana Paula Silva",
    "email": "ana.paula@fiap.com",
    "data_criacao": "2025-12-22T14:00:00.000Z"
  }
}
```

**Possíveis Erros:**
- `404` - Aluno não encontrado
- `400` - Dados inválidos
- `409` - Email já em uso

---

### 5. Deletar Aluno

**Endpoint:** `DELETE /alunos/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "message": "Aluno deletado com sucesso"
}
```

**Possíveis Erros:**
- `404` - Aluno não encontrado
- `403` - Acesso negado

---

## Matriz de Permissões

| Endpoint | Professor | Aluno | Público |
|----------|-----------|-------|---------|
| `GET /health` | ✅ | ✅ | ✅ |
| `POST /auth/register` | ✅ | ✅ | ✅ |
| `POST /auth/login` | ✅ | ✅ | ✅ |
| `GET /auth/me` | ✅ | ✅ | ❌ |
| `GET /posts` | ✅ | ✅ | ❌ |
| `GET /posts/:id` | ✅ | ✅ | ❌ |
| `GET /posts/search` | ✅ | ✅ | ❌ |
| `POST /posts` | ✅ | ❌ | ❌ |
| `PUT /posts/:id` | ✅ | ❌ | ❌ |
| `DELETE /posts/:id` | ✅ | ❌ | ❌ |
| `GET /professores` | ✅ | ❌ | ❌ |
| `POST /professores` | ✅ | ❌ | ❌ |
| `PUT /professores/:id` | ✅ | ❌ | ❌ |
| `DELETE /professores/:id` | ✅ | ❌ | ❌ |
| `GET /alunos` | ✅ | ❌ | ❌ |
| `POST /alunos` | ✅ | ❌ | ❌ |
| `PUT /alunos/:id` | ✅ | ❌ | ❌ |
| `DELETE /alunos/:id` | ✅ | ❌ | ❌ |

---

## Códigos de Status

### Sucesso
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso

### Erros do Cliente
- `400 Bad Request` - Dados inválidos ou incompletos
- `401 Unauthorized` - Não autenticado ou token inválido
- `403 Forbidden` - Sem permissão (ex: aluno tentando criar post)
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: email já cadastrado)

### Erros do Servidor
- `500 Internal Server Error` - Erro interno do servidor

---

## Exemplos React Native

### Configuração do Axios

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@fiap:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

---

### 1. Registro de Usuário

```javascript
import api from './api';

const registerUser = async (nome, email, senha, tipo) => {
  try {
    const response = await api.post('/auth/register', {
      nome,
      email,
      senha,
      tipo, // 'professor' ou 'aluno'
    });

    const { user, token } = response.data.data;

    // Salvar token e dados do usuário
    await AsyncStorage.setItem('@fiap:token', token);
    await AsyncStorage.setItem('@fiap:user', JSON.stringify(user));

    return { success: true, user, token };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }
    return {
      success: false,
      message: 'Erro ao conectar com o servidor',
    };
  }
};

// Uso
const result = await registerUser(
  'João Silva',
  'joao@fiap.com',
  'senha123',
  'professor'
);
```

---

### 2. Login

```javascript
const login = async (email, senha) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      senha,
    });

    const { user, token } = response.data.data;

    // Salvar token e dados do usuário
    await AsyncStorage.setItem('@fiap:token', token);
    await AsyncStorage.setItem('@fiap:user', JSON.stringify(user));

    return { success: true, user, token };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }
    return {
      success: false,
      message: 'Erro ao conectar com o servidor',
    };
  }
};
```

---

### 3. Listar Posts

```javascript
const getPosts = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return {
      success: true,
      posts: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar posts',
    };
  }
};
```

---

### 4. Criar Post (Apenas Professor)

```javascript
const createPost = async (titulo, conteudo, autor) => {
  try {
    const response = await api.post('/posts', {
      titulo,
      conteudo,
      autor,
    });

    return {
      success: true,
      post: response.data.data,
    };
  } catch (error) {
    if (error.response?.status === 403) {
      return {
        success: false,
        message: 'Acesso negado. Apenas professores podem criar posts.',
      };
    }
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao criar post',
    };
  }
};
```

---

### 5. Listar Alunos (Apenas Professor)

```javascript
const getAlunos = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/alunos?page=${page}&limit=${limit}`);
    return {
      success: true,
      alunos: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    if (error.response?.status === 403) {
      return {
        success: false,
        message: 'Acesso negado. Apenas professores podem visualizar alunos.',
      };
    }
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar alunos',
    };
  }
};
```

---

### 6. Criar Aluno (Apenas Professor)

```javascript
const createAluno = async (nome, email, senha) => {
  try {
    const response = await api.post('/alunos', {
      nome,
      email,
      senha,
    });

    return {
      success: true,
      aluno: response.data.data,
    };
  } catch (error) {
    if (error.response?.status === 409) {
      return {
        success: false,
        message: 'Email já cadastrado',
      };
    }
    if (error.response?.status === 403) {
      return {
        success: false,
        message: 'Acesso negado. Apenas professores podem criar alunos.',
      };
    }
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao criar aluno',
    };
  }
};
```

---

### 7. Atualizar Post (Apenas Professor)

```javascript
const updatePost = async (id, titulo, conteudo) => {
  try {
    const response = await api.put(`/posts/${id}`, {
      titulo,
      conteudo,
    });

    return {
      success: true,
      post: response.data.data,
    };
  } catch (error) {
    if (error.response?.status === 403) {
      return {
        success: false,
        message: 'Acesso negado. Apenas professores podem editar posts.',
      };
    }
    if (error.response?.status === 404) {
      return {
        success: false,
        message: 'Post não encontrado',
      };
    }
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao atualizar post',
    };
  }
};
```

---

### 8. Deletar Post (Apenas Professor)

```javascript
const deletePost = async (id) => {
  try {
    await api.delete(`/posts/${id}`);
    return { success: true };
  } catch (error) {
    if (error.response?.status === 403) {
      return {
        success: false,
        message: 'Acesso negado. Apenas professores podem deletar posts.',
      };
    }
    if (error.response?.status === 404) {
      return {
        success: false,
        message: 'Post não encontrado',
      };
    }
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao deletar post',
    };
  }
};
```

---

### 9. Verificar Tipo do Usuário

```javascript
const getUserType = async () => {
  try {
    const userJson = await AsyncStorage.getItem('@fiap:user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.tipo; // 'professor' ou 'aluno'
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Uso para renderização condicional
const userType = await getUserType();

if (userType === 'professor') {
  // Mostrar botões de criar/editar/deletar
} else {
  // Mostrar apenas visualização
}
```

---

### 10. Hook Customizado para Autenticação

```javascript
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isProfessor, setIsProfessor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@fiap:token');
      const storedUser = await AsyncStorage.getItem('@fiap:user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsProfessor(userData.tipo === 'professor');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, senha) => {
    const result = await login(email, senha);
    if (result.success) {
      setToken(result.token);
      setUser(result.user);
      setIsProfessor(result.user.tipo === 'professor');
    }
    return result;
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@fiap:token');
    await AsyncStorage.removeItem('@fiap:user');
    setToken(null);
    setUser(null);
    setIsProfessor(false);
  };

  return {
    user,
    token,
    isProfessor,
    loading,
    signIn,
    signOut,
  };
};
```

---

## Tratamento de Erros

### Estrutura de Erro Padrão

```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

### Tratamento no React Native

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Servidor respondeu com erro
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return {
          title: 'Dados Inválidos',
          message: data.message || 'Verifique os dados e tente novamente',
        };
      case 401:
        // Token expirado ou inválido
        return {
          title: 'Sessão Expirada',
          message: 'Faça login novamente',
          shouldLogout: true,
        };
      case 403:
        return {
          title: 'Acesso Negado',
          message: data.message || 'Você não tem permissão para esta ação',
        };
      case 404:
        return {
          title: 'Não Encontrado',
          message: data.message || 'Recurso não encontrado',
        };
      case 409:
        return {
          title: 'Conflito',
          message: data.message || 'Este item já existe',
        };
      case 500:
        return {
          title: 'Erro no Servidor',
          message: 'Tente novamente mais tarde',
        };
      default:
        return {
          title: 'Erro',
          message: data.message || 'Ocorreu um erro inesperado',
        };
    }
  } else if (error.request) {
    // Requisição foi feita mas não houve resposta
    return {
      title: 'Erro de Conexão',
      message: 'Verifique sua conexão com a internet',
    };
  } else {
    // Erro ao configurar a requisição
    return {
      title: 'Erro',
      message: error.message || 'Ocorreu um erro inesperado',
    };
  }
};

// Uso
try {
  await createPost(titulo, conteudo, autor);
} catch (error) {
  const errorInfo = handleApiError(error);
  Alert.alert(errorInfo.title, errorInfo.message);

  if (errorInfo.shouldLogout) {
    await signOut();
    navigation.navigate('Login');
  }
}
```

---

## Dicas para o Frontend

### 1. Navegação Baseada em Perfil

```javascript
// Renderização condicional de telas
{isProfessor ? (
  <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
) : (
  <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
)}
```

### 2. Botões Condicionais

```javascript
// Mostrar botão apenas para professores
{isProfessor && (
  <TouchableOpacity onPress={handleCreatePost}>
    <Text>Criar Post</Text>
  </TouchableOpacity>
)}
```

### 3. Refresh Token Automático

```javascript
// Interceptor para renovar token expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado - fazer logout
      await signOut();
      navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);
```

---

## Variáveis de Ambiente

Para produção, configure:

```javascript
// .env ou config.js
export const API_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://sua-api-producao.com';
```

---

## Swagger/OpenAPI

Documentação interativa disponível em:

**URL:** http://localhost:3000/api-docs

Use o Swagger para:
- Testar endpoints rapidamente
- Ver exemplos de request/response
- Entender a estrutura dos dados
- Testar autenticação JWT

---

**Desenvolvido para o Tech Challenge FIAP - Fase 2**

**Stack:** Node.js, Express, TypeScript, PostgreSQL, JWT
