# API de Posts - Node.js + Express + TypeScript

Uma API REST completa para gerenciamento de posts, construída com Node.js, Express, TypeScript e PostgreSQL.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Linguagem tipada
- **PostgreSQL** - Banco de dados
- **Docker** - Containerização
- **Jest** - Testes unitários
- **GitHub Actions** - CI/CD

## 📋 Endpoints da API

### Posts

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/posts` | Lista todos os posts |
| GET | `/posts/:id` | Exibe conteúdo de um post específico |
| POST | `/posts` | Cria nova postagem |
| PUT | `/posts/:id` | Edita uma postagem existente |
| DELETE | `/posts/:id` | Exclui uma postagem |
| GET | `/posts/search` | Busca postagens por palavra-chave |

### Health Check

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Verifica status da API |

## 🛠️ Setup Inicial

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- Docker (opcional)

### Instalação Local

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd posts-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados**
```bash
# Crie o banco de dados PostgreSQL
createdb posts_api

# Execute o script de inicialização
psql -d posts_api -f scripts/init.sql
```

5. **Execute a aplicação**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

### Usando Docker

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd posts-api
```

2. **Execute com Docker Compose**
```bash
docker-compose up -d
```

A API estará disponível em `http://localhost:3000`

## 📊 Estrutura do Projeto

```
posts-api/
├── src/
│   ├── config/          # Configurações
│   ├── controllers/      # Controladores
│   ├── middleware/       # Middlewares
│   ├── models/          # Modelos de dados
│   ├── routes/          # Rotas
│   ├── tests/           # Testes unitários
│   ├── types/           # Tipos TypeScript
│   └── server.ts        # Servidor principal
├── scripts/             # Scripts SQL
├── .github/             # GitHub Actions
├── docker-compose.yml   # Docker Compose
├── Dockerfile           # Docker
└── package.json         # Dependências
```

## 🗄️ Modelo de Dados

### Tabela `posts`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Chave primária |
| titulo | VARCHAR(255) | Título do post |
| conteudo | TEXT | Conteúdo do post |
| autor | VARCHAR(100) | Autor do post |
| data_criacao | TIMESTAMP | Data de criação |
| data_atualizacao | TIMESTAMP | Data de atualização |

## 🔧 Configurações

### Variáveis de Ambiente

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=posts_api
DB_USER=postgres
DB_PASSWORD=postgres

# Segurança
JWT_SECRET=sua_chave_secreta
BCRYPT_ROUNDS=12

# Logs
LOG_LEVEL=info
```

## 🧪 Testes

### Executar Testes
```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:coverage
```

### Cobertura de Testes
- **Mínimo**: 20% do código
- **Atual**: Cobertura completa dos modelos e controladores

## 🐳 Docker

### Comandos Docker

```bash
# Construir imagem
docker build -t posts-api .

# Executar container
docker run -p 3000:3000 posts-api

# Usar Docker Compose
docker-compose up -d
```

### Docker Compose

O `docker-compose.yml` inclui:
- **PostgreSQL**: Banco de dados
- **Node.js**: Aplicação
- **Volumes**: Persistência de dados
- **Networks**: Comunicação entre containers

## 🔄 CI/CD

### GitHub Actions

O pipeline inclui:
1. **Testes**: Execução de testes unitários
2. **Linting**: Verificação de código
3. **Build**: Compilação da aplicação
4. **Docker**: Construção da imagem
5. **Deploy**: Deploy automático

### Workflow

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

## 📝 Exemplos de Uso

### Criar um Post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Meu Primeiro Post",
    "conteudo": "Este é o conteúdo do meu primeiro post.",
    "autor": "João Silva"
  }'
```

### Listar Posts

```bash
curl http://localhost:3000/posts?page=1&limit=10
```

### Buscar Posts

```bash
curl "http://localhost:3000/posts/search?q=tecnologia&page=1&limit=5"
```

### Atualizar Post

```bash
curl -X PUT http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Título Atualizado",
    "conteudo": "Conteúdo atualizado."
  }'
```

### Deletar Post

```bash
curl -X DELETE http://localhost:3000/posts/1
```

## 🔒 Segurança

### Implementações de Segurança

- **Helmet**: Headers de segurança
- **CORS**: Controle de acesso
- **Rate Limiting**: Proteção contra ataques
- **Input Validation**: Validação de entrada
- **SQL Injection Protection**: Proteção contra injeção SQL

## 📈 Performance

### Otimizações

- **Índices**: Índices no banco de dados
- **Connection Pooling**: Pool de conexões
- **Compression**: Compressão de resposta
- **Caching**: Cache de consultas

## 🚨 Tratamento de Erros

### Códigos de Status

- `200`: Sucesso
- `201`: Criado
- `400`: Requisição inválida
- `404`: Não encontrado
- `500`: Erro interno

### Formato de Resposta

```json
{
  "success": true,
  "data": {...},
  "message": "Operação realizada com sucesso"
}
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Compilar TypeScript
npm run start        # Produção
npm run test         # Testes
npm run test:watch   # Testes em watch
npm run test:coverage # Testes com cobertura
npm run lint         # Linting
npm run lint:fix     # Corrigir linting
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Desenvolvedor**
- Email: dev@example.com
- GitHub: [@dev](https://github.com/dev)

## 🙏 Agradecimentos

- Node.js Community
- Express.js Team
- PostgreSQL Community
- Docker Team

---

**Desenvolvido com ❤️ usando Node.js, Express, TypeScript e PostgreSQL** 