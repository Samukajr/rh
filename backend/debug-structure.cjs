// Debug dos erros de importação
const XLSX = require('xlsx');

try {
  const xlsPath = 'E:\\APP\\novo-projeto-RH\\docs\\relatorio-profissional.xls';
  const workbook = XLSX.readFile(xlsPath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log('🔍 DEBUGGING ESTRUTURA ATUAL:');
  console.log('Total linhas:', rawData.length);
  
  // Mostrar primeiras 5 linhas detalhadamente
  console.log('\n📋 ESTRUTURA DETALHADA:');
  for (let i = 0; i < Math.min(8, rawData.length); i++) {
    const row = rawData[i];
    console.log(`\nLinha ${i}:`);
    console.log('  Raw:', row);
    console.log('  Length:', row?.length || 0);
    console.log('  Dados válidos:', row?.filter(cell => cell && cell.toString().trim()).length || 0);
  }
  
  // Verificar qual linha tem cabeçalhos reais
  console.log('\n🔍 PROCURANDO CABEÇALHOS VÁLIDOS:');
  for (let i = 0; i < Math.min(10, rawData.length); i++) {
    const row = rawData[i];
    if (row && row.length > 0) {
      // Contar quantas células têm texto válido
      const validCells = row.filter(cell => 
        cell && 
        typeof cell === 'string' && 
        cell.trim().length > 0 &&
        !cell.toLowerCase().includes('nome') ||
        cell.toLowerCase().includes('cpf') ||
        cell.toLowerCase().includes('email')
      ).length;
      
      // Verificar se é linha de cabeçalho
      const isHeaderRow = row.some(cell => 
        cell && typeof cell === 'string' && 
        (cell.toLowerCase().includes('nome') || 
         cell.toLowerCase().includes('email') ||
         cell.toLowerCase().includes('cpf') ||
         cell.toLowerCase().includes('profiss'))
      );
      
      console.log(`Linha ${i}: ${validCells} células válidas, É cabeçalho: ${isHeaderRow}`);
      if (isHeaderRow) {
        console.log('  Cabeçalhos:', row.filter(cell => cell && cell.toString().trim()));
      }
    }
  }
  
  // Testar processamento como está sendo feito
  console.log('\n🧪 TESTANDO PROCESSAMENTO ATUAL:');
  
  // Simular a função processExcelSheet
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
        console.log(`✅ Cabeçalhos identificados na linha ${i}:`, headerRow);
        break;
      }
    }
  }
  
  if (headerRowIndex >= 0) {
    const dataRows = rawData.slice(headerRowIndex + 1);
    console.log(`📊 Dados começam na linha ${headerRowIndex + 1}, total: ${dataRows.length} linhas`);
    
    // Mostrar primeiras 3 linhas de dados mapeadas
    console.log('\n📦 PRIMEIRAS LINHAS MAPEADAS:');
    for (let i = 0; i < Math.min(3, dataRows.length); i++) {
      const row = dataRows[i];
      if (row && row.length > 0) {
        const obj = {};
        headerRow.forEach((header, index) => {
          if (header && header.toString().trim()) {
            obj[header.toString().trim()] = row[index] || '';
          }
        });
        console.log(`Linha ${i + 1}:`, obj);
      }
    }
  }
  
} catch (error) {
  console.error('💥 Erro:', error);
}