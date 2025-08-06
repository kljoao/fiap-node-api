# Documentação da API de Posts

## 📋 Visão Geral

A API de Posts é uma API REST completa para gerenciamento de postagens, construída com Node.js, Express, TypeScript e PostgreSQL.

**URL Base**: `http://localhost:3000`  
**Versão**: 1.0.0  
**Formato de Resposta**: JSON

## 🔗 Endpoints

### Posts

#### 1. Listar Todos os Posts

**GET** `/posts`

Lista todos os posts com paginação.

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Número de itens por página (padrão: 10)

**Exemplo de Requisição:**
```bash
curl -X GET "http://localhost:3000/posts?page=1&limit=5"
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Meu Primeiro Post",
      "conteudo": "Este é o conteúdo do meu primeiro post.",
      "autor": "João Silva",
      "data_criacao": "2024-01-15T10:30:00.000Z",
      "data_atualizacao": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "totalPages": 5
  }
}
```

#### 2. Buscar Post por ID

**GET** `/posts/:id`

Retorna um post específico pelo ID.

**Parâmetros de Path:**
- `id` (obrigatório): ID do post

**Exemplo de Requisição:**
```bash
curl -X GET "http://localhost:3000/posts/1"
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "titulo": "Meu Primeiro Post",
    "conteudo": "Este é o conteúdo do meu primeiro post.",
    "autor": "João Silva",
    "data_criacao": "2024-01-15T10:30:00.000Z",
    "data_atualizacao": "2024-01-15T10:30:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Post não encontrado"
}
```

#### 3. Criar Novo Post

**POST** `/posts`

Cria uma nova postagem.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Novo Post",
  "conteudo": "Conteúdo do novo post.",
  "autor": "Maria Santos"
}
```

**Exemplo de Requisição:**
```bash
curl -X POST "http://localhost:3000/posts" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Novo Post",
    "conteudo": "Conteúdo do novo post.",
    "autor": "Maria Santos"
  }'
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "titulo": "Novo Post",
    "conteudo": "Conteúdo do novo post.",
    "autor": "Maria Santos",
    "data_criacao": "2024-01-15T11:00:00.000Z",
    "data_atualizacao": "2024-01-15T11:00:00.000Z"
  },
  "message": "Post criado com sucesso"
}
```

**Resposta de Erro (400):**
```json
{
  "success": false,
  "error": "Campos obrigatórios não fornecidos"
}
```

#### 4. Atualizar Post

**PUT** `/posts/:id`

Atualiza uma postagem existente.

**Parâmetros de Path:**
- `id` (obrigatório): ID do post

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Título Atualizado",
  "conteudo": "Conteúdo atualizado.",
  "autor": "João Silva"
}
```

**Exemplo de Requisição:**
```bash
curl -X PUT "http://localhost:3000/posts/1" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Título Atualizado",
    "conteudo": "Conteúdo atualizado."
  }'
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "titulo": "Título Atualizado",
    "conteudo": "Conteúdo atualizado.",
    "autor": "João Silva",
    "data_criacao": "2024-01-15T10:30:00.000Z",
    "data_atualizacao": "2024-01-15T11:30:00.000Z"
  },
  "message": "Post atualizado com sucesso"
}
```

#### 5. Deletar Post

**DELETE** `/posts/:id`

Remove uma postagem.

**Parâmetros de Path:**
- `id` (obrigatório): ID do post

**Exemplo de Requisição:**
```bash
curl -X DELETE "http://localhost:3000/posts/1"
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Post deletado com sucesso"
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Post não encontrado"
}
```

#### 6. Buscar Posts

**GET** `/posts/search`

Busca postagens por palavra-chave.

**Parâmetros de Query:**
- `q` (obrigatório): Termo de busca
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Número de itens por página (padrão: 10)

**Exemplo de Requisição:**
```bash
curl -X GET "http://localhost:3000/posts/search?q=tecnologia&page=1&limit=5"
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "titulo": "Tecnologia Moderna",
      "conteudo": "Artigo sobre as últimas tecnologias.",
      "autor": "Carlos Tech",
      "data_criacao": "2024-01-15T09:00:00.000Z",
      "data_atualizacao": "2024-01-15T09:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "totalPages": 1
  }
}
```

### Health Check

#### Verificar Status da API

**GET** `/health`

Verifica se a API está funcionando corretamente.

**Exemplo de Requisição:**
```bash
curl -X GET "http://localhost:3000/health"
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T12:00:00.000Z",
    "uptime": 3600,
    "version": "1.0.0"
  }
}
```

## 📊 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Requisição inválida |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro interno do servidor |

## 🔒 Autenticação

Atualmente, a API não requer autenticação. Em versões futuras, será implementado JWT.

## 📝 Formatos de Dados

### Post Object
```json
{
  "id": "number",
  "titulo": "string",
  "conteudo": "string",
  "autor": "string",
  "data_criacao": "string (ISO 8601)",
  "data_atualizacao": "string (ISO 8601)"
}
```

### Create Post Request
```json
{
  "titulo": "string (obrigatório)",
  "conteudo": "string (obrigatório)",
  "autor": "string (obrigatório)"
}
```

### Update Post Request
```json
{
  "titulo": "string (opcional)",
  "conteudo": "string (opcional)",
  "autor": "string (opcional)"
}
```

### Pagination Object
```json
{
  "page": "number",
  "limit": "number",
  "total": "number",
  "totalPages": "number"
}
```

## 🚨 Tratamento de Erros

### Formato de Erro
```json
{
  "success": false,
  "error": "string"
}
```

### Tipos de Erro Comuns

1. **Campos Obrigatórios**
```json
{
  "success": false,
  "error": "Campos obrigatórios não fornecidos"
}
```

2. **Post Não Encontrado**
```json
{
  "success": false,
  "error": "Post não encontrado"
}
```

3. **Erro de Validação**
```json
{
  "success": false,
  "error": "Dados inválidos fornecidos"
}
```

4. **Erro Interno**
```json
{
  "success": false,
  "error": "Erro interno do servidor"
}
```

## 📈 Paginação

A API suporta paginação para endpoints que retornam listas:

- **page**: Número da página (começa em 1)
- **limit**: Número de itens por página (máximo 100)
- **total**: Total de itens disponíveis
- **totalPages**: Total de páginas

## 🔍 Busca

A busca é case-insensitive e procura nos campos:
- `titulo`
- `conteudo`
- `autor`

### Exemplos de Busca

```bash
# Buscar por título
GET /posts/search?q=tecnologia

# Buscar por autor
GET /posts/search?q=João

# Buscar com paginação
GET /posts/search?q=artigo&page=2&limit=10
```

## 🛠️ Exemplos de Uso

### JavaScript (Fetch)
```javascript
// Listar posts
const response = await fetch('http://localhost:3000/posts');
const data = await response.json();

// Criar post
const newPost = await fetch('http://localhost:3000/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    titulo: 'Novo Post',
    conteudo: 'Conteúdo do post',
    autor: 'João Silva'
  })
});
```

### Python (Requests)
```python
import requests

# Listar posts
response = requests.get('http://localhost:3000/posts')
posts = response.json()

# Criar post
new_post = requests.post('http://localhost:3000/posts', json={
    'titulo': 'Novo Post',
    'conteudo': 'Conteúdo do post',
    'autor': 'João Silva'
})
```

### cURL
```bash
# Listar posts
curl -X GET "http://localhost:3000/posts"

# Criar post
curl -X POST "http://localhost:3000/posts" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Novo Post","conteudo":"Conteúdo","autor":"João"}'

# Atualizar post
curl -X PUT "http://localhost:3000/posts/1" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Título Atualizado"}'

# Deletar post
curl -X DELETE "http://localhost:3000/posts/1"
```

## 📚 Recursos Adicionais

- [Postman Collection](link-para-collection)
- [Swagger Documentation](link-para-swagger)
- [GitHub Repository](link-para-repo)

## 🤝 Suporte

Para suporte técnico ou dúvidas sobre a API:

- **Email**: api-support@example.com
- **GitHub Issues**: [Criar Issue](link-para-issues)
- **Documentação**: [Link para docs](link-para-docs)

---

**Versão da Documentação**: 1.0.0  
**Última Atualização**: Janeiro 2024 