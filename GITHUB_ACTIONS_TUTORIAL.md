# Tutorial GitHub Actions - CI/CD Pipeline

## 🔄 Introdução ao GitHub Actions

Este tutorial explica como configurar e usar GitHub Actions para automatizar o processo de CI/CD (Continuous Integration/Continuous Deployment) da API de Posts.

## 📋 Pré-requisitos

- Conta no GitHub
- Repositório configurado
- Docker instalado (para testes locais)
- Node.js instalado (para desenvolvimento)

## 🚀 Configuração Inicial

### 1. Estrutura do Workflow

O arquivo `.github/workflows/ci-cd.yml` define o pipeline completo:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    # ... configuração do job de testes
```

### 2. Triggers do Workflow

- **Push**: Executa quando código é enviado para `main` ou `develop`
- **Pull Request**: Executa quando PR é criado para `main`

## 🧪 Job de Testes

### Configuração do Ambiente

```yaml
test:
  runs-on: ubuntu-latest
  
  services:
    postgres:
      image: postgres:15
      env:
        POSTGRES_PASSWORD: postgres
        POSTGRES_DB: posts_api_test
      options: >-
        --health-cmd pg_isready
        --health-interval 10s
        --health-timeout 5s
        --health-retries 5
      ports:
        - 5432:5432
```

### Passos do Job de Testes

1. **Checkout do Código**
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

2. **Setup do Node.js**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
```

3. **Instalação de Dependências**
```yaml
- name: Install dependencies
  run: npm ci
```

4. **Linting**
```yaml
- name: Run linting
  run: npm run lint
```

5. **Execução de Testes**
```yaml
- name: Run tests
  run: npm run test:coverage
  env:
    NODE_ENV: test
    DB_HOST: localhost
    DB_PORT: 5432
    DB_NAME: posts_api_test
    DB_USER: postgres
    DB_PASSWORD: postgres
```

6. **Upload de Cobertura**
```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
```

## 🏗️ Job de Build

### Construção da Aplicação

```yaml
build:
  needs: test
  runs-on: ubuntu-latest
  
  steps:
  - name: Checkout code
    uses: actions/checkout@v4

  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '18'
      cache: 'npm'

  - name: Install dependencies
    run: npm ci

  - name: Build application
    run: npm run build

  - name: Upload build artifacts
    uses: actions/upload-artifact@v3
    with:
      name: build-files
      path: dist/
```

## 🐳 Job de Docker

### Construção da Imagem Docker

```yaml
docker:
  needs: build
  runs-on: ubuntu-latest
  
  steps:
  - name: Checkout code
    uses: actions/checkout@v4

  - name: Set up Docker Buildx
    uses: docker/setup-buildx-action@v2

  - name: Login to Docker Hub
    uses: docker/login-action@v2
    with:
      username: ${{ secrets.DOCKER_USERNAME }}
      password: ${{ secrets.DOCKER_PASSWORD }}

  - name: Build and push Docker image
    uses: docker/build-push-action@v4
    with:
      context: .
      push: true
      tags: |
        ${{ secrets.DOCKER_USERNAME }}/posts-api:latest
        ${{ secrets.DOCKER_USERNAME }}/posts-api:${{ github.sha }}
```

## 🚀 Job de Deploy

### Deploy Automático

```yaml
deploy:
  needs: docker
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  
  steps:
  - name: Deploy to production
    run: |
      echo "Deploying to production..."
      # Adicione aqui os comandos de deploy
```

## 🔧 Configuração de Secrets

### Secrets Necessários

Configure os seguintes secrets no seu repositório:

1. **DOCKER_USERNAME**: Seu usuário do Docker Hub
2. **DOCKER_PASSWORD**: Sua senha do Docker Hub
3. **DEPLOY_KEY**: Chave SSH para deploy
4. **ENVIRONMENT_VARS**: Variáveis de ambiente de produção

### Como Configurar Secrets

1. Vá para seu repositório no GitHub
2. Clique em **Settings**
3. Clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**
5. Adicione cada secret

## 📊 Monitoramento do Pipeline

### Status Checks

- **Testes**: Verifica se todos os testes passam
- **Build**: Verifica se a aplicação compila
- **Docker**: Verifica se a imagem é construída
- **Deploy**: Verifica se o deploy foi bem-sucedido

### Badges

Adicione badges ao seu README:

```markdown
![CI/CD](https://github.com/seu-usuario/posts-api/workflows/CI%2FCD%20Pipeline/badge.svg)
![Test Coverage](https://codecov.io/gh/seu-usuario/posts-api/branch/main/graph/badge.svg)
```

## 🔍 Debugging do Pipeline

### Logs Detalhados

```yaml
- name: Debug information
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Working directory: $(pwd)"
    echo "Files in directory: $(ls -la)"
```

### Testes Locais

```bash
# Testar workflow localmente
act -j test

# Executar apenas um job
act -j build
```

## 🛠️ Otimizações

### Cache de Dependências

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Cache do Docker

```yaml
- name: Cache Docker layers
  uses: actions/cache@v3
  with:
    path: /tmp/.buildx-cache
    key: ${{ runner.os }}-buildx-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-buildx-
```

### Paralelização

```yaml
jobs:
  test-unit:
    runs-on: ubuntu-latest
    # Testes unitários

  test-integration:
    runs-on: ubuntu-latest
    # Testes de integração

  build:
    needs: [test-unit, test-integration]
    runs-on: ubuntu-latest
    # Build da aplicação
```

## 🔒 Segurança

### Scanning de Vulnerabilidades

```yaml
- name: Run security scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high
```

### Verificação de Dependências

```yaml
- name: Check for vulnerabilities
  run: npm audit --audit-level=high
```

## 📈 Métricas e Relatórios

### Cobertura de Testes

```yaml
- name: Generate coverage report
  run: npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

### Análise de Código

```yaml
- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## 🚨 Notificações

### Slack Notifications

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#deployments'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

### Email Notifications

```yaml
- name: Send email notification
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 587
    username: ${{ secrets.MAIL_USERNAME }}
    password: ${{ secrets.MAIL_PASSWORD }}
    subject: "Deploy ${{ github.sha }}"
    to: team@company.com
    from: CI/CD Pipeline
    body: "Deploy completed successfully!"
  if: success()
```

## 🔄 Workflows Avançados

### Deploy por Ambiente

```yaml
deploy-staging:
  needs: docker
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/develop'
  
deploy-production:
  needs: docker
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
```

### Deploy Manual

```yaml
deploy-manual:
  runs-on: ubuntu-latest
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Testes falhando**
```bash
# Verificar logs detalhados
npm test -- --verbose
```

2. **Build falhando**
```bash
# Verificar se TypeScript compila
npm run build
```

3. **Docker build falhando**
```bash
# Testar Docker localmente
docker build -t posts-api .
```

### Debugging

```yaml
- name: Debug environment
  run: |
    echo "GitHub SHA: ${{ github.sha }}"
    echo "GitHub Ref: ${{ github.ref }}"
    echo "GitHub Event: ${{ github.event_name }}"
```

## 📚 Recursos Adicionais

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Examples](https://github.com/actions/examples)
- [Docker GitHub Actions](https://github.com/docker/build-push-action)
- [Codecov GitHub Action](https://github.com/codecov/codecov-action)

## 🎯 Próximos Passos

1. **Configurar deploy automático para produção**
2. **Adicionar testes de performance**
3. **Implementar rollback automático**
4. **Configurar monitoramento de deploy**
5. **Adicionar testes de segurança**

---

**Dica**: Sempre teste seus workflows localmente antes de fazer push para o repositório. 