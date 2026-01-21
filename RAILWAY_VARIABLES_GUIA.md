# 🚀 GUIA VISUAL - CONFIGURAR VARIÁVEIS NO RAILWAY

## ✅ PASSO-A-PASSO DETALHADO

### **PASSO 1: Acessar o Dashboard do Railway**

1. Abra: https://railway.app
2. Você verá a tela inicial com seus projetos
3. **Procure pelo projeto chamado "rh"** (que você acabou de criar)
4. Clique no card do projeto "rh"

![Tela esperada]
```
┌─────────────────────────────────────┐
│  My Projects                        │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐  │
│  │        rh                    │  │
│  │  Deploy from GitHub: OK ✅   │  │
│  │  Clique aqui                 │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

### **PASSO 2: Dentro do Projeto RH**

Após clicar no projeto, você verá a tela de detalhes.

**No topo esquerdo, você verá:**
- **"rh"** (nome do projeto) 
- Abaixo deles você verá 3 abas principais:
  1. **Deployments** (ativo por padrão)
  2. **Settings**
  3. **Logs**

---

### **PASSO 3: Localizando "Variables"**

Existem 2 formas de acessar:

#### **FORMA A: Pelo Service (Mais fácil)**

1. Procure à esquerda na tela por **"Services"**
2. Você verá listado:
   - `rh` (Backend - Node.js)
   - `rh-db` (Banco de dados - PostgreSQL)

3. **Clique em `rh`** (o backend)

4. Agora você verá **à direita um painel** com abas:
   - Settings
   - **Variables** ← AQUI! 
   - Deploy
   - Monitoring

5. Clique em **Variables**

---

#### **FORMA B: Pelo Settings (Alternativa)**

1. Clique em **Settings** (aba no topo)
2. No painel esquerdo, procure por:
   - **Variables**
3. Clique

---

## 📍 ONDE CLICAR - SCREENSHOTS TEXTUAIS

```
┌─────────────────────────────────────────────────────────┐
│  🏠 Projects > rh                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ESQUERDA (Services):        DIREITA (Detalhes):      │
│  ├─ rh (Backend) ← Clique!   ├─ Settings              │
│  └─ rh-db                    ├─ Variables ← Aqui!     │
│                              ├─ Deploy                 │
│                              └─ Monitoring             │
│                                                         │
│  Quando clicar em "Variables":                         │
│  ┌──────────────────────────────────────────────┐     │
│  │ Variables                                    │     │
│  ├──────────────────────────────────────────────┤     │
│  │                                              │     │
│  │ ⚙️ DATABASE_URL=postgres://...  (criado)   │     │
│  │                                              │     │
│  │ [+ New Variable]  ← Clique aqui             │     │
│  │                                              │     │
│  └──────────────────────────────────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 ADICIONANDO VARIÁVEIS

### **Você verá algo assim:**

```
Variables
═════════════════════════════════════════

⚙️ DATABASE_URL = postgres://...  (já criada pelo Railway)
   [Edit] [Delete]

[+ New Variable]  ← Clique para adicionar nova


```

### **Para CADA variável que precisa adicionar:**

1. Clique em **[+ New Variable]**
2. Preencha:
   - **Key:** `PORT` (sem aspas)
   - **Value:** `3000` (sem aspas)
3. Clique em "Save" ou "Add"

4. Repita para TODAS as variáveis abaixo

---

## 📋 VARIÁVEIS A ADICIONAR (COPIE E COLE)

**Execute isso no PowerShell PRIMEIRO para gerar as chaves:**

```powershell
cd "e:\APP\novo-projeto-RH"
.\generate-keys.ps1
```

Isso vai gerar 2 chaves super seguras. Copie-as.

---

### **Variáveis a adicionar no Railway:**

```
1. PORT
   Key: PORT
   Value: 3000

2. NODE_ENV
   Key: NODE_ENV
   Value: production

3. JWT_SECRET
   Key: JWT_SECRET
   Value: [COLE A CHAVE GERADA PELO SCRIPT]

4. JWT_EXPIRE
   Key: JWT_EXPIRE
   Value: 24h

5. JWT_REFRESH_SECRET
   Key: JWT_REFRESH_SECRET
   Value: [COLE A OUTRA CHAVE GERADA PELO SCRIPT]

6. JWT_REFRESH_EXPIRE
   Key: JWT_REFRESH_EXPIRE
   Value: 7d

7. FRONTEND_URL
   Key: FRONTEND_URL
   Value: http://localhost:3001

8. RATE_LIMIT_WINDOW
   Key: RATE_LIMIT_WINDOW
   Value: 15

9. RATE_LIMIT_MAX
   Key: RATE_LIMIT_MAX
   Value: 100
```

---

## 🔑 GERAR CHAVES JWT (IMPORTANTE!)

**Execute NO PowerShell:**

```powershell
cd "e:\APP\novo-projeto-RH"
.\generate-keys.ps1
```

Você verá:
```
✅ JWT_SECRET gerado com sucesso:
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789...

✅ JWT_REFRESH_SECRET gerado com sucesso:
ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba987654321...
```

**Copie essas 2 chaves** e cole no Railway.

---

## ✅ APÓS ADICIONAR TODAS AS VARIÁVEIS

1. Você verá todas listadas em **Variables**
2. Railway automaticamente vai:
   - ✅ Detectar as mudanças
   - ✅ Refazer o deploy
   - ✅ Mostrar na seção "Deployments"

3. Aguarde o novo deploy terminar (~2-3 minutos)

4. Quando terminar, você verá um ✅ verde

---

## 🆘 SE NÃO ENCONTRAR "Variables"

**Tente este caminho alternativo:**

1. Clique em **Settings** (topo da página)
2. Procure na barra de navegação **Variáveis**
3. Clique

**Se ainda não achar:**

1. Olhe para a **LEFT SIDEBAR (lado esquerdo)**
2. Procure por:
   - **Services** → clique em **rh**
   - No painel à direita, procure por:
     - Settings
     - **Variables** ← deve estar aqui
     - Deploy
     - Monitoring

---

## 📸 DIAGRAMA FINAL

```
https://railway.app
        ↓
[Clique no projeto "rh"]
        ↓
┌─────────────────────────────────────────┐
│  LADO ESQUERDO (Services)               │
│  ├─ rh ← Clique                         │
│  └─ rh-db                               │
│                                         │
│  LADO DIREITO (Abas do serviço "rh")    │
│  ├─ Settings                            │
│  ├─ Variables ← Aqui você configura!    │
│  ├─ Deploy                              │
│  └─ Monitoring                          │
└─────────────────────────────────────────┘
        ↓
[Clique em "Variables"]
        ↓
[Clique em "+ New Variable" para cada uma]
        ↓
✅ PRONTO! Todas adicionadas
        ↓
[Railway faz redeploy automaticamente]
```

---

## 🎯 PRÓXIMO PASSO

Após adicionar TODAS as variáveis:

1. Aguarde o redeploy terminar (sinal de ✅)
2. Você estará **100% pronto para testar**!

---

## 📞 DÚVIDAS?

Se ainda não conseguir localizar "Variables":

1. **Tira uma screenshot** e me envia
2. Ou descreve exatamente o que está vendo na tela
3. Vou orientar com precisão!

---

*Lembre-se: Se não achar "Variables", pode estar em:*
- *Lado direito do projeto (próximo a Settings)*
- *Na aba "Settings" do serviço "rh"*
- *No menu lateral esquerdo sob "Services"*

**Procure por uma ⚙️ ou engrenagem = configurações = Variables!**
