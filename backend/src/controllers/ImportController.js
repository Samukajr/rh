const XLSX = require('xlsx');
const { Employee } = require('../models');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');

// Configuração do multer para upload de arquivos
const upload = multer({
  dest: 'uploads/imports/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls', '.csv'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use .xlsx, .xls ou .csv'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

class ImportController {

  /**
   * POST /api/import/employees
   * Importa funcionários de arquivo Excel/CSV
   */
  static upload = upload.single('file');

  static async importEmployees(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'Arquivo não fornecido'
        });
      }

      const filePath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();

      let data;

      // Ler arquivo baseado na extensão
      if (fileExt === '.csv') {
        // Para CSV com separador ponto e vírgula
        const workbook = XLSX.readFile(filePath, { 
          type: 'file',
          delimiter: ';',
          raw: false 
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(worksheet);
      } else {
        // Para Excel (.xlsx, .xls)
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Processar planilha de forma mais inteligente
        data = ImportController.processExcelSheet(worksheet);
      }

      if (!data || data.length === 0) {
        return res.status(400).json({
          error: 'Arquivo vazio ou formato inválido'
        });
      }

      // Mapear os dados do arquivo para o formato do sistema
      const employeesData = data.map((row, index) => {
        try {
          console.log(`🔄 Processando linha ${index + 1}...`);
          const mapped = ImportController.mapEmployeeData(row);
          if (mapped === null) {
            console.log(`⚠️ Linha ${index + 1} ignorada - dados insuficientes`);
            return null;
          }
          return mapped;
        } catch (error) {
          console.error(`❌ Erro na linha ${index + 2}: ${error.message}`);
          return null;
        }
      }).filter(emp => emp !== null);

      console.log(`📊 Total processado: ${data.length} linhas, ${employeesData.length} válidas`);

      if (employeesData.length === 0) {
        return res.status(400).json({
          error: 'Nenhum funcionário válido encontrado no arquivo - verifique se há nomes nas linhas'
        });
      }

      // Validar dados
      const validationResults = await Promise.all(
        employeesData.map((emp, index) => ImportController.validateEmployee(emp, index))
      );

      const validEmployees = validationResults
        .filter(result => result.isValid)
        .map(result => result.data);

      const errors = validationResults
        .filter(result => !result.isValid)
        .map(result => ({ linha: result.index + 2, erro: result.error }));

      if (validEmployees.length === 0) {
        return res.status(400).json({
          error: 'Nenhum funcionário válido para importar',
          detalhes: errors
        });
      }

      // Importar funcionários válidos
      const importResults = {
        total: data.length,
        importados: 0,
        atualizados: 0,
        erros: errors,
        funcionarios: []
      };

      for (const empData of validEmployees) {
        try {
          // Verificar se já existe pelo email ou CPF
          const existing = await Employee.findOne({
            where: {
              [Op.or]: [
                { email: empData.email },
                { cpf: empData.cpf }
              ]
            }
          });

          if (existing) {
            // Atualizar funcionário existente
            await existing.update(empData);
            importResults.atualizados++;
            importResults.funcionarios.push({
              acao: 'atualizado',
              nome: `${empData.first_name} ${empData.last_name}`,
              email: empData.email
            });
          } else {
            // Criar novo funcionário
            const newEmployee = await Employee.create(empData);
            importResults.importados++;
            importResults.funcionarios.push({
              acao: 'criado',
              nome: `${empData.first_name} ${empData.last_name}`,
              email: empData.email,
              id: newEmployee.id
            });
          }
        } catch (error) {
          // Logar detalhes completos de validação do Sequelize
          const details = (error.errors || []).map(e => `${e.path}: ${e.message}`).join(' | ');
          const errorMsg = details || error.message;
          console.error(`Erro ao salvar funcionário: ${errorMsg}`);
          importResults.erros.push({
            funcionario: `${empData.first_name} ${empData.last_name}`,
            erro: errorMsg
          });
        }
      }

      // Limpar arquivo temporário
      const fs = require('fs');
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      res.json({
        message: 'Importação concluída',
        ...importResults
      });

    } catch (error) {
      console.error('Erro na importação:', error);
      next(error);
    }
  }

  /**
   * Processar planilha Excel de forma inteligente
   * Identifica automaticamente onde estão os cabeçalhos e dados
   */
  static processExcelSheet(worksheet) {
    // Converter para array de arrays para análise
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log('📊 Total de linhas raw:', rawData.length);
    
    if (rawData.length === 0) {
      return [];
    }
    
    // Encontrar linha de cabeçalhos
    let headerRowIndex = -1;
    let headerRow = null;
    
    for (let i = 0; i < Math.min(10, rawData.length); i++) { // Verificar primeiras 10 linhas
      const row = rawData[i];
      if (row && row.length > 0) {
        // Verificar se parece ser linha de cabeçalhos
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
    
    // Pegar dados a partir da linha após os cabeçalhos
    const dataRows = rawData.slice(headerRowIndex + 1);
    
    console.log('📈 Linhas de dados:', dataRows.length);
    
    // Converter para objetos usando os cabeçalhos
    const jsonData = dataRows
      .filter(row => row && row.length > 0 && row.some(cell => cell && cell.toString().trim())) // Filtrar linhas vazias
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
    console.log('📦 Exemplo de registro:', jsonData[0]);
    
    return jsonData;
  }

  /**
   * Mapear dados da planilha para formato do sistema
   */
  static mapEmployeeData(row) {
    // Mapeamento baseado na estrutura real dos arquivos
    const columnMappings = {
      // Mapeamento atualizado baseado no CSV real
      first_name: ['Nome', 'nome', 'first_name', 'name'],
      last_name: ['Sobrenome', 'sobrenome', 'last_name', 'surname'],
      // Alguns arquivos trazem Nome2 como primeiro nome separado
      alt_first_name: ['Nome2', 'nome2'],
      
      // Para nomes completos (único campo)
      full_name: ['Nome completo', 'nome_completo', 'full_name'],
      
      cpf: ['CPF', 'cpf', 'documento'],
      cnpj: ['CNPJ', 'cnpj'],
      email: ['Email', 'email', 'e-mail', 'correio'],
      company_name: ['Razão social', 'razao_social', 'empresa', 'company'],
      phone: ['Telefone', 'telefone', 'phone', 'fone'],
      mobile: ['Celular', 'celular', 'mobile', 'whatsapp'],
      birth_date: ['Dt nascimento', 'data_nascimento', 'birth_date', 'nascimento'],
      state: ['Estado', 'estado', 'uf', 'state'],
      city: ['Cidade', 'cidade', 'city'],
      professional_title: ['Profissão', 'profissao', 'cargo', 'position', 'professional_title'],
      contract_type: ['Tipo contrato', 'tipo_contrato', 'contract_type', 'contrato'],
      
      // Campos adicionais que podem aparecer
      gender: ['Gênero', 'genero', 'gender', 'sexo'],
      career_level: ['Nível', 'nivel', 'career_level', 'level'],
      experience: ['Experiência', 'experiencia', 'experience', 'exp'],
      languages: ['Idiomas', 'idiomas', 'languages', 'linguas'],
      additional_info: ['Observações', 'observacoes', 'obs', 'additional_info', 'notas']
    };

    const mapped = {};

    // Buscar valores nos diferentes nomes de coluna possíveis
    for (const [field, possibleNames] of Object.entries(columnMappings)) {
      for (const name of possibleNames) {
        const value = ImportController.findValueInRow(row, name);
        if (value !== undefined && value !== null && value !== '') {
          mapped[field] = String(value).trim();
          break;
        }
      }
    }

    // Processamento específico para nomes
    
    // Ajuste para Nome2
    if (!mapped.first_name && mapped.alt_first_name) {
      mapped.first_name = mapped.alt_first_name;
    }

    // Se temos first_name e last_name separados (arquivo XLS)
    if (mapped.first_name && mapped.last_name) {
      // Já temos os nomes separados, usar como estão
      console.log(`📝 Nomes separados: "${mapped.first_name}" + "${mapped.last_name}"`);
    }
    // Se temos apenas nome completo (arquivo CSV ou primeira coluna Nome do XLS)
    else if (mapped.first_name && !mapped.last_name) {
      const nameParts = mapped.first_name.split(' ');
      if (nameParts.length > 1) {
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        mapped.first_name = firstName;
        mapped.last_name = lastName;
        console.log(`📝 Nome dividido: "${firstName}" + "${lastName}"`);
      } else {
        mapped.last_name = ''; // Nome único
      }
    }
    // Se não temos nome válido, pular este registro
    else if (!mapped.first_name || mapped.first_name.trim().length < 2) {
      console.log('⚠️ Registro sem nome válido - ignorando');
      return null; // Retornar null para filtrar depois
    }
    // Se não temos nome, usar valores padrão
    else {
      mapped.first_name = 'Nome não informado';
      mapped.last_name = '';
    }

    // Limpar e validar CPF - não obrigatório
    if (mapped.cpf) {
      mapped.cpf = mapped.cpf.replace(/\D/g, '');
      if (mapped.cpf.length !== 11) {
        console.log(`⚠️ CPF inválido ignorado: ${mapped.cpf}`);
        mapped.cpf = ''; // Limpar CPF inválido ao invés de rejeitar registro
      }
    } else {
      mapped.cpf = '';
    }

    // Limpar CNPJ
    if (mapped.cnpj) {
      mapped.cnpj = mapped.cnpj.replace(/\D/g, '');
    }

    // Limpar telefone
    if (mapped.phone) {
      mapped.phone = mapped.phone.replace(/\D/g, '');
    }

    if (mapped.mobile) {
      mapped.mobile = mapped.mobile.replace(/\D/g, '');
      // Se não temos telefone fixo, usar o celular
      if (!mapped.phone && mapped.mobile) {
        mapped.phone = mapped.mobile;
      }
    }

    // Validar email básico - não obrigatório
    if (mapped.email) {
      // Verificar se tem @ e não é apenas espaços
      const emailTrimmed = mapped.email.trim();
      if (emailTrimmed && !emailTrimmed.includes('@')) {
        console.log(`⚠️ Email inválido ignorado: ${mapped.email}`);
        mapped.email = null; // Limpar email inválido
      } else {
        mapped.email = emailTrimmed || null;
      }
    } else {
      mapped.email = null; // Usar null para não disparar validação do Sequelize
    }

    // Normalizar gênero
    if (mapped.gender) {
      const gender = mapped.gender.toLowerCase();
      if (gender.includes('masc') || gender === 'm') {
        mapped.gender = 'Masculino';
      } else if (gender.includes('fem') || gender === 'f') {
        mapped.gender = 'Feminino';
      }
    }

    // Processar data de nascimento
    if (mapped.birth_date) {
      try {
        // Tentar diferentes formatos de data
        const dateStr = mapped.birth_date.toString();
        let parsedDate = null;
        
        if (dateStr.includes('/')) {
          // Formato DD/MM/YYYY ou MM/DD/YYYY
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            // Assumir DD/MM/YYYY
            parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
          }
        }
        
        if (parsedDate && !isNaN(parsedDate)) {
          mapped.birth_date = parsedDate.toISOString().split('T')[0];
        } else {
          mapped.birth_date = null;
        }
      } catch (e) {
        mapped.birth_date = null;
      }
    }

    // Campos obrigatórios com valores padrão
    mapped.is_active = true;
    mapped.hire_date = new Date().toISOString().split('T')[0];

    // Tipo de contrato: normalizar para valores aceitos pelo ENUM (clt, pj, intern, temporary)
    if (mapped.contract_type) {
      const raw = mapped.contract_type.toString().trim().toLowerCase();
      const normalized = {
        clt: ['clt', 'celetista', 'efetivo', 'empregado'],
        pj: ['pj', 'pessoa juridica', 'pessoa jurídica', 'autonomo', 'autônomo'],
        intern: ['intern', 'estagio', 'estágio', 'trainee', 'aprendiz'],
        temporary: ['temporary', 'temporario', 'temporário', 'temporaria', 'temporária', 'temp']
      };

      const match = Object.entries(normalized).find(([, aliases]) => aliases.includes(raw));
      mapped.contract_type = match ? match[0] : 'clt';
    } else {
      mapped.contract_type = 'clt';
    }

    // Mapear cargo para position se não temos position
    if (mapped.professional_title && !mapped.position) {
      mapped.position = mapped.professional_title;
    }

    console.log('🔄 Dados mapeados:', {
      nome: `${mapped.first_name} ${mapped.last_name}`.trim(),
      email: mapped.email || 'sem email',
      cpf: mapped.cpf || 'sem cpf',
      profissao: mapped.professional_title || 'sem profissão'
    });

    return mapped;
  }

  /**
   * Buscar valor na linha ignorando case
   */
  static findValueInRow(row, columnName) {
    for (const [key, value] of Object.entries(row)) {
      if (key.toLowerCase().replace(/[^a-z0-9]/g, '') === 
          columnName.toLowerCase().replace(/[^a-z0-9]/g, '')) {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Parse de data flexível
   */
  static parseDate(dateValue) {
    if (!dateValue) return null;

    try {
      // Se já é uma data
      if (dateValue instanceof Date) {
        return dateValue;
      }

      // Se é número (data do Excel)
      if (typeof dateValue === 'number') {
        return new Date((dateValue - 25569) * 86400 * 1000);
      }

      // String - tentar vários formatos
      const str = String(dateValue).trim();
      
      // Formato brasileiro: DD/MM/YYYY
      if (str.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        const [day, month, year] = str.split('/');
        return new Date(year, month - 1, day);
      }

      // Formato americano: MM/DD/YYYY
      if (str.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        return new Date(str);
      }

      // ISO: YYYY-MM-DD
      if (str.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return new Date(str);
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Parse de salário
   */
  static parseSalary(salaryValue) {
    if (!salaryValue) return null;

    try {
      // Se já é número
      if (typeof salaryValue === 'number') {
        return salaryValue;
      }

      // String - remover formatação
      const str = String(salaryValue)
        .replace(/[R$\s]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');

      const parsed = parseFloat(str);
      return isNaN(parsed) ? null : parsed;
    } catch (error) {
      return null;
    }
  }

  /**
   * Validar dados do funcionário
   */
  static async validateEmployee(empData, index) {
    const schema = Joi.object({
      first_name: Joi.string().min(1).required(),
      last_name: Joi.string().optional().allow('').default(''),
      // Email: aceita vazio OU formato válido, mas não obriga formato quando vazio
      email: Joi.string().optional().allow('').custom((value, helpers) => {
        if (!value || value.trim() === '') {
          return ''; // Email vazio é válido
        }
        // Se tem valor, deve ser um email válido
        if (!value.includes('@') || !value.includes('.')) {
          return helpers.error('any.invalid');
        }
        return value;
      }).default(''),
      cpf: Joi.string().optional().allow('').default(''), // Não validar formato aqui
      phone: Joi.string().optional().allow('').default(''),
      department: Joi.string().optional().allow('').default(''),
      position: Joi.string().optional().allow('').default(''),
      professional_title: Joi.string().optional().allow('').default(''),
      gender: Joi.string().optional().allow('').default(''),
      salary: Joi.number().min(0).optional().allow(null).default(null),
      admission_date: Joi.date().optional().allow(null).default(null),
      birth_date: Joi.date().optional().allow(null).default(null),
      hire_date: Joi.date().optional().allow(null).default(null),
      address: Joi.string().optional().allow('').default(''),
      city: Joi.string().optional().allow('').default(''),
      state: Joi.string().optional().allow('').default(''),
      zip_code: Joi.string().optional().allow('').default(''),
      contract_type: Joi.string().optional().allow('').default('clt'),
      is_active: Joi.boolean().optional().default(true),
      career_level: Joi.string().optional().allow('').default(''),
      experience: Joi.string().optional().allow('').default(''),
      languages: Joi.string().optional().allow('').default(''),
      additional_info: Joi.string().optional().allow('').default(''),
      cnpj: Joi.string().optional().allow('').default('')
    });

    try {
      const { error, value } = schema.validate(empData, { 
        allowUnknown: true, 
        stripUnknown: true,
        // Permitir campos vazios e não tratar como erro
        convert: true
      });
      
      if (error) {
        console.log(`❌ Erro de validação linha ${index + 1}:`, error.details[0].message);
        return {
          isValid: false,
          error: error.details[0].message,
          index
        };
      }

      // Fallback para nome vazio: não travar importação
      if (!value.first_name || value.first_name.trim().length < 1) {
        value.first_name = 'Sem nome';
      }

      // Garantir que email vazio não cause erro no Sequelize (usar null em vez de '')
      if (!value.email || value.email.trim() === '') {
        value.email = null;
      }

      console.log(`✅ Dados válidos linha ${index + 1}: ${value.first_name} ${value.last_name || ''}`.trim());
      return {
        isValid: true,
        data: value,
        index
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
        index
      };
    }
  }

  /**
   * GET /api/import/template
   * Baixar template de importação
   */
  static async downloadTemplate(req, res, next) {
    try {
      const template = [
        {
          'Nome': 'João',
          'Sobrenome': 'Silva',
          'Email': 'joao.silva@empresa.com',
          'CPF': '12345678901',
          'Telefone': '11999999999',
          'Departamento': 'TI',
          'Cargo': 'Desenvolvedor',
          'Salário': '5000.00',
          'Data Admissão': '01/01/2023',
          'Data Nascimento': '15/05/1990',
          'Endereço': 'Rua das Flores, 123',
          'Cidade': 'São Paulo',
          'Estado': 'SP',
          'CEP': '01234567',
          'Tipo Contrato': 'clt'
        }
      ];

      const ws = XLSX.utils.json_to_sheet(template);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Funcionários');

      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=template-funcionarios.xlsx');
      res.send(buffer);

    } catch (error) {
      console.error('Erro ao gerar template:', error);
      next(error);
    }
  }
}

// Adicionar require para Op
const { Op } = require('sequelize');

module.exports = ImportController;