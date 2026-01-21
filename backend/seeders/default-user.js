const bcrypt = require('bcryptjs');

async function createDefaultUser() {
  try {
    // Import models here to ensure sequelize is initialized
    const { User, Employee } = require('../src/models');

    // Verificar se já existe um usuário admin
    const existingAdmin = await User.findOne({
      where: { email: 'admin@rhplus.com' }
    });

    if (existingAdmin) {
      console.log('✅ Usuário administrador já existe');
      return;
    }

    // Criar hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    console.log('🔐 Hash da senha criado:', hashedPassword ? 'OK' : 'ERRO');

    // Primeiro criar o funcionário
    const employee = await Employee.create({
      first_name: 'Administrador',
      last_name: 'Sistema',
      cpf: '00000000000',
      rg: '00000000',
      birth_date: new Date('1980-01-01'),
      admission_date: new Date(),
      position: 'Administrador do Sistema',
      department: 'TI',
      contract_type: 'clt',
      salary: 10000.00,
      phone: '11999999999',
      address: 'Endereço Administrativo',
      emergency_contact: 'Contato de Emergência',
      emergency_phone: '11888888888',
      is_active: true
    });

    // Depois criar usuário associado
    const adminUser = await User.create({
      email: 'admin@rhplus.com',
      password_hash: hashedPassword,
      role: 'admin',
      is_active: true,
      employee_id: employee.id
    });

    console.log('👑 Usuário administrador criado com sucesso!');
    console.log('📧 Email: admin@rhplus.com');
    console.log('🔑 Senha: admin123');

    // Criar funcionários de exemplo
    console.log('\\n👥 Criando funcionários de exemplo...');
    
    const exampleEmployees = [
      {
        first_name: 'João',
        last_name: 'Silva',
        cpf: '12345678901',
        rg: '123456789',
        birth_date: new Date('1990-05-15'),
        admission_date: new Date('2022-01-15'),
        position: 'Desenvolvedor Sênior',
        department: 'TI',
        contract_type: 'clt',
        salary: 8500.00,
        phone: '11987654321',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01234567',
        emergency_contact: 'Maria Silva',
        emergency_phone: '11876543210',
        is_active: true,
        email: 'joao.silva@rhplus.com'
      },
      {
        first_name: 'Maria',
        last_name: 'Santos',
        cpf: '98765432109',
        rg: '987654321',
        birth_date: new Date('1988-03-22'),
        admission_date: new Date('2021-08-10'),
        position: 'Analista de RH',
        department: 'RH',
        contract_type: 'clt',
        salary: 6500.00,
        phone: '11976543210',
        address: 'Avenida Paulista, 456',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01310100',
        emergency_contact: 'João Santos',
        emergency_phone: '11765432109',
        is_active: true,
        email: 'maria.santos@rhplus.com'
      },
      {
        first_name: 'Pedro',
        last_name: 'Oliveira',
        cpf: '11111111111',
        rg: '111111111',
        birth_date: new Date('1992-11-08'),
        admission_date: new Date('2023-03-01'),
        position: 'Analista Financeiro',
        department: 'Financeiro',
        contract_type: 'clt',
        salary: 7200.00,
        phone: '11965432109',
        address: 'Rua Augusta, 789',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01305000',
        emergency_contact: 'Ana Oliveira',
        emergency_phone: '11654321098',
        is_active: true,
        email: 'pedro.oliveira@rhplus.com'
      },
      {
        first_name: 'Ana',
        last_name: 'Costa',
        cpf: '22222222222',
        rg: '222222222',
        birth_date: new Date('1985-07-12'),
        admission_date: new Date('2020-11-20'),
        position: 'Gerente de Vendas',
        department: 'Vendas',
        contract_type: 'clt',
        salary: 9500.00,
        phone: '11954321098',
        address: 'Rua Oscar Freire, 321',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01426001',
        emergency_contact: 'Carlos Costa',
        emergency_phone: '11543210987',
        is_active: true,
        email: 'ana.costa@rhplus.com'
      },
      {
        first_name: 'Carlos',
        last_name: 'Ferreira',
        cpf: '33333333333',
        rg: '333333333',
        birth_date: new Date('1995-01-25'),
        admission_date: new Date('2023-06-15'),
        position: 'Designer Gráfico',
        department: 'Marketing',
        contract_type: 'pj',
        salary: 5800.00,
        phone: '11943210987',
        address: 'Vila Madalena, 654',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '05435020',
        emergency_contact: 'Lucia Ferreira',
        emergency_phone: '11432109876',
        is_active: true,
        email: 'carlos.ferreira@rhplus.com'
      }
    ];

    for (const employeeData of exampleEmployees) {
      await Employee.create(employeeData);
    }

    console.log(`✅ ${exampleEmployees.length} funcionários de exemplo criados!`);
    console.log('\\n🎯 Sistema pronto para uso!');

  } catch (error) {
    console.error('❌ Erro ao criar usuário padrão:', error.message);
  }
}

module.exports = createDefaultUser;