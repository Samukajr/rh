const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RH+ API',
      version: '1.0.0',
      description: `
        ## Sistema Completo de Gestão de RH
        
        API REST para gerenciamento completo de recursos humanos, incluindo:
        
        - **Gestão de Funcionários** - Cadastro, edição e consulta de colaboradores
        - **Autenticação** - Sistema seguro de login com JWT
        - **Atestados Médicos** - Upload e aprovação de atestados
        - **Solicitações de Férias** - Agendamento e controle de férias
        - **Ponto Eletrônico** - Registro de entrada/saída e controle de horas
        - **Holerites** - Geração e consulta de holerites
        - **Controle de Acesso** - Diferentes níveis de permissão (Employee, Manager, HR, Finance, Admin)
        
        ### Autenticação
        
        A API utiliza autenticação JWT (Bearer Token). Para acessar endpoints protegidos:
        1. Faça login em \`/api/auth/login\`
        2. Use o token retornado no header: \`Authorization: Bearer <token>\`
        
        ### Níveis de Acesso
        
        - **Employee**: Acesso aos próprios dados, envio de atestados/férias, registro de ponto
        - **Manager**: Aprovação de férias de subordinados + permissões de Employee
        - **HR**: Gestão completa de funcionários, aprovação de atestados + permissões anteriores
        - **Finance**: Gestão de holerites + permissões de Employee
        - **Admin**: Acesso total ao sistema
      `,
      contact: {
        name: 'RHPlus Team',
        email: 'suporte@rhplus.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.rhplus.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Produção' : 'Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Digite apenas o token JWT (sem "Bearer")'
        }
      }
    },
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints para login, registro e gerenciamento de sessão'
      },
      {
        name: 'Funcionários',
        description: 'Gestão de colaboradores da empresa'
      },
      {
        name: 'Atestados Médicos',
        description: 'Upload e aprovação de atestados médicos'
      },
      {
        name: 'Solicitações de Férias',
        description: 'Agendamento e controle de férias'
      },
      {
        name: 'Ponto Eletrônico',
        description: 'Registro de entrada/saída e controle de horas'
      },
      {
        name: 'Holerites',
        description: 'Geração e consulta de holerites'
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos com documentação
};

module.exports = swaggerJsdoc(options);