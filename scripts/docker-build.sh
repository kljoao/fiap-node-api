#!/bin/bash

# Script para build e deploy dos containers Docker
# Uso: ./scripts/docker-build.sh [dev|prod]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado. Por favor, instale o Docker primeiro."
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    fi
    
    log "Docker e Docker Compose encontrados"
}

# Parar containers existentes
stop_containers() {
    log "Parando containers existentes..."
    docker-compose down --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down --remove-orphans 2>/dev/null || true
}

# Limpar imagens antigas
cleanup_images() {
    log "Limpando imagens antigas..."
    docker image prune -f
    docker system prune -f
}

# Build para desenvolvimento
build_dev() {
    log "Iniciando build para desenvolvimento..."
    
    # Verificar se arquivo .env existe
    if [ ! -f .env ]; then
        warning "Arquivo .env não encontrado. Copiando de .env.example..."
        cp .env.example .env
    fi
    
    # Build das imagens
    log "Construindo imagens Docker..."
    docker-compose -f docker-compose.dev.yml build --no-cache
    
    # Iniciar containers
    log "Iniciando containers de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml up -d
    
    # Aguardar serviços ficarem prontos
    log "Aguardando serviços ficarem prontos..."
    sleep 10
    
    # Verificar status
    log "Verificando status dos containers..."
    docker-compose -f docker-compose.dev.yml ps
    
    log "✅ Ambiente de desenvolvimento iniciado!"
    log "🌐 API disponível em: http://localhost:3000"
    log "📊 Banco de dados: localhost:5433"
    log "📝 Logs: docker-compose -f docker-compose.dev.yml logs -f"
}

# Build para produção
build_prod() {
    log "Iniciando build para produção..."
    
    # Verificar se arquivo .env existe
    if [ ! -f .env ]; then
        error "Arquivo .env não encontrado. Crie o arquivo .env baseado no .env.example"
    fi
    
    # Build das imagens
    log "Construindo imagens Docker para produção..."
    docker-compose build --no-cache
    
    # Iniciar containers
    log "Iniciando containers de produção..."
    docker-compose up -d
    
    # Aguardar serviços ficarem prontos
    log "Aguardando serviços ficarem prontos..."
    sleep 15
    
    # Verificar status
    log "Verificando status dos containers..."
    docker-compose ps
    
    log "✅ Ambiente de produção iniciado!"
    log "🌐 API disponível em: http://localhost:3000"
    log "📊 Banco de dados: localhost:5432"
    log "📝 Logs: docker-compose logs -f"
}

# Função principal
main() {
    local environment=${1:-dev}
    
    log "🚀 Iniciando build e deploy da API Posts..."
    
    # Verificar Docker
    check_docker
    
    # Parar containers existentes
    stop_containers
    
    # Limpar imagens antigas
    cleanup_images
    
    # Build baseado no ambiente
    case $environment in
        "dev"|"development")
            build_dev
            ;;
        "prod"|"production")
            build_prod
            ;;
        *)
            error "Ambiente inválido. Use 'dev' ou 'prod'"
            ;;
    esac
    
    log "🎉 Deploy concluído com sucesso!"
}

# Executar função principal
main "$@" 