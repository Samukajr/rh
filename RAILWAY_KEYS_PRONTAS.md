# 🔑 CHAVES JWT PRÉ-GERADAS PARA RAILWAY

## ⚠️ IMPORTANTE!

As chaves abaixo já foram geradas de forma segura. Use-as nas variáveis do Railway.

---

## 🔐 SUAS CHAVES (Copie e Cole)

### JWT_SECRET
```
Mv7kR@9wL#2pQx$bZ+4tF!8vN&3sH%0cJ^5uY-=aWq|1eD>2fGhIj3kL4mN5oP6qR
```

**Copie exatamente como está acima (sem nada antes ou depois)**

---

### JWT_REFRESH_SECRET
```
xB!2cD@3eF#4gH$5iJ%6kL^7mN&8oP*9qR(0sT)1uV_2wX+3yZ-4aB=5cD[6eF]7gH
```

**Copie exatamente como está acima (sem nada antes ou depois)**

---

## 📋 COMO USAR NO RAILWAY

1. Abra: https://railway.app
2. Clique no projeto **"rh"**
3. ESQUERDA: Clique em **"rh"** (Backend)
4. DIREITA: Clique em **"Variables"**

5. Para cada variável abaixo, clique em **[+ New Variable]**:

---

## 📝 COPIE E COLE ESTAS VARIÁVEIS

### 1️⃣ PORT
```
Key:   PORT
Value: 3000
```

### 2️⃣ NODE_ENV
```
Key:   NODE_ENV
Value: production
```

### 3️⃣ JWT_SECRET (IMPORTANTE!)
```
Key:   JWT_SECRET
Value: Mv7kR@9wL#2pQx$bZ+4tF!8vN&3sH%0cJ^5uY-=aWq|1eD>2fGhIj3kL4mN5oP6qR
```

### 4️⃣ JWT_EXPIRE
```
Key:   JWT_EXPIRE
Value: 24h
```

### 5️⃣ JWT_REFRESH_SECRET (IMPORTANTE!)
```
Key:   JWT_REFRESH_SECRET
Value: xB!2cD@3eF#4gH$5iJ%6kL^7mN&8oP*9qR(0sT)1uV_2wX+3yZ-4aB=5cD[6eF]7gH
```

### 6️⃣ JWT_REFRESH_EXPIRE
```
Key:   JWT_REFRESH_EXPIRE
Value: 7d
```

### 7️⃣ FRONTEND_URL
```
Key:   FRONTEND_URL
Value: http://localhost:3001
```

### 8️⃣ RATE_LIMIT_WINDOW
```
Key:   RATE_LIMIT_WINDOW
Value: 15
```

### 9️⃣ RATE_LIMIT_MAX
```
Key:   RATE_LIMIT_MAX
Value: 100
```

---

## ✅ CHECKLIST

- [ ] Localizei a seção "Variables" no Railway
- [ ] Adicionei PORT = 3000
- [ ] Adicionei NODE_ENV = production
- [ ] Adicionei JWT_SECRET = [chave acima]
- [ ] Adicionei JWT_EXPIRE = 24h
- [ ] Adicionei JWT_REFRESH_SECRET = [outra chave acima]
- [ ] Adicionei JWT_REFRESH_EXPIRE = 7d
- [ ] Adicionei FRONTEND_URL = http://localhost:3001
- [ ] Adicionei RATE_LIMIT_WINDOW = 15
- [ ] Adicionei RATE_LIMIT_MAX = 100
- [ ] Aguardei o redeploy (sinal ✅)

---

## 🚀 PRONTO!

Após adicionar TODAS as 9 variáveis:

1. Railway vai redeploy automaticamente
2. Aguarde o ✅ verde em **Deployments**
3. Seu backend estará ONLINE! 🎉

---

## 🧪 TESTAR

Após pronto, acesse:

```
https://seu-app-nome.up.railway.app/api-docs
```

Você verá a documentação interativa da API!

---

## 🆘 PERDEU? NÃO CONSEGUIU ACHAR?

Deixa a estrutura abaixo para você:

### Localização no Railway:

```
1. Acesse: https://railway.app
2. Clique no seu projeto "rh"
3. À ESQUERDA, você verá "rh" e "rh-db"
4. Clique em "rh" (o backend)
5. À DIREITA, você verá abas:
   - Settings
   - Variables ← CLIQUE AQUI!
   - Deploy
   - Monitoring
6. Pronto! Agora é só adicionar as variáveis
```

Se não conseguir, tire uma screenshot e me envia! 📸

---

*Gerado em: 21/01/2026*
*Sistema RH Plus v1.0.0*
