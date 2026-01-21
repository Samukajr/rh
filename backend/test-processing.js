const XLSX = require('xlsx');
const path = require('path');

// Ler o arquivo Excel do usuário
const filePath = 'E:\\APP\\novo-projeto-RH\\docs\\relatorio-profissional.xls';
console.log('📁 Testando processamento do arquivo:', filePath);

try {
  // Ler arquivo
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  console.log('📋 Planilha:', sheetName);
  
  // Função processExcelSheet (copiada do ImportController)
  function processExcelSheet(worksheet) {
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log('📊 Total de linhas raw:', rawData.length);
    
    if (rawData.length === 0) {
      return [];
    }
    
    // Encontrar linha de cabeçalhos
    let headerRowIndex = -1;
    let headerRow = null;
    
    for (let i = 0; i < Math.min(10, rawData.length); i++) {
      const row = rawData[i];
      if (row && row.length > 0) {
        const hasValidHeaders = row.some(cell => 
          cell && typeof cell === 'string' && 
          (cell.toLowerCase().includes('nome') || 
           cell.toLowerCase().includes('email') ||
           cell.toLowerCase().includes('cpf') ||
           cell.toLowerCase().includes('profiss'))
        );
        
        if (hasValidHeaders && row.filter(cell => cell && cell.toString().trim()).length >= 3) {
          headerRowIndex = i;
          headerRow = row;
          console.log('📋 Cabeçalhos encontrados na linha', i + 1, ':', headerRow);
          break;
        }
      }
    }
    
    if (headerRowIndex === -1) {
      console.log('⚠️ Cabeçalhos não encontrados, usando primeira linha');
      headerRowIndex = 0;
      headerRow = rawData[0];
    }
    
    const dataRows = rawData.slice(headerRowIndex + 1);
    console.log('📈 Linhas de dados:', dataRows.length);
    
    const jsonData = dataRows
      .filter(row => row && row.length > 0 && row.some(cell => cell && cell.toString().trim()))
      .map(row => {
        const obj = {};
        headerRow.forEach((header, index) => {
          if (header && header.toString().trim()) {
            obj[header.toString().trim()] = row[index] || '';
          }
        });
        return obj;
      });
    
    console.log('✅ Dados processados:', jsonData.length, 'registros válidos');
    
    if (jsonData.length > 0) {
      console.log('📦 Exemplo de primeiro registro:');
      console.log(JSON.stringify(jsonData[0], null, 2));
      
      console.log('\n📦 Exemplo de segundo registro:');
      console.log(JSON.stringify(jsonData[1], null, 2));
      
      // Mostrar colunas disponíveis
      console.log('\n📝 Colunas disponíveis:');
      Object.keys(jsonData[0]).forEach((col, index) => {
        console.log(`${index + 1}. "${col}"`);
      });
    }
    
    return jsonData;
  }
  
  // Processar
  const processedData = processExcelSheet(worksheet);
  
  console.log(`\n🎯 RESULTADO FINAL: ${processedData.length} registros processados`);
  
} catch (error) {
  console.error('💥 Erro:', error.message);
}