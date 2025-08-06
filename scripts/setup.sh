#!/bin/bash

# Script de Setup - API de Posts
# Este script configura o ambiente de desenvolvimento

set -e

echo "🚀 Iniciando setup da API de Posts..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar se Node.js está instalado
print_step "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado. Por favor, instale o Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js versão 18+ é necessária. Versão atual: $(node --version)"
    exit 1
fi

print_message "Node.js $(node --version) encontrado"

# Verificar se npm está instalado
print_step "Verificando npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm não está instalado"
    exit 1
fi

print_message "npm $(npm --version) encontrado"

# Verificar se Docker está instalado (opcional)
print_step "Verificando Docker..."
if command -v docker &> /dev/null; then
    print_message "Docker $(docker --version) encontrado"
    DOCKER_AVAILABLE=true
else
    print_warning "Docker não encontrado. Você pode usar Docker para executar a aplicação"
    DOCKER_AVAILABLE=false
fi

# Verificar se PostgreSQL está instalado
print_step "Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    print_message "PostgreSQL encontrado"
    PSQL_AVAILABLE=true
else
    print_warning "PostgreSQL não encontrado. Você pode usar Docker para o banco de dados"
    PSQL_AVAILABLE=false
fi

# Instalar dependências
print_step "Instalando dependências..."
npm install

print_message "Dependências instaladas com sucesso"

# Configurar arquivo .env
print_step "Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
    cp .env.example .env
    print_message "Arquivo .env criado a partir do .env.example"
else
    print_message "Arquivo .env já existe"
fi

# Compilar TypeScript
print_step "Compilando TypeScript..."
npm run build

print_message "TypeScript compilado com sucesso"

# Configurar banco de dados
if [ "$PSQL_AVAILABLE" = true ]; then
    print_step "Configurando banco de dados PostgreSQL..."
    
    # Tentar criar banco de dados
    if createdb posts_api 2>/dev/null; then
        print_message "Banco de dados 'posts_api' criado"
    else
        print_warning "Banco de dados 'posts_api' já existe ou não foi possível criar"
    fi
    
    # Executar script de inicialização
    if psql -d posts_api -f scripts/init.sql >/dev/null 2>&1; then
        print_message "Script de inicialização executado"
    else
        print_warning "Não foi possível executar o script de inicialização"
    fi
else
    print_warning "PostgreSQL não está disponível. Use Docker para o banco de dados"
fi

# Executar testes
print_step "Executando testes..."
if npm test >/dev/null 2>&1; then
    print_message "Testes executados com sucesso"
else
    print_warning "Alguns testes falharam. Verifique a configuração"
fi

# Verificar cobertura de testes
print_step "Verificando cobertura de testes..."
if npm run test:coverage >/dev/null 2>&1; then
    print_message "Cobertura de testes gerada"
else
    print_warning "Não foi possível gerar cobertura de testes"
fi

# Mostrar informações finais
echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo ""

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "🐳 Para executar com Docker:"
    echo "   docker-compose up -d"
    echo ""
fi

echo "🚀 Para executar localmente:"
echo "   npm run dev"
echo ""
echo "🧪 Para executar testes:"
echo "   npm test"
echo ""
echo "📊 Para verificar cobertura:"
echo "   npm run test:coverage"
echo ""
echo "🔧 Para linting:"
echo "   npm run lint"
echo ""

if [ "$PSQL_AVAILABLE" = false ] && [ "$DOCKER_AVAILABLE" = false ]; then
    echo "⚠️  ATENÇÃO:"
    echo "   PostgreSQL não está disponível localmente."
    echo "   Recomendamos instalar PostgreSQL ou usar Docker."
    echo ""
fi

echo "📚 Documentação:"
echo "   - README.md - Documentação principal"
echo "   - API_DOCUMENTATION.md - Documentação da API"
echo "   - DOCKER_TUTORIAL.md - Tutorial Docker"
echo "   - GITHUB_ACTIONS_TUTORIAL.md - Tutorial CI/CD"
echo "   - CHALLENGES.md - Desafios enfrentados"
echo ""

echo "🌐 A API estará disponível em: http://localhost:3000"
echo "🔍 Health check: http://localhost:3000/health"
echo ""

print_message "Setup concluído! 🚀" 