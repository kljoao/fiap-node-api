# 🐳 Docker e GitHub Actions - Guia Completo

## 📋 Índice
1. [Containerização com Docker](#containerização-com-docker)
2. [GitHub Actions CI/CD](#github-actions-cicd)
3. [Ambientes de Deploy](#ambientes-de-deploy)
4. [Comandos Úteis](#comandos-úteis)
5. [Troubleshooting](#troubleshooting)

---

## 🐳 Containerização com Docker

### Estrutura de Arquivos Docker

```
📁 projeto-fiap/
├── 📄 Dockerfile              # Build de produção (multi-stage)
├── 📄 Dockerfile.dev          # Build de desenvolvimento
├── 📄 docker-compose.yml      # Produção
├── 📄 docker-compose.dev.yml  # Desenvolvimento
└── 📁 scripts/
    └── 📄 docker-build.sh     # Script de automação
```

### 🏗️ Dockerfile de Produção

**Características:**
- ✅ Multi-stage build para otimização
- ✅ Usuário não-root para segurança
- ✅ Health check automático
- ✅ Cache de dependências
- ✅ Imagem otimizada

```dockerfile
# Multi-stage build para otimização
FROM node:18-alpine AS builder
# ... (ver Dockerfile completo)

# Stage de produção
FROM node:18-alpine AS production
# ... (ver Dockerfile completo)
```

### 🔧 Dockerfile de Desenvolvimento

**Características:**
- ✅ Hot reload com ts-node-dev
- ✅ Todas as dependências de desenvolvimento
- ✅ Volumes para desenvolvimento local

### 🚀 Comandos Docker

#### Desenvolvimento
```bash
# Iniciar ambiente de desenvolvimento
npm run docker:dev
# ou
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar ambiente
docker-compose -f docker-compose.dev.yml down
```

#### Produção
```bash
# Build da imagem
npm run docker:build
# ou
docker build -t posts-api .

# Executar container
npm run docker:run
# ou
docker run -p 3000:3000 posts-api

# Usando docker-compose
npm run docker:prod
# ou
docker-compose up -d
```

#### Script de Automação
```bash
# Build e deploy automático
./scripts/docker-build.sh dev    # Desenvolvimento
./scripts/docker-build.sh prod   # Produção
```

---

## 🔄 GitHub Actions CI/CD

### Estrutura do Workflow

```
📁 .github/workflows/
├── 📄 ci-cd.yml           # Pipeline principal
└── 📄 dependabot.yml      # Automação de dependências

📁 .github/
└── 📄 dependabot.yml      # Configuração do dependabot
```

### 🎯 Jobs do Pipeline

#### 1. **Security** 🔒
- ✅ Scan de vulnerabilidades com Trivy
- ✅ Upload para GitHub Security tab
- ✅ Análise de segurança automática

#### 2. **Test** 🧪
- ✅ Testes unitários com Jest
- ✅ Cobertura de código
- ✅ Type checking
- ✅ Linting
- ✅ PostgreSQL em container

#### 3. **Build & Push** 📦
- ✅ Build multi-platform (amd64, arm64)
- ✅ Push para GitHub Container Registry
- ✅ Cache otimizado
- ✅ Tags automáticas

#### 4. **Deploy** 🚀
- ✅ Staging (branch develop)
- ✅ Production (branch main)
- ✅ Ambientes protegidos
- ✅ Notificações automáticas

### 🔧 Configuração de Secrets

**Obrigatórios:**
```bash
# GitHub Secrets necessários
GITHUB_TOKEN              # Automático
DOCKER_USERNAME           # Para Docker Hub (opcional)
DOCKER_PASSWORD           # Para Docker Hub (opcional)
```

### 📊 Métricas e Cobertura

- **Cobertura mínima:** 20%
- **Relatórios:** Codecov
- **Comentários:** Automáticos em PRs
- **Dashboards:** GitHub Security

---

## 🌍 Ambientes de Deploy

### Staging (Desenvolvimento)
- **Branch:** `develop`
- **Trigger:** Push para develop
- **Ambiente:** Staging
- **URL:** `https://staging-api.example.com`

### Production (Produção)
- **Branch:** `main`
- **Trigger:** Push para main
- **Ambiente:** Production
- **URL:** `https://api.example.com`

### Workflow Manual
```bash
# Deploy manual via GitHub Actions
# Vá para: Actions > CI/CD Pipeline > Run workflow
# Selecione: staging ou production
```

---

## 🛠️ Comandos Úteis

### Docker
```bash
# Ver containers rodando
docker ps

# Ver logs de um container
docker logs posts_api_app

# Executar comando dentro do container
docker exec -it posts_api_app sh

# Ver uso de recursos
docker stats

# Limpar recursos não utilizados
docker system prune -a
```

### GitHub Actions
```bash
# Ver status dos workflows
gh run list

# Ver logs de um workflow
gh run view <run-id>

# Cancelar workflow
gh run cancel <run-id>

# Re-run workflow
gh run rerun <run-id>
```

### Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Executar testes
npm test

# Build para produção
npm run build

# Verificar tipos
npm run type-check
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. **Container não inicia**
```bash
# Verificar logs
docker logs posts_api_app

# Verificar se a porta está livre
netstat -ano | findstr :3000

# Reiniciar container
docker restart posts_api_app
```

#### 2. **Erro de conexão com banco**
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Testar conexão
docker exec posts_api_db pg_isready -U postgres

# Ver logs do banco
docker logs posts_api_db
```

#### 3. **GitHub Actions falhando**
```bash
# Verificar secrets
# Settings > Secrets and variables > Actions

# Verificar permissões
# Settings > Actions > General > Workflow permissions

# Verificar branch protection
# Settings > Branches > Add rule
```

#### 4. **Build lento**
```bash
# Limpar cache do Docker
docker builder prune -a

# Usar cache do GitHub Actions
# (já configurado no workflow)

# Otimizar Dockerfile
# (já implementado com multi-stage)
```

### 🔍 Debug

#### Docker
```bash
# Debug container
docker run -it --rm posts-api sh

# Ver camadas da imagem
docker history posts-api

# Analisar imagem
docker inspect posts-api
```

#### GitHub Actions
```bash
# Habilitar debug
# Adicionar secret: ACTIONS_STEP_DEBUG = true

# Ver artifacts
gh run download <run-id>

# Ver workflow runs
gh run list --workflow="CI/CD Pipeline"
```

---

## 📚 Recursos Adicionais

### Documentação
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)

### Ferramentas Recomendadas
- **Docker Desktop:** Interface gráfica
- **Docker Compose:** Orquestração
- **GitHub CLI:** Interface de linha de comando
- **VS Code Docker:** Extensão para Docker

### Monitoramento
- **GitHub Security:** Vulnerabilidades
- **Codecov:** Cobertura de código
- **Docker Hub:** Registro de imagens
- **GitHub Packages:** Container Registry

---

## 🎯 Próximos Passos

1. **Configurar ambientes de produção**
2. **Implementar monitoramento**
3. **Adicionar testes de integração**
4. **Configurar backup automático**
5. **Implementar rollback automático**

---

*Última atualização: $(date)* 