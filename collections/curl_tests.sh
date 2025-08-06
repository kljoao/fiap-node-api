#!/bin/bash

# Script de Testes da API Posts
# Execute: bash curl_tests.sh

echo "🚀 Iniciando testes da API Posts..."
echo "=================================="

# Variáveis
BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/posts"

echo ""
echo "1. 🔍 Testando Health Check..."
curl -X GET "$BASE_URL/health" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "2. 📋 Listando todos os posts..."
curl -X GET "$API_URL?page=1&limit=5" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "3. 🔍 Buscando post por ID (ID: 1)..."
curl -X GET "$API_URL/1" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "4. 🔍 Buscando posts por palavra-chave (tecnologia)..."
curl -X GET "$API_URL/search?keyword=tecnologia&page=1&limit=3" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "5. ➕ Criando novo post..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Post de Teste via cURL",
    "conteudo": "Este post foi criado usando cURL para testar a API. Contém informações sobre desenvolvimento web e boas práticas de programação.",
    "autor": "João Silva",
    "tags": ["teste", "curl", "api", "desenvolvimento"]
  }' \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "6. ✏️ Atualizando post (ID: 1)..."
curl -X PUT "$API_URL/1" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Post Atualizado via cURL",
    "conteudo": "Este post foi atualizado usando cURL. Agora contém informações mais detalhadas sobre a API e seus endpoints.",
    "autor": "João Silva Atualizado",
    "tags": ["atualizado", "curl", "api", "teste"]
  }' \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "7. 📋 Listando posts novamente (para verificar mudanças)..."
curl -X GET "$API_URL?page=1&limit=5" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "8. 🗑️ Excluindo post (ID: 1)..."
curl -X DELETE "$API_URL/1" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "9. 📋 Listando posts finais (para confirmar exclusão)..."
curl -X GET "$API_URL?page=1&limit=5" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "✅ Testes concluídos!"
echo "==================================" 