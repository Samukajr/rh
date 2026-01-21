# 📋 TESTE RÁPIDO - COPIE E COLE

## ⚡ COMEÇAR AGORA (5 MINUTOS)

### **URL da Documentação:**
```
https://web-production-a9f8.up.railway.app/api-docs
```

---

## 🔐 1️⃣ FAZER LOGIN

**Endpoint:** `POST /auth/login`

**Cole no campo "Body":**
```json
{
  "email": "admin@rhplus.com",
  "password": "admin123"
}
```

**Resultado esperado:**
```
✅ 200 OK

{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc... (chave super grande)",
    "refreshToken": "..."
  }
}
```

**COPIE O TOKEN para o próximo passo!** 🔑

---

## 👥 2️⃣ LISTAR FUNCIONÁRIOS

**Endpoint:** `GET /employees`

Não precisa de body, só clique "Execute"

**Resultado esperado:**
```
✅ 200 OK

{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "Admin",
      "last_name": "User",
      "email": "admin@rhplus.com",
      "role": "admin"
    }
  ]
}
```

---

## ➕ 3️⃣ CRIAR NOVO FUNCIONÁRIO

**Endpoint:** `POST /employees`

**Cole no campo "Body":**
```json
{
  "first_name": "Ana",
  "last_name": "Silva",
  "email": "ana@clinica.com",
  "position": "Enfermeira",
  "department": "Saúde"
}
```

**Resultado esperado:**
```
✅ 201 Created

{
  "success": true,
  "data": {
    "id": 2,
    "first_name": "Ana",
    "last_name": "Silva",
    "email": "ana@clinica.com",
    ...
  }
}
```

---

## 🏖️ 4️⃣ SOLICITAR FÉRIAS

**Endpoint:** `POST /leave-requests`

**Cole no campo "Body":**
```json
{
  "employee_id": 1,
  "start_date": "2026-02-01",
  "end_date": "2026-02-15",
  "leave_type": "Férias",
  "reason": "Descanso merecido"
}
```

**Resultado esperado:**
```
✅ 201 Created

{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": 1,
    "status": "pendente",
    "start_date": "2026-02-01",
    ...
  }
}
```

---

## ⏰ 5️⃣ REGISTRAR ENTRADA (Clock In)

**Endpoint:** `POST /time-entries/clock-in`

**Cole no campo "Body":**
```json
{
  "employee_id": 1,
  "location": "Escritório Principal"
}
```

**Resultado esperado:**
```
✅ 201 Created

{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": 1,
    "clock_in_time": "2026-01-21T08:00:00.000Z",
    "location": "Escritório Principal"
  }
}
```

---

## 🚪 6️⃣ REGISTRAR SAÍDA (Clock Out)

**Endpoint:** `POST /time-entries/clock-out`

**Cole no campo "Body":**
```json
{
  "employee_id": 1,
  "location": "Escritório Principal"
}
```

**Resultado esperado:**
```
✅ 200 OK

{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": 1,
    "clock_out_time": "2026-01-21T17:30:00.000Z",
    "hours_worked": 9.5
  }
}
```

---

## 🏥 7️⃣ ENVIAR ATESTADO MÉDICO

**Endpoint:** `POST /medical-certificates/upload`

**⚠️ Este endpoint requer upload de arquivo (não é simples JSON)**

Você precisa:
1. Clicar em "Try it out"
2. Selecionar um arquivo PDF/JPG/PNG
3. Preencher os dados do médico
4. Clicar "Execute"

---

## 💰 8️⃣ LISTAR HOLERITES

**Endpoint:** `GET /payslips`

Não precisa de body, só clique "Execute"

**Resultado esperado:**
```
✅ 200 OK

{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee_id": 1,
      "month": "01",
      "year": "2026",
      "gross_salary": 3000.00,
      "net_salary": 2500.00,
      ...
    }
  ]
}
```

---

## 🔄 9️⃣ TESTAR REFRESH TOKEN

**Endpoint:** `POST /auth/refresh`

**Cole no campo "Body":**
```json
{
  "refreshToken": "eyJhbGc... (o refreshToken do login)"
}
```

**Resultado esperado:**
```
✅ 200 OK

{
  "success": true,
  "data": {
    "token": "novo-token...",
    "refreshToken": "novo-refresh-token..."
  }
}
```

---

## 🎯 ORDEM RECOMENDADA DE TESTES

```
1. 🔐 Fazer Login (obtenha o token)
2. ✅ Autorizar com o token
3. 👥 Listar Funcionários
4. ➕ Criar Novo Funcionário
5. ⏰ Clock In
6. 🚪 Clock Out
7. 🏖️ Solicitar Férias
8. 💰 Listar Holerites
```

---

## ❌ ERROS COMUNS

### **Erro 400 - Bad Request**
```
Causa: JSON mal formatado
Solução: Verifique as aspas e vírgulas
         Use https://jsonlint.com para validar
```

### **Erro 401 - Unauthorized**
```
Causa: Token inválido ou não autorizado
Solução: Faça login novamente
         Cole o novo token no Authorize
```

### **Erro 404 - Not Found**
```
Causa: Endpoint não existe
Solução: Verifique se digitou certo o path
         Procure na documentação Swagger
```

### **Erro 500 - Server Error**
```
Causa: Erro no servidor
Solução: Tira screenshot e me manda!
```

---

## 🆘 DÚVIDAS?

**Se não conseguir entender alguma coisa:**

1. Tire uma **screenshot** mostrando:
   - O endpoint que está testando
   - O erro que aparece
   - O JSON que enviou

2. Me manda a screenshot

3. Vou te ajudar! 📸

---

## 🚀 PRÓXIMO PASSO

Depois de testar tudo pela Swagger:

1. **Integre com seu Frontend React**
   ```javascript
   const API_URL = "https://web-production-a9f8.up.railway.app";
   
   const login = async (email, password) => {
     const response = await fetch(`${API_URL}/auth/login`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email, password })
     });
     return response.json();
   };
   ```

2. **Use em seus componentes React**
   ```javascript
   const { token } = await login("admin@rhplus.com", "admin123");
   localStorage.setItem("token", token);
   ```

3. **Pronto! API integrada!** 🎉

---

**Boa sorte! Qualquer dúvida, me chama! 🚀**
