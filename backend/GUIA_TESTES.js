// Guia de Testes da API RHPlus
// Execute estes comandos no navegador ou Postman para testar a API

const API_BASE = 'http://localhost:3000';

// 1. TESTE DE AUTENTICAÇÃO
// POST /api/auth/register
const registerUser = {
  "firstName": "Maria",
  "lastName": "Santos", 
  "email": "maria.santos@rhplus.com",
  "password": "123456",
  "cpf": "12345678902",
  "department": "RH",
  "position": "Analista de RH",
  "role": "hr"
};

// POST /api/auth/login
const loginData = {
  "email": "maria.santos@rhplus.com",
  "password": "123456"
};

// 2. TESTE DE FUNCIONÁRIOS
// GET /api/employees
// Headers: Authorization: Bearer {token}

// 3. TESTE DE PONTO ELETRÔNICO  
// POST /api/time-entries/clock-in
// Headers: Authorization: Bearer {token}

// POST /api/time-entries/clock-out
// Headers: Authorization: Bearer {token}

// 4. TESTE DE SOLICITAÇÃO DE FÉRIAS
// POST /api/leave-requests
const leaveRequest = {
  "type": "vacation",
  "startDate": "2025-12-15",
  "endDate": "2025-12-20",
  "reason": "Férias de final de ano"
};

// 5. TESTE DE ATESTADO MÉDICO
// POST /api/medical-certificates
// Content-Type: multipart/form-data
// Dados: startDate, endDate, reason + arquivo

console.log('🧪 Guia de testes criado! Use os dados acima para testar a API');
console.log('📚 Documentação completa em: http://localhost:3000/api-docs');