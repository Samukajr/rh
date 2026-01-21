const XLSX = require('xlsx');
const fs = require('fs');

console.log('🔍 Analisando planilha relatorio-profissional.xls...');

try {
    // Ler o arquivo Excel
    const workbook = XLSX.readFile('E:\\APP\\novo-projeto-RH\\docs\\relatorio-profissional.xls');
    
    console.log('📊 Planilhas encontradas:', workbook.SheetNames);
    
    // Pegar a primeira planilha
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Converter para JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log('📈 Total de linhas:', data.length);
    console.log('📋 Cabeçalhos (primeira linha):', data[0]);
    console.log('📝 Primeiras 3 linhas de dados:');
    
    for (let i = 0; i < Math.min(4, data.length); i++) {
        console.log(`Linha ${i}:`, data[i]);
    }
    
    // Converter para JSON com cabeçalhos
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log('📦 Primeira linha como objeto:', JSON.stringify(jsonData[0], null, 2));
    
    console.log('✅ Análise concluída!');
    
} catch (error) {
    console.error('❌ Erro ao analisar planilha:', error.message);
}