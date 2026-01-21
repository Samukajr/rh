// Teste rápido da validação corrigida
const ImportController = require('./src/controllers/ImportController');

// Simular dados de teste como vêm do Excel
const testData = {
  'Nome': 'ADEMIR CARDIM DOS SANTOS JUNIOR',
  'CPF': '',
  'CNPJ': '',
  'Email': '',
  'Razão social': '',
  'Telefone': '',
  'Celular': '',
  'Dt nascimento': '',
  'Estado': 'SP',
  'Cidade': '',
  'Profissão': 'Fisioterapeuta',
  'Tipo contrato': ''
};

console.log('🧪 Testando mapeamento e validação...');

// Testar mapeamento
const mapped = ImportController.mapEmployeeData(testData);
console.log('📦 Dados mapeados:', mapped);

// Testar validação
ImportController.validateEmployee(mapped, 0).then(result => {
  console.log('✅ Resultado da validação:', result);
  if (result.isValid) {
    console.log('🎉 SUCESSO! Dados válidos para importação');
  } else {
    console.log('❌ ERRO na validação:', result.error);
  }
}).catch(err => {
  console.error('💥 Erro no teste:', err);
});