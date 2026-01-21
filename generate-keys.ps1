# ================================================
# SCRIPT DE PREPARAÇÃO PARA DEPLOY RAILWAY
# ================================================
# Este script gera as chaves de segurança necessárias

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 GERADOR DE CHAVES - SISTEMA RH PLUS                   ║" -ForegroundColor Cyan
Write-Host "║  Gerando chaves seguras para produção...                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Gerar JWT_SECRET (32 caracteres aleatórios)
$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
$jwt_secret = -join ((1..64) | % { $chars[(Get-Random -Maximum $chars.Length)] })

# Gerar JWT_REFRESH_SECRET
$jwt_refresh = -join ((1..64) | % { $chars[(Get-Random -Maximum $chars.Length)] })

Write-Host "✅ JWT_SECRET gerado com sucesso:" -ForegroundColor Green
Write-Host "$jwt_secret" -ForegroundColor Yellow
Write-Host ""

Write-Host "✅ JWT_REFRESH_SECRET gerado com sucesso:" -ForegroundColor Green
Write-Host "$jwt_refresh" -ForegroundColor Yellow
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  📋 PRÓXIMOS PASSOS                                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Acesse: https://railway.app" -ForegroundColor White
Write-Host "2. Vá para seu projeto → Variables" -ForegroundColor White
Write-Host "3. Copie as chaves acima e cole nas variáveis Railway:" -ForegroundColor White
Write-Host "   - JWT_SECRET" -ForegroundColor Magenta
Write-Host "   - JWT_REFRESH_SECRET" -ForegroundColor Magenta
Write-Host ""
Write-Host "4. Clique em 'Save'" -ForegroundColor White
Write-Host "5. Seu projeto vai fazer redeploy automaticamente! 🚀" -ForegroundColor Green
Write-Host ""

# Copiar para clipboard (opcional no Windows)
$chaves = @"
JWT_SECRET=$jwt_secret
JWT_REFRESH_SECRET=$jwt_refresh
"@

Write-Host "📋 Chaves copiadas para clipboard!" -ForegroundColor Green
$chaves | Set-Clipboard

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
