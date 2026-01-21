@echo off
echo ========================================
echo Iniciando Sistema RH Plus
echo ========================================
echo.

REM Matar processos node anteriores
echo Limpando processos Node.js anteriores...
taskkill /F /IM node.exe >nul 2>&1

REM Aguardar liberação das portas
timeout /t 2 /nobreak >nul

REM Iniciar backend em nova janela
echo Iniciando Backend (porta 3000)...
start "RH Plus - Backend" cmd /k "cd /d E:\APP\novo-projeto-RH\backend && node src/server.js"

REM Aguardar backend inicializar
timeout /t 3 /nobreak >nul

REM Iniciar frontend em nova janela
echo Iniciando Frontend (porta 3001)...
start "RH Plus - Frontend" cmd /k "cd /d E:\APP\novo-projeto-RH\frontend && node server.js"

REM Aguardar frontend inicializar
timeout /t 2 /nobreak >nul

REM Abrir navegador
echo Abrindo navegador...
start http://localhost:3001

echo.
echo ========================================
echo Sistema iniciado com sucesso!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3001
echo ========================================
echo.
echo Mantenha as janelas do Backend e Frontend abertas.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
