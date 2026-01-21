# 🚀 GUIA DE DEPLOY RAILWAY.APP - SISTEMA RH PLUS

## ✅ O QUE JÁ FOI PREPARADO PARA VOCÊ:

- ✅ Repositório Git inicializado
- ✅ Arquivo `.env.example` completo
- ✅ Arquivo `railway.json` configurado
- ✅ Arquivo `Procfile` pronto
- ✅ `.gitignore` configurado

---

## 📋 PASSO-A-PASSO PARA DEPLOY (SÓ CLIQUES!)

### **PASSO 1: Criar conta no GitHub** (5 minutos)

1. Acesse: https://github.com/signup
2. Preencha:
   - Email
   - Password
   - Username: seu nome de usuário
3. Clique em "Create account"
4. Verifique seu email

---

### **PASSO 2: Enviar projeto para GitHub** (2 minutos)

1. No seu terminal (PowerShell), execute:

```powershell
cd "e:\APP\novo-projeto-RH"
git remote add origin https://github.com/SEU_USERNAME/novo-projeto-RH.git
git branch -M main
git push -u origin main
```

> **Nota:** Substitua `SEU_USERNAME` pelo seu usuário do GitHub

2. Na primeira vez, o GitHub pedirá para autenticar:
   - Clique em "Authorize with GitHub"
   - Ou gere um Personal Token em: https://github.com/settings/tokens

---

### **PASSO 3: Criar conta Railway.app** (2 minutos)

1. Acesse: https://railway.app
2. Clique em "Login with GitHub"
3. Autorize a conexão
4. Pronto! ✅

---

### **PASSO 4: Criar novo projeto Railway** (5 minutos)

1. Dashboard Railway → "New Project"
2. Clique em "Deploy from GitHub repo"
3. Selecione: `novo-projeto-RH`
4. Configure:
   - Deploy branch: `main`
   - Clique em "Deploy"

**Railway iniciará o build automaticamente!** ⏳

---

### **PASSO 5: Configurar Banco de Dados PostgreSQL** (3 minutos)

1. No Railway Dashboard → seu projeto
2. Clique em "Add" (botão superior direito)
3. Selecione "Add a Database"
4. Escolha "PostgreSQL"
5. Railway criará automaticamente as variáveis de ambiente

---

### **PASSO 6: Configurar Variáveis de Ambiente** (5 minutos)

1. No Railway → Seu projeto → "Variables"
2. Copie essas variáveis do `.env.example` e preencha:

```
PORT=3000
NODE_ENV=production
JWT_SECRET=gerar_uma_chave_aleatoria_segura_aqui (min 32 caracteres)
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=outra_chave_aleatoria_segura_aqui
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=https://seu-dominio-ou-vercel.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

**Importante:** Railway vai fornecer automaticamente:
- `DATABASE_URL` (do PostgreSQL)
- Use estas variáveis!

3. Clique em "Save"

---

### **PASSO 7: Deploy do Frontend (Vercel)** (5 minutos)

1. Acesse: https://vercel.com
2. Clique em "Sign up with GitHub"
3. Autorize
4. Clique em "New Project"
5. Selecione: `novo-projeto-RH`
6. Configure:
   - Framework: **React**
   - Root Directory: **frontend**
   - Environment Variables:
     ```
     REACT_APP_API_URL=https://seu-app-railway.up.railway.app
     ```
7. Clique em "Deploy"

**Vercel iniciará o build automaticamente!** ⏳

---

## 🔗 APÓS O DEPLOY

Você terá:

```
🌐 Backend (Node.js):
   https://seu-app-railway.up.railway.app
   https://seu-app-railway.up.railway.app/api-docs

🌐 Frontend (React):
   https://seu-app-vercel.vercel.app

🗄️ Banco de Dados:
   PostgreSQL gerenciado pelo Railway
```

---

## 🔐 IMPORTANTE - CONFIGURAÇÃO DE SEGURANÇA

### Gerar chaves JWT seguras:

**No PowerShell, execute:**

```powershell
# Gerar JWT_SECRET
$secret = [System.Convert]::ToBase64String((1..32 | % {[byte](Get-Random -Minimum 0 -Maximum 256)}))
Write-Host "JWT_SECRET: $secret"

# Gerar JWT_REFRESH_SECRET
$refresh = [System.Convert]::ToBase64String((1..32 | % {[byte](Get-Random -Minimum 0 -Maximum 256)}))
Write-Host "JWT_REFRESH_SECRET: $refresh"
```

Copie essas chaves para o Railway!

---

## ✅ CHECKLIST FINAL

- [ ] Conta GitHub criada
- [ ] Projeto enviado para GitHub
- [ ] Conta Railway criada
- [ ] Projeto criado no Railway
- [ ] PostgreSQL adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] Backend em produção
- [ ] Frontend deployado no Vercel
- [ ] URLs funcionando

---

## 🆘 TROUBLESHOOTING

### Deploy falha com erro de build:

1. Verifique no Railway → "Deployments" → "Build logs"
2. Erros comuns:
   - Faltam dependências → Execute `npm install` localmente
   - Porta já em uso → Railway redireciona automaticamente
   - Variáveis não configuradas → Adicione em Railway → Variables

### Frontend não conecta ao backend:

1. Verifique `REACT_APP_API_URL` no Vercel
2. Certifique-se que a URL do backend está correta
3. Verifique CORS no backend (já está configurado ✅)

### Banco de dados não conecta:

1. Railway fornece `DATABASE_URL` automaticamente
2. Verifique em Railway → PostgreSQL → "Connect"
3. Copie a URL exatamente como fornecida

---

## 📞 SUPORTE

- 🆘 Problemas com Railway? https://railway.app/docs
- 🆘 Problemas com Vercel? https://vercel.com/docs
- 🆘 Problemas com código? Execute localmente com `npm run dev`

---

## 🎉 PRONTO!

Seu sistema estará **em produção em menos de 30 minutos**! 🚀

Qualquer dúvida durante o processo, me avise!
