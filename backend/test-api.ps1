// Teste da API RHPlus com PowerShell
// Execute este arquivo com: pwsh test-api.ps1

$baseUrl = "http://localhost:3000"

Write-Host "🧪 Iniciando testes da API RHPlus..." -ForegroundColor Green
Write-Host ""

# 1. Teste Health Check
Write-Host "1️⃣ Testando Health Check..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Health Check: OK" -ForegroundColor Green
    Write-Host "Status: $($healthResponse.status)" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "❌ Erro no Health Check: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Teste de Registro
Write-Host "2️⃣ Testando Registro de Usuário..." -ForegroundColor Cyan
$userData = @{
    firstName = "João"
    lastName = "Silva"
    email = "joao.silva@rhplus.com"
    password = "123456"
    cpf = "12345678901"
    department = "TI"
    position = "Desenvolvedor"
    role = "employee"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $userData -ContentType "application/json"
    Write-Host "✅ Usuário registrado com sucesso!" -ForegroundColor Green
    $token = $registerResponse.token
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "ℹ️ Usuário já existe, tentando login..." -ForegroundColor Yellow
    } else {
        Write-Host "❌ Erro no registro: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# 3. Teste de Login
Write-Host "3️⃣ Testando Login..." -ForegroundColor Cyan
$loginData = @{
    email = "joao.silva@rhplus.com"
    password = "123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
    $token = $loginResponse.token
    Write-Host ""
} catch {
    Write-Host "❌ Erro no login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Teste de Perfil
Write-Host "4️⃣ Testando Perfil do Usuário..." -ForegroundColor Cyan
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/profile" -Method Get -Headers $headers
    Write-Host "✅ Perfil obtido: $($profileResponse.user.firstName) $($profileResponse.user.lastName)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Erro ao obter perfil: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5. Teste de Funcionários
Write-Host "5️⃣ Testando Listagem de Funcionários..." -ForegroundColor Cyan
try {
    $employeesResponse = Invoke-RestMethod -Uri "$baseUrl/api/employees" -Method Get -Headers $headers
    Write-Host "✅ Lista de funcionários obtida: $($employeesResponse.count) funcionário(s)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Erro ao obter funcionários: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Todos os testes principais foram executados com sucesso!" -ForegroundColor Green
Write-Host "🚀 API RHPlus está funcionando corretamente!" -ForegroundColor Green