# 🏗️ ARQUITETURA DO SISTEMA RH YUNA - Visão Completa

## 📊 Diagrama da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUÁRIOS FINAIS                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  👨‍💼 ADMIN/RH         👤 COLABORADOR         🔧 DESENVOLVEDOR       │
│  admin@rhplus.com   joao@clinica.com   (API Técnica)              │
│                                                                     │
└──────────────────┬──────────────────┬──────────────────────────────┘
                   │                  │
            ┌──────▼──────┐    ┌──────▼──────┐
            │   Frontend   │    │   Swagger   │
            │   (React)    │    │   (API)     │
            │   Vercel.app │    │  Localhost  │
            └──────┬───────┘    └──────┬──────┘
                   │                   │
            ┌──────▼───────────────────▼──────┐
            │   INTERNET (HTTPS Seguro)       │
            └──────┬────────────────────────┬─┘
                   │                        │
        ┌──────────▼────────────┐          │
        │  Vercel               │          │
        │  (Frontend Hosting)   │          │
        │  seu-app.vercel.app   │          │
        └──────────┬────────────┘          │
                   │                       │
                   └───────────┬───────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │  RAILWAY (Backend Hosting)          │
            │  web-production-a9f8.up.railway.app │
            ├──────────────────────────────────────┤
            │                                      │
            │  ┌────────────────────────────────┐ │
            │  │   Node.js + Express.js         │ │
            │  │   (API REST - 20+ endpoints)   │ │
            │  └───────────────┬────────────────┘ │
            │                  │                  │
            │  ┌───────────────▼────────────────┐ │
            │  │   PostgreSQL Database          │ │
            │  │   (Gerenciado pelo Railway)    │ │
            │  │                                │ │
            │  │   9 Tabelas:                   │ │
            │  │   ├─ Users                     │ │
            │  │   ├─ Employees                 │ │
            │  │   ├─ TimeEntries               │ │
            │  │   ├─ LeaveRequests             │ │
            │  │   ├─ MedicalCertificates       │ │
            │  │   ├─ Payslips                  │ │
            │  │   ├─ Notifications             │ │
            │  │   ├─ AuditLogs                 │ │
            │  │   └─ Settings                  │ │
            │  └────────────────────────────────┘ │
            │                                      │
            │  🔐 Segurança:                       │
            │  ├─ JWT Authentication              │
            │  ├─ Bcrypt Password Hashing         │
            │  ├─ Rate Limiting                   │
            │  ├─ CORS Habilitado                 │
            │  ├─ Helmet Security Headers         │
            │  └─ Logs de Auditoria (LGPD)        │
            │                                      │
            └──────────────────────────────────────┘
```

---

## 📁 Estrutura de Arquivos

### **Backend** (Node.js + Express)
```
backend/
├── src/
│   ├── server.js                 ← Arquivo principal
│   ├── config/
│   │   ├── database.js          ← Conexão PostgreSQL
│   │   └── swagger.js           ← Documentação API
│   ├── models/                  ← 8 modelos de dados
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── TimeEntry.js
│   │   ├── LeaveRequest.js
│   │   ├── MedicalCertificate.js
│   │   ├── Payslip.js
│   │   ├── Notification.js
│   │   ├── AuditLog.js
│   │   └── index.js
│   ├── controllers/             ← Lógica de negócio
│   │   ├── AuthController.js
│   │   ├── EmployeeController.js
│   │   ├── LeaveRequestController.js
│   │   ├── MedicalCertificateController.js
│   │   ├── PayslipController.js
│   │   ├── TimeEntryController.js
│   │   └── ImportController.js
│   ├── routes/                  ← Endpoints da API
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── leaveRequests.js
│   │   ├── medicalCertificates.js
│   │   ├── payslips.js
│   │   ├── timeEntries.js
│   │   ├── dashboard.js
│   │   └── import.js
│   ├── middleware/
│   │   ├── auth.js              ← Proteção de rotas
│   │   ├── errorHandler.js      ← Tratamento de erros
│   │   └── validation.js        ← Validação de dados
│   ├── services/
│   │   └── AuthService.js       ← Serviços customizados
│   └── utils/                   ← Utilitários
│
├── migrations/                   ← Migrações do banco
├── seeders/
│   └── default-user.js          ← Dados iniciais
├── tests/                        ← Testes
├── uploads/
│   └── imports/                 ← Arquivos enviados
└── package.json
```

### **Frontend** (React + TypeScript)
```
frontend/
├── src/
│   ├── index.tsx               ← Entrada React
│   ├── App.tsx                 ← Componente principal
│   ├── pages/                  ← Páginas internas
│   │   ├── Login.tsx           ← Autenticação
│   │   ├── Dashboard.tsx       ← Painel principal
│   │   ├── Employees.tsx       ← Gestão funcionários
│   │   ├── LeaveRequests.tsx   ← Solicitações de férias
│   │   ├── MedicalCertificates.tsx  ← Atestados médicos
│   │   ├── Payslips.tsx        ← Consulta holerite
│   │   ├── TimeTracking.tsx    ← Ponto eletrônico
│   │   └── (+ CSS para cada)
│   ├── components/
│   │   ├── Layout.tsx          ← Estrutura visual
│   │   └── (+ componentes específicos)
│   ├── contexts/
│   │   └── AuthContext.tsx     ← Gerenciamento de auth
│   ├── services/
│   │   └── (Chamadas à API)
│   ├── App.css
│   └── index.tsx
│
├── public/
│   ├── index.html
│   └── images/
│
├── package.json                 ← Dependências React
├── tsconfig.json
└── build/                       ← Gerado após npm run build
```

---

## 🔄 Fluxo de Dados

### **1. Usuário faz Login**
```
Frontend (Input) 
    ↓
API /auth/login (POST)
    ↓
AuthController valida credenciais
    ↓
Busca no banco (User model)
    ↓
Gera JWT token
    ↓
Retorna token ao Frontend
    ↓
Frontend armazena token
    ↓
Frontend redireciona para Dashboard
```

### **2. Colaborador solicita férias**
```
Frontend (Formulário)
    ↓
API /leaveRequests (POST)
    ↓
LeaveRequestController
    ↓
Valida datas
    ↓
Salva no banco
    ↓
Cria notificação
    ↓
RH vê no Dashboard
    ↓
RH aprova/rejeita
    ↓
Sistema atualiza saldo de férias
    ↓
Notifica colaborador
```

### **3. RH gera holerite**
```
Frontend (Click Gerar)
    ↓
API /payslips/generate (POST)
    ↓
PayslipController
    ↓
Busca TimeEntries (presença)
    ↓
Busca LeaveRequests (férias)
    ↓
Busca MedicalCertificates (atestados)
    ↓
Calcula:
  - Salário base
  - Descontos (INSS, IR)
  - Benefícios (VR, VT)
  - Horas extras
  - Faltas
  ↓
Gera PDF
    ↓
Envia por email
    ↓
Salva no banco
    ↓
Colaborador recebe
```

---

## 🔐 Segurança & Conformidade

### **Proteção de Dados**
```
✅ Senhas: Bcrypt (não armazenamos em texto)
✅ Tokens: JWT com expiração (24h)
✅ Refresh: Token de longa duração (7 dias)
✅ Conexão: HTTPS/TLS (encriptada)
✅ CORS: Apenas domínios autorizados
✅ Rate Limiting: Proteção contra ataques
```

### **LGPD (Lei Geral de Proteção de Dados)**
```
✅ Consentimento: Usuários concordam ao criar conta
✅ Transparência: Política de privacidade
✅ Segurança: Dados encriptados
✅ Auditoria: Todos os acessos registrados em AuditLog
✅ Exclusão: Usuário pode solicitar exclusão de dados
✅ Portabilidade: Dados podem ser exportados
```

### **Auditoria & Logs**
```
Registramos:
├─ Quem fez login? Email
├─ Quando fez login? Data/hora
├─ O que fez? Ação (criar, editar, deletar)
├─ Qual registro alterou? ID do registro
├─ De que IP veio? Endereço IP
└─ Qual navegador? User Agent

Tudo salvo em: AuditLog table
Pode ser consultado em: Admin Dashboard → Logs
```

---

## 📊 Dados no Banco

### **Tabela: Users**
```
id, email, password (hash), role, createdAt, updatedAt
├─ Admin: Acesso completo
├─ RH: Aprova férias, atestados
├─ Finance: Gera holerites
├─ Manager: Gerencia equipe
└─ Employee: Seu próprio dados
```

### **Tabela: Employees**
```
id, userId (FK), nome, cpf, cargo, departamento, 
salário, dataAdmissão, statusContratação, etc
```

### **Tabela: TimeEntries** (Ponto)
```
id, employeeId (FK), dataEntrada, dataGiro, 
horasExtras, observações
```

### **Tabela: LeaveRequests** (Férias)
```
id, employeeId (FK), dataInício, dataFim, 
status (pendente/aprovado/rejeitado), motivo
```

### **Tabela: MedicalCertificates** (Atestados)
```
id, employeeId (FK), arquivo (PDF/imagem), 
médico, crm, dataAtestado, dias, status
```

### **Tabela: Payslips** (Holerite)
```
id, employeeId (FK), mês, ano, 
salárioBase, descontos, líquido, PDF
```

### **Tabela: Notifications**
```
id, userId (FK), tipo, mensagem, lido, createdAt
```

### **Tabela: AuditLog**
```
id, userId (FK), ação, tabela, registroId, 
dadosAntigos, dadosNovos, IP, timestamp
```

---

## 🚀 Como Funciona o Deploy

### **Backend (Railway)**
```
1. Código no GitHub (Samukajr/rh)
    ↓
2. Railway detecta novo push
    ↓
3. Railway instala dependências (npm install)
    ↓
4. Railway roda migrações (sequelize migrate)
    ↓
5. Railway inicia servidor (npm start)
    ↓
6. Servidor online em: web-production-a9f8.up.railway.app
    ↓
7. PostgreSQL gerenciado automaticamente
```

### **Frontend (Vercel)**
```
1. Código no GitHub (frontend/)
    ↓
2. Vercel detecta novo push
    ↓
3. Vercel instala dependências (npm install)
    ↓
4. Vercel compila React (npm run build)
    ↓
5. Vercel faz deploy (copia arquivos para CDN)
    ↓
6. Frontend online em: seu-app.vercel.app
```

---

## 📊 Estatísticas do Projeto

```
📝 Arquivos criados:         50+
📦 Dependências:             40+
🔗 Endpoints API:            20+
📊 Tabelas Database:         9
🔐 Modelos com autenticação: 8
📄 Documentação:             16 guias
🌐 Linguagens:               JavaScript, TypeScript
⚡ Framework Backend:        Express.js
⚛️ Framework Frontend:       React 18
🗄️ Database:                 PostgreSQL
🚀 Deployment:               Railway + Vercel
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login com email/senha
- [x] JWT tokens
- [x] Refresh tokens
- [x] Logout
- [x] Recuperação de senha

### ✅ Gestão de Funcionários
- [x] Criar funcionário
- [x] Editar dados
- [x] Listar todos
- [x] Importação em lote (CSV)
- [x] Histórico de mudanças

### ✅ Ponto Eletrônico
- [x] Clock In/Out
- [x] Cálculo de horas
- [x] Horas extras
- [x] Relatórios de presença

### ✅ Gestão de Férias
- [x] Solicitar férias
- [x] Aprovar/rejeitar
- [x] Cálculo de saldo
- [x] Calendário de férias
- [x] Conflitos detectados

### ✅ Atestados Médicos
- [x] Upload de documento
- [x] Aprovação
- [x] Desconto automático
- [x] Armazenamento seguro

### ✅ Holerites
- [x] Geração automática
- [x] Cálculo de impostos
- [x] PDF para download
- [x] Email para colaborador
- [x] Histórico completo

### ✅ Relatórios
- [x] Presença
- [x] Folha de pagamento
- [x] Férias
- [x] Atestados
- [x] Turnover

### ✅ Segurança
- [x] Autenticação JWT
- [x] Bcrypt hashing
- [x] Rate limiting
- [x] CORS
- [x] Helmet headers
- [x] Logs de auditoria
- [x] LGPD compliance

---

## 🔜 Próximas Melhorias (Opcional)

```
📱 App Mobile (React Native)
💬 Notificações por WhatsApp
📈 Dashboard com gráficos
🏦 Integração contábil
🎓 Sistema de treinamento
📧 Templates de email
🌍 Suporte multi-idioma
🎨 Temas customizáveis
```

---

## 📞 Suporte

**Tem dúvida sobre a arquitetura?**
→ Me chama que explico!

**Quer adicionar uma funcionalidade?**
→ Vamos conversar!

**Problema técnico?**
→ Vamos debugar juntos!

---

**Desenvolvido com ❤️ para a YUNA Clínica**

*Arquitetura v1.0 - 2025*
