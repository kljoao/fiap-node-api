# Script de Testes da API Posts - PowerShell
# Execute: .\powershell_tests.ps1

Write-Host "🚀 Iniciando testes da API Posts..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Variáveis
$BASE_URL = "http://localhost:3000"
$API_URL = "$BASE_URL/posts"

# Função para fazer requisições HTTP
function Invoke-APITest {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [string]$Description
    )
    
    Write-Host ""
    Write-Host $Description -ForegroundColor Yellow
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    $params = @{
        Method = $Method
        Uri = $Url
        Headers = $headers
    }
    
    if ($Body) {
        $params.Body = $Body
    }
    
    try {
        $response = Invoke-RestMethod @params
        Write-Host "✅ Sucesso!" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 10
    }
    catch {
        Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode
            Write-Host "Status Code: $statusCode" -ForegroundColor Red
        }
    }
}

# 1. Health Check
Invoke-APITest -Method "GET" -Url "$BASE_URL/health" -Description "1. 🔍 Testando Health Check..."

# 2. Listar todos os posts
Invoke-APITest -Method "GET" -Url "$API_URL?page=1&limit=5" -Description "2. 📋 Listando todos os posts..."

# 3. Buscar post por ID
Invoke-APITest -Method "GET" -Url "$API_URL/1" -Description "3. 🔍 Buscando post por ID (ID: 1)..."

# 4. Buscar posts por palavra-chave
Invoke-APITest -Method "GET" -Url "$API_URL/search?keyword=tecnologia&page=1&limit=3" -Description "4. 🔍 Buscando posts por palavra-chave (tecnologia)..."

# 5. Criar novo post
$newPost = @{
    titulo = "Post de Teste via PowerShell"
    conteudo = "Este post foi criado usando PowerShell para testar a API. Contém informações sobre desenvolvimento web e boas práticas de programação."
    autor = "João Silva"
    tags = @("teste", "powershell", "api", "desenvolvimento")
} | ConvertTo-Json

Invoke-APITest -Method "POST" -Url $API_URL -Body $newPost -Description "5. ➕ Criando novo post..."

# 6. Atualizar post
$updatePost = @{
    titulo = "Post Atualizado via PowerShell"
    conteudo = "Este post foi atualizado usando PowerShell. Agora contém informações mais detalhadas sobre a API e seus endpoints."
    autor = "João Silva Atualizado"
    tags = @("atualizado", "powershell", "api", "teste")
} | ConvertTo-Json

Invoke-APITest -Method "PUT" -Url "$API_URL/1" -Body $updatePost -Description "6. ✏️ Atualizando post (ID: 1)..."

# 7. Listar posts novamente
Invoke-APITest -Method "GET" -Url "$API_URL?page=1&limit=5" -Description "7. 📋 Listando posts novamente (para verificar mudanças)..."

# 8. Excluir post
Invoke-APITest -Method "DELETE" -Url "$API_URL/1" -Description "8. 🗑️ Excluindo post (ID: 1)..."

# 9. Listar posts finais
Invoke-APITest -Method "GET" -Url "$API_URL?page=1&limit=5" -Description "9. 📋 Listando posts finais (para confirmar exclusão)..."

Write-Host ""
Write-Host "✅ Testes concluídos!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green 