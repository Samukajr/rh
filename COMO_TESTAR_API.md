# 🧪 COMO TESTAR A API - GUIA COMPLETO

## 🎯 ACESSO RÁPIDO

### **URL para Acessar:**
```
https://web-production-a9f8.up.railway.app/api-docs
```

**Copie essa URL e cole no navegador!** ✅

---

## 📖 O QUE VOCÊ VERÁ

Quando acessar a URL acima, aparecerá uma interface chamada **Swagger UI**:

```
┌──────────────────────────────────────┐
│  RH Plus API                         │
│  Sistema de Gestão de RH            │
│                                      │
│  Versão: 1.0.0                      │
│                                      │
│  ✅ Auth                             │
│  ✅ Employees                        │
│  ✅ Leave Requests                  │
│  ✅ Medical Certificates            │
│  ✅ Time Entries                    │
│  ✅ Payslips                        │
│                                      │
└──────────────────────────────────────┘
```

---

## 🔐 PASSO 1: FAZER LOGIN

### **1.1 Localize o endpoint de Login**

Na documentação Swagger, procure por:

```
POST /auth/login
```

Clique nele para expandir.

### **1.2 Clique em "Try it out"**

Você verá um botão verde:
```
[Try it out] ← CLIQUE AQUI
```

### **1.3 Preencha os dados**

Você verá um campo para preencher. Cole isso:

```json
{
  "email": "admin@rhplus.com",
  "password": "admin123"
}
```

### **1.4 Clique em "Execute"**

Você receberá uma resposta com um **token JWT**! 🔐

**Exemplo de resposta:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@rhplus.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🔑 PASSO 2: COPIAR O TOKEN

### **Importante!**

1. Localize a linha: `"token": "eyJhbGc..."`
2. Copie TUDO o que está entre as aspas (a parte bem grande)
3. **Você vai usar esse token em todos os outros testes!**

**Exemplo (truncado):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

## 🔓 PASSO 3: AUTORIZAR NA DOCUMENTAÇÃO

### **Para usar tokens em todos os testes:**

1. **Procure um botão verde no topo da página:**
   ```
   [Authorize] 🔓  ou  [🔒 Authorize]
   ```

2. **Clique nele**

3. **Cole o token que você copiou:**
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **OU** (alguns sistemas aceitam sem "Bearer"):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Clique em "Authorize"**

5. **Pronto!** Agora todos os endpoints protegidos funcionam! 🎉

---

## 👥 PASSO 4: TESTAR ENDPOINTS

### **Exemplo 1: Listar Funcionários**

```
GET /employees
```

1. Procure por este endpoint
2. Clique para expandir
3. Clique em **"Try it out"**
4. Clique em **"Execute"**

**Você verá:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "Admin",
      "last_name": "User",
      "email": "admin@rhplus.com",
      ...
    }
  ]
}
```

---

### **Exemplo 2: Criar um Novo Funcionário**

```
POST /employees
```

1. Procure por este endpoint
2. Clique para expandir
3. Clique em **"Try it out"**
4. No campo **"Body"**, cole:

```json
{
  "first_name": "João",
  "last_name": "Silva",
  "email": "joao@example.com",
  "position": "Desenvolvedor",
  "department": "TI"
}
```

5. Clique em **"Execute"**

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 2,
    "first_name": "João",
    "last_name": "Silva",
    "email": "joao@example.com",
    ...
  }
}
```

---

### **Exemplo 3: Solicitar Férias**

```
POST /leave-requests
```

1. Procure por este endpoint
2. Clique em **"Try it out"**
3. No campo **"Body"**, cole:

```json
{
  "employee_id": 1,
  "start_date": "2026-02-01",
  "end_date": "2026-02-15",
  "leave_type": "Férias",
  "reason": "Descanso"
}
```

4. Clique em **"Execute"**

---

### **Exemplo 4: Registrar Ponto (Clock In)**

```
POST /time-entries/clock-in
```

1. Procure por este endpoint
2. Clique em **"Try it out"**
3. No campo **"Body"**, cole:

```json
{
  "employee_id": 1,
  "location": "Escritório"
}
```

4. Clique em **"Execute"**

---

### **Exemplo 5: Sair do Ponto (Clock Out)**

```
POST /time-entries/clock-out
```

1. Procure por este endpoint
2. Clique em **"Try it out"**
3. No campo **"Body"**, cole:

```json
{
  "employee_id": 1,
  "location": "Escritório"
}
```

4. Clique em **"Execute"**

---

## 🧪 TESTE COMPLETO - CENÁRIO REAL

### **Simulando um dia de trabalho:**

```
1️⃣ Login (já fez)
   → Recebe token

2️⃣ Funcionário faz Clock In
   POST /time-entries/clock-in
   → Registra entrada às 08:00

3️⃣ Solicita Férias
   POST /leave-requests
   → Solicita 10 dias de férias

4️⃣ Envia Atestado Médico
   POST /medical-certificates/upload
   → Upload do PDF

5️⃣ Consulta Holerite
   GET /payslips
   → Vê histórico salarial

6️⃣ Faz Clock Out
   POST /time-entries/clock-out
   → Registra saída às 17:30
```

---

## 📝 DICAS IMPORTANTES

### **1. Status Codes Esperados:**

```
✅ 200 - Sucesso (GET, POST, PUT)
✅ 201 - Criado com sucesso (POST)
✅ 204 - Deletado com sucesso (DELETE)
❌ 400 - Erro nos dados enviados
❌ 401 - Sem autorização (token inválido)
❌ 404 - Recurso não encontrado
```

### **2. Estrutura de Resposta:**

Toda resposta segue esse padrão:
```json
{
  "success": true/false,
  "message": "Descrição do que aconteceu",
  "data": { /* dados aqui */ }
}
```

### **3. Campos Opcionais:**

Nem todos os campos são obrigatórios. Se um campo for opcional e você não preencher, é ok! Exemplo:

```json
{
  "first_name": "Maria",
  "last_name": "Santos"
  // email é opcional, não precisa enviar
}
```

---

## 🔍 ENTENDENDO OS MÉTODOS

### **GET** (Buscar dados)
```
GET /employees
GET /employees/1
GET /leave-requests
```
✅ Apenas busca, não modifica nada

### **POST** (Criar dados)
```
POST /employees
POST /leave-requests
POST /time-entries/clock-in
```
✅ Cria um novo registro

### **PUT** (Atualizar dados)
```
PUT /employees/1
PUT /leave-requests/1/approve
```
✅ Modifica um registro existente

### **DELETE** (Deletar dados)
```
DELETE /employees/1
```
✅ Remove um registro

---

## 🆘 SE DEU ERRO

### **Erro 401 (Unauthorized):**
```
Solução: Você esqueceu de colar o token no Authorize
ou o token expirou (faça login novamente)
```

### **Erro 400 (Bad Request):**
```
Solução: Verifique se o JSON está correto
Use um validador: jsonlint.com
```

### **Erro 404 (Not Found):**
```
Solução: O endpoint ou recurso não existe
Verifique o caminho na URL
```

### **Erro 500 (Server Error):**
```
Solução: Pode ser erro no banco de dados
Tira uma screenshot e me manda!
```

---

## 🎯 TESTE RÁPIDO (2 MINUTOS)

Faça isso agora:

1. **Acesse:** https://web-production-a9f8.up.railway.app/api-docs
2. **Procure:** `POST /auth/login`
3. **Clique:** "Try it out"
4. **Cole:**
   ```json
   {
     "email": "admin@rhplus.com",
     "password": "admin123"
   }
   ```
5. **Clique:** "Execute"
6. **Copie:** o token da resposta
7. **Clique:** "Authorize" (botão verde no topo)
8. **Cole:** o token
9. **Procure:** `GET /employees`
10. **Clique:** "Try it out" → "Execute"

**Pronto! Você viu a API funcionando!** 🎉

---

## 📚 PRÓXIMA ETAPA

Depois de testar tudo:

1. **Integrar com Frontend React**
   - Use a URL da API nos seus componentes
   - Faça requisições autenticadas

2. **Testar com Postman** (avançado)
   - Download: https://www.postman.com
   - Mais controle e salvamento de testes

3. **Adicionar mais dados**
   - Crie vários funcionários
   - Teste todos os endpoints

---

**Boa sorte! Você consegue! 🚀**

*Qualquer dúvida, me avisa!*
