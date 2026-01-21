/**
 * Teste da importação com arquivo real do usuário
 */
const fs = require('fs');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRealImport() {
  try {
    console.log('🚀 Testando importação com arquivo real...');
    
    const filePath = 'E:\\APP\\novo-projeto-RH\\docs\\relatorio-profissional.xls';
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.log('❌ Arquivo não encontrado:', filePath);
      return;
    }
    
    console.log('📁 Arquivo encontrado, preparando upload...');
    
    // Primeiro fazer login
    console.log('🔑 Fazendo login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@rhplus.com',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Erro no login:', loginResponse.status);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login realizado com sucesso');
    
    const token = loginData.token;
    
    // Preparar FormData com o arquivo
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    
    console.log('📤 Enviando arquivo para importação...');
    
    // Fazer upload do arquivo
    const importResponse = await fetch('http://localhost:3000/api/import/employees', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...form.getHeaders()
      },
      body: form
    });
    
    console.log('📡 Status da resposta:', importResponse.status);
    
    const result = await importResponse.text();
    console.log('📋 Resultado da importação:');
    
    try {
      const jsonResult = JSON.parse(result);
      console.log(JSON.stringify(jsonResult, null, 2));
    } catch (e) {
      console.log('Resposta não é JSON:', result);
    }
    
  } catch (error) {
    console.error('💥 Erro no teste:', error);
  }
}

// Executar teste
testRealImport();