# 📚 SEU MANUAL PRÁTICO - Como Gerenciar o Sistema RH

## 🎯 Bem-vindo ao Manual do Usuário

Este manual foi feito para **você**, não para desenvolvedores!

Você vai aprender a usar seu sistema RH no dia-a-dia.

---

## 📖 ÍNDICE RÁPIDO

```
1. Fazer Login
2. Adicionar um Funcionário
3. Gerar Holerite
4. Aprovar Férias
5. Gerenciar Atestados
6. Ver Presença
7. Fazer Relatórios
8. Fazer Backup
```

---

## 1️⃣ FAZER LOGIN

### Você acessa em:
```
https://seu-app.vercel.app
```

### Suas credenciais (Admin):
```
Email: admin@rhplus.com
Senha: admin123
```

### O que você vê após login?
```
┌──────────────────────────────────┐
│        DASHBOARD ADMIN           │
├──────────────────────────────────┤
│                                  │
│  📊 Resumo Rápido                │
│  ├─ 256 Funcionários             │
│  ├─ 234 Presentes hoje           │
│  ├─ 12 Férias aprovadas          │
│  └─ 5 Atestados pendentes        │
│                                  │
│  📋 Menu Principal               │
│  ├─ 👥 Funcionários              │
│  ├─ 🏖️ Férias                    │
│  ├─ 🏥 Atestados                 │
│  ├─ 💰 Holerites                 │
│  ├─ ⏰ Presença                   │
│  ├─ 📊 Relatórios                │
│  ├─ ⚙️ Configurações             │
│  └─ 🔐 Segurança                 │
│                                  │
└──────────────────────────────────┘
```

---

## 2️⃣ ADICIONAR UM FUNCIONÁRIO

### Opção A: Adicionar Um por Um (5 minutos)

```
1. Clique em "👥 Funcionários"

2. Clique em "+ Novo Funcionário"

3. Preencha os campos:
   ┌─────────────────────────────┐
   │ Nome: João Silva            │
   │ Email: joao@clinica.com     │
   │ CPF: 123.456.789-00         │
   │ Cargo: Enfermeiro           │
   │ Departamento: Clínica       │
   │ Salário: R$ 3.500,00        │
   │ Data Admissão: 01/01/2024   │
   └─────────────────────────────┘

4. Clique "Salvar"

5. Pronto! Funcionário criado! ✅
```

### Opção B: Adicionar Vários de Uma Vez (1 minuto)

```
1. Clique em "👥 Funcionários"

2. Clique em "📥 Importar CSV"

3. Baixe o arquivo de exemplo

4. Abra em Excel e preencha (tipo assim):

   Nome          | Email              | CPF          | Cargo
   João Silva    | joao@clinica.com   | 123.456...   | Enfermeiro
   Maria Santos  | maria@clinica.com  | 456.789...   | Psicólogo
   Carlos Costa  | carlos@clinica.com | 789.012...   | Dentista

5. Salve como CSV

6. Volte no sistema e faça upload

7. Pronto! Todos criados de uma vez! ✅
```

---

## 3️⃣ GERAR HOLERITE

### Quando: Geralmente dia 5 ou 10 do mês

```
1. Clique em "💰 Holerites"

2. Escolha o mês: "Janeiro 2025"

3. Clique "Gerar Holerites"

4. Sistema calcula para todos:
   ✅ Salário base
   ✅ Desconto INSS
   ✅ Desconto IR
   ✅ Vale refeição
   ✅ Vale transporte
   ✅ Horas extras
   ✅ Faltas
   ✅ Férias
   ✅ FGTS
   
5. Revise os valores

6. Clique "Aprovar e Enviar por Email"

7. Colaboradores recebem PDF em 2 segundos! ✅
```

### O que colaborador recebe?
```
Assunto: "Seu Holerite - Janeiro 2025"

Anexo: Arquivo PDF com:
├─ Dados pessoais
├─ Dados de acesso
├─ Cálculo de salário
├─ Descontos
├─ Valor líquido
└─ QR Code para acesso ao histórico
```

---

## 4️⃣ APROVAR FÉRIAS

### Rotina:

```
1. Colaborador entra no sistema
   └─ Clica em "🏖️ Solicitar Férias"
   └─ Escolhe as datas
   └─ Envia

2. Você recebe notificação no Dashboard
   └─ "Nova solicitação de férias"

3. Você clica em "🏖️ Férias"

4. Você vê a solicitação:
   ┌──────────────────────────────────┐
   │ João Silva solicita férias       │
   │ De: 15/02/2025                   │
   │ Até: 01/03/2025                  │
   │ Total: 15 dias                   │
   │ Motivo: Viagem em família        │
   │                                  │
   │ [Aprovar] [Rejeitar] [Mais Info]  │
   └──────────────────────────────────┘

5. Você clica "Aprovar"

6. Sistema automaticamente:
   ✅ Desconta dias do saldo
   ✅ Marca no calendário
   ✅ Notifica colaborador
   ✅ Registra no histórico

7. RH vê no calendário: "João fora 15-01/03"

8. Pronto! Férias aprovadas! ✅
```

---

## 5️⃣ GERENCIAR ATESTADOS

### Fluxo:

```
1. Colaborador fica doente

2. Vai no médico e tira atestado

3. Entra no sistema:
   └─ Clica "🏥 Enviar Atestado"
   └─ Tira foto do atestado (celular ou scanner)
   └─ Preenche: Médico, CRM, Data
   └─ Clica "Enviar"

4. Você recebe notificação

5. Você clica em "🏥 Atestados"

6. Você vê:
   ┌──────────────────────────────────┐
   │ Maria - Atestado Médico         │
   │ Data: 20/01/2025                 │
   │ Dias: 3                          │
   │ Médico: Dr. Silva                │
   │ CRM: 123456                      │
   │ [Foto do atestado] [Download]    │
   │                                  │
   │ [Aprovar] [Rejeitar]             │
   └──────────────────────────────────┘

7. Você clica "Aprovar"

8. Sistema:
   ✅ Registra como falta justificada
   ✅ Não desconta do salário
   ✅ Salva documento
   ✅ Notifica colaborador

9. Pronto! Atestado processado! ✅
```

---

## 6️⃣ VER PRESENÇA

### Diariamente:

```
1. Clique em "⏰ Presença"

2. Escolha o mês: "Janeiro 2025"

3. Você vê uma tabela tipo:

   Nome          | Seg 20 | Ter 21 | Qua 22 | Qui 23 | Sex 24
   ─────────────┼────────┼────────┼────────┼────────┼────────
   João          | ✅ 8h  | ✅ 8h  | ❌ --  | ✅ 8h  | ✅ 8h
   Maria         | ✅ 8h  | ⚠️ 7h  | ✅ 8h  | ✅ 8h  | ✅ 8h
   Carlos        | ✅ 8h  | ✅ 8h  | ✅ 8h  | ❌ --  | ✅ 8h

   ✅ = Presente
   ⚠️ = Atraso
   ❌ = Falta

4. Clique em um dia para ver detalhes:
   ├─ Hora entrada: 08:15
   ├─ Hora saída: 17:45
   ├─ Total: 9h 30min
   └─ Extras: 1h 30min

5. Se precisar corrigir, clique "Editar"

6. Pronto! Você monitora a presença! ✅
```

---

## 7️⃣ FAZER RELATÓRIOS

### Que tipo de relatório?

```
1. Clique em "📊 Relatórios"

2. Escolha o tipo:

   📈 Presença Mensal
      └─ Vê quem faltou, atrasos, extras
      └─ Export em Excel
   
   💰 Folha de Pagamento
      └─ Custo total do mês
      └─ Por departamento
      └─ Comparativo mês anterior
   
   🏖️ Férias Utilizadas
      └─ Quanto cada um usou
      └─ Saldo restante
      └─ Próximas datas
   
   🏥 Atestados Médicos
      └─ Quantidade por funcionário
      └─ Dias perdidos
      └─ Custo aproximado
   
   👥 Rotatividade
      └─ Quem entrou/saiu
      └─ Taxa de turnover
      └─ Custos de contratação

3. Selecione o período (mês/ano)

4. Clique "Gerar Relatório"

5. Aparece em tela + opção de Download em Excel

6. Você pode abrir em Excel, editar e compartilhar! ✅
```

---

## 8️⃣ FAZER BACKUP

### Por que fazer backup?
```
Backup = Cópia de segurança de tudo

Se algo der errado, você restaura!
```

### Como fazer?

```
1. Clique em "⚙️ Configurações"

2. Vá em "🔐 Segurança"

3. Clique "💾 Fazer Backup Agora"

4. Seu navegador baixa um arquivo:
   backup-2025-01-21.json

5. Guarde em um local seguro:
   ✅ Seu Google Drive
   ✅ Seu Dropbox
   ✅ Seu Pen Drive
   ✅ Seu HD externo

6. Pronto! Seus dados estão seguros! ✅
```

### Backup automático?
```
✅ SIM! Railway (servidor) faz backup todo dia
✅ Você não precisa fazer nada
✅ Se der problema, recupera automaticamente
```

---

## 🆘 AJUDA RÁPIDA

### Esqueci a senha
```
1. Na tela de login
2. Clique "Esqueci a Senha"
3. Digite seu email
4. Você recebe link por email
5. Clique no link e crie nova senha
```

### Funcionário não consegue fazer login
```
Possíveis motivos:
❌ Funcionário não foi criado no sistema
❌ Email errado
❌ Senhas não batem

Solução:
✅ Verifique se foi criado
✅ Verifique o email correto
✅ Resete a senha dele
```

### Sistema está lento
```
Pode ser:
❌ Sua internet (verifique)
❌ Muitos usuários ao mesmo tempo
❌ Servidor sobrecarregado

Solução:
✅ Aguarde alguns minutos
✅ Atualize a página (Ctrl+F5)
✅ Tente novamente
```

### Dados estão errados
```
Não se preocupe!

✅ Você pode editar qualquer funcionário
✅ Você pode corrigir qualquer informação
✅ Você pode desfazer ações
✅ Tudo fica registrado em logs (segurança)
```

---

## 📞 SUPORTE

Se algo não funcionar:

1. **Primeiro:** Leia este manual
2. **Segundo:** Verifique sua internet
3. **Terceiro:** Atualize a página (Ctrl+F5)
4. **Quarto:** Me chama no WhatsApp/Discord

Vamos resolver juntos! 💪

---

## 🎓 DICAS PROFISSIONAIS

```
✅ Faça backup 1x por semana
✅ Revise permissões dos RH mensalmente
✅ Gere relatórios para análise
✅ Teste com um funcionário antes de treinar todos
✅ Crie um grupo para dúvidas
✅ Registre as senhas em local seguro
```

---

**Parabéns! Você agora é um expert no seu sistema RH!** 🎉

*Qualquer dúvida, me chama!*
