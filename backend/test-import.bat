@echo off
echo Testando importacao com arquivo real...

echo.
echo 1. Fazendo login...
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@rhplus.com\",\"password\":\"admin123\"}" ^
  > login_result.txt

echo.
echo 2. Resultado do login:
type login_result.txt

echo.
echo 3. Extraindo token...
for /f "tokens=2 delims=:, " %%a in ('findstr "token" login_result.txt') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN:}=%

echo Token: %TOKEN%

echo.
echo 4. Testando importacao...
curl -X POST http://localhost:3000/api/import/employees ^
  -H "Authorization: Bearer %TOKEN%" ^
  -F "file=@E:\APP\novo-projeto-RH\docs\relatorio-profissional.xls" ^
  -v

echo.
echo Teste concluido!

del login_result.txt
pause