/**
 * Teste final da importação
 */
const XLSX = require('xlsx');
const FormData = require('form-data');
const fs = require('fs');
const http = require('http');

async function testFinalImport() {
  try {
    console.log('🚀 Teste final da importação...');
    
    // 1. Login
    const loginData = JSON.stringify({
      email: 'admin@rhplus.com',
      password: 'admin123'
    });
    
    const loginResponse = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginData)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data: data });
          }
        });
      });
      
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });
    
    if (loginResponse.status !== 200) {
      console.log('❌ Login falhou:', loginResponse.data);
      return;
    }
    
    console.log('✅ Login bem-sucedido');
    const token = loginResponse.data.token;
    
    // 2. Verificar arquivo
    const filePath = 'E:\\APP\\novo-projeto-RH\\docs\\relatorio-profissional.xls';
    
    if (!fs.existsSync(filePath)) {
      console.log('❌ Arquivo não encontrado');
      return;
    }
    
    console.log('📁 Arquivo encontrado, enviando...');
    
    // 3. Upload
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    
    const uploadResponse = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/import/employees',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          ...form.getHeaders()
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data: data });
          }
        });
      });
      
      req.on('error', reject);
      form.pipe(req);
    });
    
    console.log('📡 Status:', uploadResponse.status);
    
    if (uploadResponse.status === 200) {
      console.log('🎉 SUCESSO!');
      console.log('📊 Resultado:', {
        total: uploadResponse.data.total,
        importados: uploadResponse.data.importados,
        erros: uploadResponse.data.erros?.length || 0
      });
    } else {
      console.log('❌ ERRO:', uploadResponse.data);
      
      // Se há erros, mostrar os primeiros 3
      if (uploadResponse.data.detalhes) {
        console.log('\n📋 Primeiros erros:');
        uploadResponse.data.detalhes.slice(0, 3).forEach(erro => {
          console.log(`   Linha ${erro.linha}: ${erro.erro}`);
        });
      }
    }
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

testFinalImport();