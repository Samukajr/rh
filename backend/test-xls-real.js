// Teste com dados reais do XLS
const ImportController = require('./src/controllers/ImportController');

// Simular dados como vêm do XLS real (com colunas separadas)
const testDataXLS = {
  'Nome': 'ADRIANA', // Primeiro nome
  'Sobrenome': 'ALVES MARCHISETE VARELLA', // Sobrenome
  'CPF': '227.366.558-00',
  'CNPJ': '',
  'Email': 'drimarchisete@gmail.com',
  'Razão social': '',
  'Telefone': '',
  'Celular': '+55 11 91067-6600',
  'Dt nascimento': '15/12/1981',
  'Estado': 'SP',
  'Cidade': 'São Paulo',
  'Profissão': 'Enfermeiro(a)',
  'Tipo contrato': ''
};

console.log('🧪 Testando com dados XLS reais (Nome + Sobrenome separados)...');

// Testar mapeamento
const mapped = ImportController.mapEmployeeData(testDataXLS);
console.log('📦 Dados mapeados:', mapped);

// Testar validação
ImportController.validateEmployee(mapped, 0).then(result => {
  console.log('✅ Resultado da validação:', result);
  if (result.isValid) {
    console.log('🎉 SUCESSO! XLS dados válidos');
  } else {
    console.log('❌ ERRO na validação XLS:', result.error);
  }
}).catch(err => {
  console.error('💥 Erro no teste XLS:', err);
});