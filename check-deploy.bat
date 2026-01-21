@echo off
REM ================================================
REM SCRIPT DE PREPARAÇÃO PARA DEPLOY RAILWAY
REM ================================================

echo.
echo ======================================================
echo     VERIFICANDO CONFIGURACAO PARA DEPLOY
echo ======================================================
echo.

REM Verificar Git
git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Git instalado
) else (
    echo [ERRO] Git nao encontrado. Instale em: https://git-scm.com
    pause
    exit /b 1
)

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js instalado: %NODE_VERSION%
) else (
    echo [ERRO] Node.js nao encontrado. Instale em: https://nodejs.org
    pause
    exit /b 1
)

REM Verificar npm
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] npm instalado
) else (
    echo [ERRO] npm nao encontrado
    pause
    exit /b 1
)

REM Verificar .env.example
if exist .env.example (
    echo [OK] Arquivo .env.example encontrado
) else (
    echo [ERRO] Arquivo .env.example nao encontrado
    pause
    exit /b 1
)

REM Verificar railway.json
if exist railway.json (
    echo [OK] Arquivo railway.json encontrado
) else (
    echo [ERRO] Arquivo railway.json nao encontrado
    pause
    exit /b 1
)

REM Verificar repositorio Git
if exist .git (
    echo [OK] Repositorio Git encontrado
) else (
    echo [ERRO] Repositorio Git nao encontrado
    pause
    exit /b 1
)

echo.
echo ======================================================
echo     TUDO PRONTO PARA DEPLOY!
echo ======================================================
echo.
echo Proximos passos:
echo 1. Crie conta em: https://github.com
echo 2. Envie o projeto: git push -u origin main
echo 3. Acesse: https://railway.app
echo 4. Conecte seu repositorio GitHub
echo 5. Configure PostgreSQL e variaveis de ambiente
echo.
echo Para mais detalhes, leia: DEPLOY_RAILWAY_GUIA.md
echo.
pause
