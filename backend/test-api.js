const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Teste simples da API
async function testAPI() {
  try {
    console.log('🧪 Iniciando testes da API RHPlus...\n');

    // 1. Teste Health Check
    console.log('1️⃣ Testando Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', health.data);
    console.log('');

    // 2. Teste de Registro de Usuário
    console.log('2️⃣ Testando Registro de Usuário...');
    const userData = {
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao.silva@rhplus.com',
      password: '123456',
      cpf: '12345678901',
      department: 'TI',
      position: 'Desenvolvedor',
      role: 'employee'
    };

    try {
      const register = await axios.post(`${BASE_URL}/api/auth/register`, userData);
      console.log('✅ Usuário registrado com sucesso!');
      console.log('Token:', register.data.token ? 'Gerado' : 'Não gerado');
      console.log('');
    } catch (error) {
      if (error.response?.data?.message?.includes('já existe')) {
        console.log('ℹ️ Usuário já existe, continuando...');
      } else {
        throw error;
      }
    }

    // 3. Teste de Login
    console.log('3️⃣ Testando Login...');
    const login = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'joao.silva@rhplus.com',
      password: '123456'
    });
    console.log('✅ Login realizado com sucesso!');
    const token = login.data.token;
    console.log('');

    // 4. Teste de Perfil do Usuário
    console.log('4️⃣ Testando Perfil do Usuário...');
    const profile = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Perfil obtido:', profile.data.user.firstName, profile.data.user.lastName);
    console.log('');

    // 5. Teste de Funcionários
    console.log('5️⃣ Testando Listagem de Funcionários...');
    const employees = await axios.get(`${BASE_URL}/api/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Lista de funcionários obtida:', employees.data.count, 'funcionário(s)');
    console.log('');

    // 6. Teste de Timesheet (Clock In)
    console.log('6️⃣ Testando Clock In...');
    try {
      const clockIn = await axios.post(`${BASE_URL}/api/time-entries/clock-in`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Clock In realizado com sucesso!');
      console.log('');

      // Aguarda um momento antes do clock out
      setTimeout(async () => {
        console.log('7️⃣ Testando Clock Out...');
        const clockOut = await axios.post(`${BASE_URL}/api/time-entries/clock-out`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Clock Out realizado com sucesso!');
        console.log('');

        console.log('🎉 Todos os testes principais foram executados com sucesso!');
        console.log('🚀 API RHPlus está funcionando corretamente!');
        process.exit(0);
      }, 2000);

    } catch (error) {
      if (error.response?.data?.message?.includes('já registrou')) {
        console.log('ℹ️ Clock in já foi realizado hoje');
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Executa os testes
testAPI();