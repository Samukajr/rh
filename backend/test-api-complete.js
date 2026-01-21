/**
 * Teste completo da API de importação
 */
const FormData = require('form-data');
const fs = require('fs');
const https = require('https');
const http = require('http');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const protocol = options.port === 443 ? https : http;
    
    const req = protocol.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

async function testFullImport() {
  try {
    console.log('🚀 Iniciando teste completo da importação...');
    
    // 1. Login
    console.log('\n🔑 Fazendo login...');
    const loginData = JSON.stringify({
      email: 'admin@rhplus.com',
      password: 'admin123'
    });
    
    const loginOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };
    
    const loginResponse = await makeRequest(loginOptions, loginData);
    
    if (loginResponse.status !== 200) {
      throw new Error(`Login falhou: ${loginResponse.status} - ${JSON.stringify(loginResponse.data)}`);
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');
    
    // 2. Upload do arquivo
    console.log('\n📤 Enviando arquivo Excel...');
    
    const form = new FormData();
    const filePath = 'E:\\APP\\novo-projeto-RH\\docs\\relatorio-profissional.xls';
    
    if (!fs.existsSync(filePath)) {
      throw new Error('Arquivo não encontrado: ' + filePath);
    }
    
    form.append('file', fs.createReadStream(filePath));
    
    const uploadOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/import/employees',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...form.getHeaders()
      }
    };
    
    const uploadResponse = await new Promise((resolve, reject) => {
      const req = http.request(uploadOptions, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, data: responseData });
          }
        });
      });
      
      req.on('error', reject);
      form.pipe(req);
    });
    
    console.log('📡 Status da importação:', uploadResponse.status);
    console.log('📋 Resultado:');
    console.log(JSON.stringify(uploadResponse.data, null, 2));
    
    if (uploadResponse.status === 200) {
      console.log('\n✅ SUCESSO! Importação realizada com êxito!');
    } else {
      console.log('\n❌ ERRO na importação');
    }
    
  } catch (error) {
    console.error('💥 Erro no teste:', error.message);
  }
}

testFullImport();