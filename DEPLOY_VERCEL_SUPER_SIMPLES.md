# 🚀 DEPLOY VERCEL - GUIA BEM SIMPLES (Sem Termos Técnicos)

## 🎯 O Que Você Vai Fazer

Basicamente, você vai colocar seu sistema **online** em um site.

Antes: Sistema rodando só no seu PC
Depois: Sistema rodando em um servidor (qualquer um acessa de qualquer lugar)

---

## 📍 PASSO-A-PASSO SUPER SIMPLES

### **PASSO 1: Acesse o site Vercel**

Abra seu navegador e vá para:
```
https://vercel.com
```

Você verá uma página assim:

```
┌────────────────────────────┐
│   VERCEL                   │
│                            │
│   "Sign Up" (Botão azul)   │
└────────────────────────────┘
```

### **PASSO 2: Clique em "Sign Up"**

Escolha: **"Sign up with GitHub"**

(Você já criou conta no GitHub antes, então é fácil!)

### **PASSO 3: Autorize a conexão**

GitHub vai pedir: "Vercel quer acessar seus projetos?"

Clique: **"Authorize vercel"**

---

## 🎬 PASSO 4: Importar seu projeto

Agora você está no Dashboard do Vercel.

Procure por:
```
"Add New" → "Project"
```

Clique em **"Project"**

---

## 📦 PASSO 5: Escolher seu repositório

Você vai ver seus projetos do GitHub.

**Procure por:** `Samukajr/rh`

Clique em **"Import"**

---

## ⚙️ PASSO 6: Configurar (IMPORTANTE!)

Agora aparece uma tela com configurações. Você vai ver:

```
Project Name: 
  rh-yuna (escreva um nome)

Framework Preset:
  ❌ Deixe como está (não mude!)

Root Directory:
  ✅ Digite: frontend
  (ISSO É IMPORTANTE!)
```

---

## 🔑 PASSO 7: Adicionar a Variável de Ambiente

Isso é um detalhe técnico, mas é importante.

Procure por uma seção chamada:
```
"Environment Variables"
```

Você vai adicionar:

```
Nome: REACT_APP_API_URL
Valor: https://web-production-a9f8.up.railway.app
```

Clique **"Save"** ou **"Add"**

---

## 🚀 PASSO 8: Fazer Deploy (FINAL!)

Procure por um botão grande azul que diz:
```
"Deploy"
```

Clique nele!

Vai aparecer uma barra de progresso tipo:
```
□□□□□ Deploying... 50%
```

Aguarde 2-5 minutos. Quando terminar:

```
✅ Production Deployed!
🌐 https://seu-app-name.vercel.app
```

Pronto! Seu sistema está ONLINE! 🎉

---

## 🔍 PASSO 9: Testar

Copie o link que apareceu (algo como `seu-app-name.vercel.app`)

Abra em uma aba nova do navegador.

Você vai ver a página de login do seu RH!

---

## 🔐 PASSO 10: Fazer Login

Use essas credenciais:

**Email:** admin@rhplus.com
**Senha:** admin123

Você vai ver seu Dashboard!

---

## ✅ PRONTO!

Seu sistema está 100% online agora! 🎉

Compartilhe o link com:
- 👥 Seus RH
- 👥 Seus colaboradores
- 👥 Seus gerentes

Todos podem acessar de qualquer lugar!

---

## 🆘 E SE DEU ERRO?

### Erro: "Cannot find module"
**Solução:** 
1. Volte na tela de configuração
2. Verifique se colocou "frontend" no Root Directory
3. Clique "Deploy" novamente

### Erro: "Page not found"
**Solução:**
1. Espere 5 minutos
2. Atualize a página (Ctrl + F5)
3. Se ainda não funcionar, me avisa!

### Erro: "API não conecta"
**Solução:**
1. Verifique se a variável está correta:
   `https://web-production-a9f8.up.railway.app`
2. Se estiver errada, edite na seção "Settings" do Vercel

---

## 📱 DICA FINAL

Depois que estiver online, você pode:
- ✅ Acessar do PC
- ✅ Acessar do celular
- ✅ Compartilhar o link
- ✅ Mostrar para seu chefe
- ✅ Usar em qualquer navegador

**Tudo funciona igual!** 🎊

---

**Agora é com você! Qualquer dúvida, me chama! 💪**
