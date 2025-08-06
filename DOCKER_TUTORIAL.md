# Tutorial Docker - API de Posts

## 🐳 Introdução ao Docker

Este tutorial explica como usar Docker para containerizar e executar a API de Posts de forma isolada e reproduzível.

## 📋 Pré-requisitos

- Docker instalado (versão 20.10+)
- Docker Compose instalado (versão 2.0+)
- Git para clonar o repositório

## 🚀 Início Rápido

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd posts-api
```

### 2. Execute com Docker Compose
```bash
docker-compose up -d
```

### 3. Verifique se está Funcionando
```bash
curl http://localhost:3000/health
```

## 📖 Conceitos Básicos

### O que é Docker?

Docker é uma plataforma que permite empacotar aplicações em containers isolados, garantindo que funcionem da mesma forma em qualquer ambiente.

### Vantagens do Docker

- **Isolamento**: Cada container roda independentemente
- **Portabilidade**: Funciona em qualquer sistema com Docker
- **Consistência**: Mesmo comportamento em desenvolvimento e produção
- **Escalabilidade**: Fácil de escalar horizontalmente

## 🏗️ Estrutura do Projeto Docker

```
posts-api/
├── Dockerfile              # Configuração da imagem da aplicação
├── docker-compose.yml      # Orquestração dos containers
├── .dockerignore          # Arquivos ignorados pelo Docker
└── scripts/
    └── init.sql           # Script de inicialização do banco
```

## 📝 Dockerfile Explicado

```dockerfile
# Imagem base do Node.js
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
```

### Explicação das Instruções

- **FROM**: Define a imagem base (Node.js 18 Alpine)
- **WORKDIR**: Define o diretório de trabalho
- **COPY**: Copia arquivos para o container
- **RUN**: Executa comandos durante o build
- **EXPOSE**: Documenta a porta utilizada
- **CMD**: Comando padrão para executar o container

## 🐙 Docker Compose

### Arquivo docker-compose.yml

```yaml
version: '3.8'

services:
  # Banco de dados PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: posts_api_db
    environment:
      POSTGRES_DB: posts_api
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - posts_api_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Aplicação Node.js
  app:
    build: .
    container_name: posts_api_app
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: posts_api
      DB_USER: postgres
      DB_PASSWORD: postgres
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - posts_api_network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  posts_api_network:
    driver: bridge
```

### Explicação dos Serviços

#### PostgreSQL
- **image**: Imagem oficial do PostgreSQL
- **environment**: Variáveis de ambiente para configuração
- **volumes**: Persistência de dados e script de inicialização
- **healthcheck**: Verifica se o banco está pronto

#### Aplicação Node.js
- **build**: Constrói a imagem a partir do Dockerfile
- **depends_on**: Garante que o PostgreSQL esteja pronto
- **networks**: Comunicação entre containers

## 🛠️ Comandos Docker Essenciais

### Construir Imagem
```bash
# Construir imagem da aplicação
docker build -t posts-api .

# Construir com tag específica
docker build -t posts-api:v1.0.0 .
```

### Executar Container
```bash
# Executar container da aplicação
docker run -p 3000:3000 posts-api

# Executar em background
docker run -d -p 3000:3000 --name posts-api posts-api

# Executar com variáveis de ambiente
docker run -e NODE_ENV=production -p 3000:3000 posts-api
```

### Docker Compose
```bash
# Iniciar todos os serviços
docker-compose up

# Iniciar em background
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Reconstruir e iniciar
docker-compose up --build

# Ver logs
docker-compose logs -f app
```

### Gerenciamento de Containers
```bash
# Listar containers em execução
docker ps

# Listar todas as imagens
docker images

# Parar container
docker stop posts-api

# Remover container
docker rm posts-api

# Remover imagem
docker rmi posts-api
```

## 🔍 Debugging e Troubleshooting

### Verificar Logs
```bash
# Logs da aplicação
docker-compose logs app

# Logs do banco de dados
docker-compose logs postgres

# Logs em tempo real
docker-compose logs -f
```

### Acessar Container
```bash
# Acessar container da aplicação
docker exec -it posts_api_app sh

# Acessar container do banco
docker exec -it posts_api_db psql -U postgres -d posts_api
```

### Verificar Status
```bash
# Status dos containers
docker-compose ps

# Informações detalhadas
docker-compose top
```

## 🚀 Ambientes de Deploy

### Desenvolvimento
```bash
# Usar docker-compose.dev.yml
docker-compose -f docker-compose.dev.yml up -d
```

### Produção
```bash
# Usar docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoramento

### Métricas do Container
```bash
# Estatísticas de uso
docker stats

# Informações detalhadas
docker inspect posts_api_app
```

### Health Checks
```bash
# Verificar saúde da aplicação
curl http://localhost:3000/health

# Verificar saúde do banco
docker exec posts_api_db pg_isready -U postgres
```

## 🔒 Segurança

### Boas Práticas

1. **Não rodar como root**
```dockerfile
# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs
```

2. **Usar imagens oficiais**
```dockerfile
FROM node:18-alpine
```

3. **Minimizar camadas**
```dockerfile
# Combinar comandos RUN
RUN npm ci --only=production && npm cache clean --force
```

4. **Usar .dockerignore**
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
```

## 📈 Performance

### Otimizações

1. **Multi-stage builds**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Cache de dependências**
```dockerfile
# Copiar apenas package.json primeiro
COPY package*.json ./
RUN npm ci --only=production
```

## 🔄 CI/CD com Docker

### GitHub Actions
```yaml
- name: Build Docker image
  run: docker build -t posts-api .

- name: Run tests in Docker
  run: docker run posts-api npm test
```

## 🐛 Problemas Comuns

### Container não inicia
```bash
# Verificar logs
docker-compose logs app

# Verificar se a porta está disponível
netstat -tulpn | grep :3000
```

### Banco não conecta
```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps postgres

# Verificar logs do banco
docker-compose logs postgres
```

### Problemas de permissão
```bash
# Ajustar permissões do volume
sudo chown -R 999:999 postgres_data/
```

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)

## 🎯 Próximos Passos

1. **Implementar multi-stage builds**
2. **Adicionar monitoramento com Prometheus**
3. **Configurar backup automático do banco**
4. **Implementar load balancing**
5. **Adicionar cache Redis**

---

**Dica**: Sempre use `docker-compose down -v` para limpar volumes quando necessário. 