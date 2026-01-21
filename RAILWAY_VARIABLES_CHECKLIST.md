# ✅ CHECKLIST - ADICIONAR VARIÁVEIS NO RAILWAY

## 📍 LOCALIZAÇÃO NO RAILWAY

```
https://railway.app 
    ↓
[Seu projeto "rh"]
    ↓
ESQUERDA: Clique em "rh" (Backend)
    ↓
DIREITA: Você verá as abas
    ↓
Procure por "Variables" ← AQUI!
    ↓
Clique em "Variables"
```

---

## 🔑 PASSO 1: GERAR CHAVES (Na sua máquina)

Execute NO PowerShell:

```powershell
cd "e:\APP\novo-projeto-RH"
.\generate-keys.ps1
```

**Você receberá 2 chaves:**
- `JWT_SECRET` (chave 1)
- `JWT_REFRESH_SECRET` (chave 2)

**Copie e guarde essas 2 chaves!** 🔒

---

## ✏️ PASSO 2: ADICIONAR VARIÁVEIS NO RAILWAY

No Railway, clique em **[+ New Variable]** PARA CADA linha abaixo:

### Tabela de Variáveis para Copiar e Colar:

| # | Key | Value |
|---|-----|-------|
| 1 | PORT | 3000 |
| 2 | NODE_ENV | production |
| 3 | JWT_SECRET | [COLE A CHAVE 1 DO SCRIPT] |
| 4 | JWT_EXPIRE | 24h |
| 5 | JWT_REFRESH_SECRET | [COLE A CHAVE 2 DO SCRIPT] |
| 6 | JWT_REFRESH_EXPIRE | 7d |
| 7 | FRONTEND_URL | http://localhost:3001 |
| 8 | RATE_LIMIT_WINDOW | 15 |
| 9 | RATE_LIMIT_MAX | 100 |

---

## 📝 INSTRUÇÕES PARA CADA UMA

### Variável 1: PORT
```
Clique em [+ New Variable]
Key:   PORT
Value: 3000
Clique Save/Add
```

### Variável 2: NODE_ENV
```
Clique em [+ New Variable]
Key:   NODE_ENV
Value: production
Clique Save/Add
```

### Variável 3: JWT_SECRET ⭐ IMPORTANTE
```
Clique em [+ New Variable]
Key:   JWT_SECRET
Value: [COLE O JWT_SECRET do script generate-keys.ps1]
       (a chave bem grande e aleatória)
Clique Save/Add
```

### Variável 4: JWT_EXPIRE
```
Clique em [+ New Variable]
Key:   JWT_EXPIRE
Value: 24h
Clique Save/Add
```

### Variável 5: JWT_REFRESH_SECRET ⭐ IMPORTANTE
```
Clique em [+ New Variable]
Key:   JWT_REFRESH_SECRET
Value: [COLE O JWT_REFRESH_SECRET do script generate-keys.ps1]
       (a outra chave bem grande e aleatória)
Clique Save/Add
```

### Variável 6: JWT_REFRESH_EXPIRE
```
Clique em [+ New Variable]
Key:   JWT_REFRESH_EXPIRE
Value: 7d
Clique Save/Add
```

### Variável 7: FRONTEND_URL
```
Clique em [+ New Variable]
Key:   FRONTEND_URL
Value: http://localhost:3001
Clique Save/Add
```

### Variável 8: RATE_LIMIT_WINDOW
```
Clique em [+ New Variable]
Key:   RATE_LIMIT_WINDOW
Value: 15
Clique Save/Add
```

### Variável 9: RATE_LIMIT_MAX
```
Clique em [+ New Variable]
Key:   RATE_LIMIT_MAX
Value: 100
Clique Save/Add
```

---

## 🟢 APÓS ADICIONAR TODAS

1. Você verá todas listadas
2. Railway vai **redeploy automaticamente**
3. Aguarde o ✅ verde aparecer em **Deployments**

---

## ✨ PRONTO!

Seu backend estará online e funcional! 🚀

**Próximo passo: Testar os endpoints**

```
https://seu-app.up.railway.app/api-docs
```

---

## 🆘 NÃO CONSEGUIU ENCONTRAR "VARIABLES"?

**Tira uma screenshot e manda!**

Vou guiar você direto apontando exatamente onde clicar.

---

*Tempo estimado: 5 minutos* ⏱️
