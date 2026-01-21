# 🏢 RH+ Sistema Completo de Gestão de RH

Sistema completo de gestão de recursos humanos desenvolvido com tecnologias modernas, oferecendo todas as funcionalidades essenciais para o gerenciamento eficiente de colaboradores.

## ✨ Funcionalidades Implementadas

### 🔐 Sistema de Autenticação Completo
- **Login seguro** com JWT (JSON Web Tokens)
- **Múltiplos níveis de acesso**: Employee, Manager, HR, Finance, Admin  
- **Reset de senha** com tokens seguros
- **Refresh de tokens** automático
- **Controle de sessões** ativas

### 👥 Gestão Completa de Funcionários
- **Cadastro detalhado** com dados pessoais e profissionais
- **Estrutura hierárquica** com gestores e subordinados
- **Controle de departamentos** e cargos únicos
- **Busca avançada** com filtros múltiplos
- **Histórico de mudanças** e auditoria

### 🩺 Sistema de Atestados Médicos
- **Upload de documentos** (PDF, JPEG, PNG até 10MB)
- **Workflow de aprovação** pelo RH com justificativas
- **Validação de médicos** (nome, CRM)
- **Download seguro** de documentos
- **Histórico completo** por funcionário

### 🏖️ Gestão Inteligente de Férias
- **Agendamento com validação** de conflitos
- **Cálculo automático** de saldo baseado no tempo de empresa
- **Aprovação hierárquica** (Manager → HR)
- **Tipos de licença**: Férias, Licença remunerada, Não remunerada
- **Controle de períodos** e dias úteis

### ⏰ Ponto Eletrônico Moderno
- **Registro digital** de entrada/saída com timestamp
- **Cálculo automático** de horas trabalhadas e extras  
- **Controle de localização** e IP para auditoria
- **Relatórios mensais** com estatísticas completas
- **Edição controlada** pelo RH com justificativa

### 💰 Sistema Completo de Holerites
- **Geração automática** baseada no ponto eletrônico
- **Cálculos detalhados** de proventos e descontos
- **Geração em lote** para múltiplos funcionários
- **Histórico salarial** completo e seguro
- **Validação de impostos** (INSS, IRRF aproximados)

## 🛠️ Tecnologias Utilizadas

### Backend Robusto
- **Node.js 18+** - Runtime JavaScript moderno
- **Express.js** - Framework web minimalista e rápido
- **PostgreSQL** - Banco relacional enterprise-grade
- **Sequelize ORM** - Migrations, validações, relacionamentos
- **Redis** - Cache de sessões e filas (opcional)
- **JWT** - Autenticação stateless e segura
- **Bcryptjs** - Hash de senhas com salt
- **Multer** - Upload de arquivos controlado
- **Swagger** - Documentação interativa da API
- **Joi** - Validação robusta de dados
- **Morgan + Helmet** - Logging e segurança

## 🚀 Instalação Rápida

### Pré-requisitos
- **Node.js 18+** instalado
- **PostgreSQL 13+** configurado 
- **Git** para controle de versão

### Configuração do Backend

1. **Clone e instale dependências**
```bash
git clone <seu-repo>
cd novo-projeto-RH/backend
npm install
```

2. **Configure o banco de dados**
```bash
# Crie o banco PostgreSQL
createdb rhplus

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações
```

3. **Execute as migrações**
```bash
# Sincronizar modelos (desenvolvimento)
npm run dev
# OU rodar migrações (produção)
npm run migrate
```

4. **Inicie o servidor**
```bash
# Desenvolvimento com nodemon
npm run dev

# Produção
npm start
```

5. **Acesse a documentação**
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 📖 API Endpoints Principais

### 🔐 Autenticação
```http
POST /api/auth/register          # Registrar usuário
POST /api/auth/login            # Login
POST /api/auth/refresh          # Renovar token
POST /api/auth/change-password  # Alterar senha
GET  /api/auth/me              # Dados do usuário logado
```

### 👥 Funcionários  
```http
GET    /api/employees                    # Listar com paginação e filtros
POST   /api/employees                    # Cadastrar (HR/Admin)
GET    /api/employees/:id               # Buscar por ID
PUT    /api/employees/:id               # Atualizar (HR/Admin) 
DELETE /api/employees/:id               # Remover (HR/Admin)
GET    /api/employees/departments       # Listar departamentos
GET    /api/employees/positions         # Listar cargos
```

### ⏰ Ponto Eletrônico
```http
GET  /api/time-entries/today            # Ponto de hoje
POST /api/time-entries/clock-in         # Registrar entrada
POST /api/time-entries/clock-out        # Registrar saída
GET  /api/time-entries/summary/:id      # Relatório mensal
GET  /api/time-entries                  # Histórico paginado
PUT  /api/time-entries/:id              # Editar (HR)
```

### 🏖️ Férias
```http
POST /api/leave-requests                 # Nova solicitação
GET  /api/leave-requests/balance/:id     # Saldo de férias
PUT  /api/leave-requests/:id/status      # Aprovar/Rejeitar
GET  /api/leave-requests                 # Listar solicitações
```

### 🩺 Atestados
```http
POST /api/medical-certificates          # Upload (multipart/form-data)
PUT  /api/medical-certificates/:id/status  # Aprovar/Rejeitar (HR)
GET  /api/medical-certificates/:id/download # Download documento
```

### 💰 Holerites
```http
POST /api/payslips                      # Gerar holerite (HR/Finance)
POST /api/payslips/generate-batch       # Geração em lote
GET  /api/payslips/employee/:id/current # Holerite atual
```

## 🔒 Controle de Acesso Detalhado

### 👤 Employee (Funcionário Padrão)
- ✅ Ver próprios dados pessoais e contratuais
- ✅ Bater ponto (entrada/saída) com localização
- ✅ Solicitar férias com validação de saldo
- ✅ Enviar atestados médicos com documentos
- ✅ Consultar holerites próprios
- ❌ Ver dados de outros funcionários

### 👔 Manager (Gestor de Equipe)  
- ✅ **Todas as permissões de Employee**
- ✅ Ver dados completos de subordinados diretos
- ✅ Aprovar/Rejeitar férias da equipe
- ✅ Ver relatórios de ponto da equipe
- ❌ Editar dados de funcionários

### 🏢 HR (Recursos Humanos)
- ✅ **Todas as permissões anteriores**
- ✅ CRUD completo de funcionários
- ✅ Aprovar/Rejeitar atestados médicos
- ✅ Editar registros de ponto com justificativa
- ✅ Ver todos os relatórios da empresa
- ✅ Gerenciar estrutura organizacional

### 💼 Finance (Financeiro)
- ✅ **Permissões básicas de Employee**
- ✅ Gerar e editar holerites
- ✅ Cálculos de folha de pagamento
- ✅ Relatórios financeiros de RH
- ✅ Geração em lote de holerites

### 🔧 Admin (Administrador Sistema)
- ✅ **Acesso total irrestrito**
- ✅ Gerenciar usuários e permissões
- ✅ Configurações avançadas do sistema
- ✅ Logs de auditoria e segurança
- ✅ Backup e manutenção

## 🗄️ Banco de Dados Normalizado

### Estrutura Principal
```
users (autenticação)
├── employees (dados pessoais/profissionais)
    ├── time_entries (registros de ponto)
    ├── leave_requests (solicitações férias)
    ├── medical_certificates (atestados)
    ├── payslips (holerites)
    └── audit_logs (auditoria)
```

### Relacionamentos Implementados
- **User 1:1 Employee** - Autenticação vinculada
- **Employee 1:N Employee** - Hierarquia manager/subordinado  
- **Employee 1:N TimeEntry** - Histórico de ponto
- **Employee 1:N LeaveRequest** - Solicitações de férias
- **Employee 1:N MedicalCertificate** - Atestados médicos
- **Employee 1:N Payslip** - Holerites mensais

## ✅ Features de Segurança

### 🔐 Autenticação Robusta
- **JWT tokens** com expiração configurável
- **Refresh tokens** para sessões longas
- **Rate limiting** para prevenir ataques
- **Hash bcrypt** com salt para senhas
- **Validação rigorosa** de entrada com Joi

### 🛡️ Proteção de Dados
- **Uploads seguros** com validação de tipo/tamanho
- **Sanitização** automática de dados
- **Logs estruturados** para auditoria
- **Helmet.js** para headers de segurança
- **CORS configurável** por ambiente

### 📊 Auditoria Completa
- **Tracking de alterações** em dados sensíveis
- **Log de acessos** com IP e timestamp  
- **Histórico de aprovações** com responsável
- **Backup automático** de documentos

## 🧪 Qualidade e Testes

### Scripts de Desenvolvimento
```bash
npm run dev          # Desenvolvimento com nodemon
npm run lint         # ESLint para qualidade de código  
npm run lint:fix     # Correção automática
npm test             # Testes unitários
npm run test:watch   # Testes em modo watch
```

### Validações Implementadas
- **CPF único** por funcionário
- **Email único** por usuário  
- **Validação de datas** em férias/atestados
- **Conflitos de período** em solicitações
- **Upload seguro** com mime-type validation

## 📋 Próximos Passos

### Frontend em Desenvolvimento
- **React + TypeScript** para interface moderna
- **Tailwind CSS** para design responsivo
- **React Query** para cache inteligente
- **Charts.js** para dashboards

### Funcionalidades Futuras
- 📊 **Dashboard executivo** com KPIs
- 📱 **App mobile** para ponto remoto
- 🔔 **Notificações push** e email
- 📈 **Analytics avançado** de RH
- 🤖 **Chatbot** para dúvidas comuns
- 📋 **Avaliação de desempenho**
- 🎓 **Gestão de treinamentos**

## 🚀 Deploy e Produção

### Configuração Produção
```bash
# Variáveis essenciais
NODE_ENV=production
JWT_SECRET=jwt_ultra_seguro_512_bits
DB_HOST=postgres-producao.com
CORS_ORIGIN=https://rhplus.empresa.com
```

### Docker Deploy
```bash
# Build e deploy
docker build -t rhplus-api .
docker run -p 3000:3000 rhplus-api
```

## 📞 Suporte Técnico

- **Documentação**: Swagger em `/api-docs`
- **Health Check**: `/health` para monitoramento
- **Logs estruturados**: Winston para debug
- **Error tracking**: Sentry integration ready

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para detalhes.

---

🎉 **Sistema RH+ - Gestão moderna e eficiente de recursos humanos!**

Desenvolvido com ❤️ e as melhores práticas de desenvolvimento.