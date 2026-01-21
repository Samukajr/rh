const XLSX = require('xlsx');
const fs = require('fs');

console.log('🔍 Analisando arquivo CSV...');

try {
  const csvPath = 'E:\\APP\\novo-projeto-RH\\docs\\relatorio-profissional.csv';
  
  if (fs.existsSync(csvPath)) {
    console.log('📁 Arquivo CSV encontrado!');
    
    // Ler CSV
    const workbook = XLSX.readFile(csvPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log('📊 Total de linhas CSV:', jsonData.length);
    console.log('📋 Cabeçalhos CSV:', jsonData[0]);
    console.log('📝 Primeira linha de dados CSV:', jsonData[1]);
    
    // Comparar estruturas
    console.log('\n🔍 COMPARAÇÃO DE ESTRUTURAS:');
    
    // Ler XLS para comparar
    const xlsPath = 'E:\\APP\\novo-projeto-RH\\docs\\relatorio-profissional.xls';
    const xlsWorkbook = XLSX.readFile(xlsPath);
    const xlsWorksheet = xlsWorkbook.Sheets[xlsWorkbook.SheetNames[0]];
    const xlsJsonData = XLSX.utils.sheet_to_json(xlsWorksheet, { header: 1 });
    
    console.log('\n📊 XLS vs CSV:');
    console.log('XLS linhas:', xlsJsonData.length);
    console.log('CSV linhas:', jsonData.length);
    
    console.log('\nXLS cabeçalhos:', xlsJsonData[0]);
    console.log('CSV cabeçalhos:', jsonData[0]);
    
    // Verificar estrutura atual do processamento
    console.log('\n🔍 ANÁLISE DETALHADA DO XLS:');
    
    // Procurar linha de cabeçalhos real
    for (let i = 0; i < Math.min(5, xlsJsonData.length); i++) {
      const row = xlsJsonData[i];
      console.log(`Linha ${i}:`, row);
      
      if (row && row.length > 0) {
        const hasValidHeaders = row.some(cell => 
          cell && typeof cell === 'string' && 
          (cell.toLowerCase().includes('nome') || 
           cell.toLowerCase().includes('email') ||
           cell.toLowerCase().includes('cpf') ||
           cell.toLowerCase().includes('profiss'))
        );
        
        if (hasValidHeaders) {
          console.log(`✅ Cabeçalhos encontrados na linha ${i}`);
        }
      }
    }
    
  } else {
    console.log('❌ Arquivo CSV não encontrado!');
  }
  
} catch (error) {
  console.error('💥 Erro:', error.message);
}