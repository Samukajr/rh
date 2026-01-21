# 👥 ACESSO DO RH vs COLABORADOR

## 🎯 DOIS TIPOS DE ACESSO

Seu sistema tem **2 interfaces diferentes** baseadas no papel do usuário:

---

## 🔐 ACESSO 1: RH (Gerente de Recursos Humanos)

### **Login:**
```
Email: rh@clinica.com
Senha: rh123
```

### **O RH VÊ:**

```
┌─────────────────────────────────────────────────────┐
│           DASHBOARD RH+                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📊 DASHBOARD                                       │
│  ├─ Total de funcionários: 256                     │
│  ├─ Presentes hoje: 234                            │
│  ├─ Férias aprovadas: 12                           │
│  └─ Atestados pendentes: 5                         │
│                                                     │
│  👥 FUNCIONÁRIOS                                    │
│  ├─ Listar todos (256)                             │
│  ├─ Buscar por nome                                │
│  ├─ Filtrar por departamento                       │
│  ├─ Criar novo funcionário                         │
│  ├─ Editar dados                                   │
│  ├─ Ver histórico de mudanças                      │
│  └─ Deletar funcionário                            │
│                                                     │
│  🏖️ SOLICITAÇÕES DE FÉRIAS                         │
│  ├─ Ver todas as solicitações                      │
│  ├─ Aprovar férias                                 │
│  ├─ Rejeitar férias                                │
│  ├─ Ver calendário de férias                       │
│  └─ Detectar conflitos de data                     │
│                                                     │
│  🏥 ATESTADOS MÉDICOS                              │
│  ├─ Ver atestados pendentes                        │
│  ├─ Aprovar atestados                              │
│  ├─ Rejeitar atestados                             │
│  ├─ Download de documentos                         │
│  └─ Ver histórico completo                         │
│                                                     │
│  ⏰ PONTO ELETRÔNICO                               │
│  ├─ Ver presença de todos                          │
│  ├─ Relatórios mensais                             │
│  ├─ Detectar atrasos                               │
│  ├─ Corrigir ponto (com justificativa)             │
│  └─ Exportar para folha de pagamento               │
│                                                     │
│  💰 HOLERITES                                       │
│  ├─ Gerar holerites                                │
│  ├─ Ver histórico salarial                         │
│  ├─ Calcular férias e décimos                      │
│  ├─ Download em PDF                                │
│  └─ Enviar por email                               │
│                                                     │
│  📋 AUDITORIA                                       │
│  ├─ Ver logs de todas as ações                     │
│  ├─ Quem fez o quê e quando                        │
│  ├─ Filtrar por funcionário                        │
│  └─ Exportar relatório                             │
│                                                     │
│  ⚙️ CONFIGURAÇÕES                                  │
│  ├─ Gerenciar usuários RH                          │
│  ├─ Definir permissões                             │
│  ├─ Backup de dados                                │
│  └─ Logs do sistema                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 👤 ACESSO 2: COLABORADOR (Funcionário)

### **Login:**
```
Email: admin@rhplus.com
Senha: admin123

(Ou qualquer email de funcionário cadastrado)
```

### **O COLABORADOR VÊ:**

```
┌─────────────────────────────────────────────────────┐
│        DASHBOARD COLABORADOR                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  👤 MEU PERFIL                                      │
│  ├─ Meus dados pessoais                            │
│  ├─ Editar foto de perfil                          │
│  ├─ Ver meu departamento                           │
│  ├─ Ver meu gestor                                 │
│  └─ Mudar senha                                    │
│                                                     │
│  💰 MEUS HOLERITES                                  │
│  ├─ Ver últimos holerites                          │
│  ├─ Filtrar por mês/ano                            │
│  ├─ Download em PDF                                │
│  └─ Ver histórico de 12 meses                      │
│                                                     │
│  🏖️ SOLICITAR FÉRIAS                               │
│  ├─ Ver meu saldo de férias                        │
│  ├─ Preencher datas desejadas                      │
│  ├─ Validar automaticamente conflitos              │
│  ├─ Enviar solicitação                             │
│  └─ Acompanhar status (pendente/aprovado)          │
│                                                     │
│  🏥 ATESTADO MÉDICO                                │
│  ├─ Upload de PDF/Imagem                           │
│  ├─ Informar médico e CRM                          │
│  ├─ Datas do atestado                              │
│  ├─ Enviar para aprovação                          │
│  └─ Ver histórico de atestados                     │
│                                                     │
│  ⏰ REGISTRO DE PONTO                               │
│  ├─ Clock In (Registrar entrada)                   │
│  ├─ Clock Out (Registrar saída)                    │
│  ├─ Ver ponto de hoje                              │
│  ├─ Histórico mensal                               │
│  ├─ Horas trabalhadas                              │
│  └─ Alertas de atraso                              │
│                                                     │
│  📊 MEUS DADOS                                      │
│  ├─ Horas trabalhadas (mês atual)                  │
│  ├─ Dias de férias restantes                       │
│  ├─ Atestados pendentes de aprovação               │
│  └─ Solicitações pendentes                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔑 DIFERENÇAS PRINCIPAIS

| Funcionalidade | RH | Colaborador |
|---|---|---|
| Ver todos funcionários | ✅ | ❌ |
| Só seus dados | ✅ | ✅ |
| Aprovar férias | ✅ | ❌ |
| Solicitar férias | ✅ | ✅ |
| Ver holerite de todos | ✅ | ❌ |
| Ver seu holerite | ✅ | ✅ |
| Gerar holerite | ✅ | ❌ |
| Registrar ponto | ✅ | ✅ |
| Editar ponto de outros | ✅ | ❌ |
| Ver logs de auditoria | ✅ | ❌ |
| Aprovar atestados | ✅ | ❌ |
| Enviar atestados | ✅ | ✅ |

---

## 🛡️ SEGURANÇA

```
✅ Cada usuário vê APENAS seus dados
✅ RH tem permissão total
✅ Colaborador tem permissão limitada
✅ Tudo é registrado em logs (LGPD)
✅ Senhas criptografadas
✅ JWT para autenticação segura
```

---

## 🎯 FLUXO DO SISTEMA

### **Cenário: Colaborador solicita férias**

```
1. Colaborador faz login
   └─ Vê seu dashboard

2. Clica em "Solicitar Férias"
   └─ Preenche: Data Início, Data Fim, Motivo

3. Envia solicitação
   └─ Status = PENDENTE

4. RH vê notificação
   └─ Abre solicitações pendentes

5. RH aprova/rejeita
   └─ Colaborador recebe atualização

6. Férias aparecem no calendário
   └─ Sistema evita conflitos automático
```

---

## 📱 EXEMPLO DE USO

### **Início do dia - Colaborador:**
```
1. Faz login: admin@rhplus.com / admin123
2. Clica em "Clock In"
3. Registra entrada (08:00)
4. Trabalha normalmente
5. Ao sair, clica "Clock Out"
6. Sistema calcula horas trabalhadas
```

### **Fim do mês - RH:**
```
1. Faz login: rh@clinica.com / rh123
2. Vai em "Holerites"
3. Clica "Gerar Holerites"
4. Sistema calcula para todos (256 funcionários)
5. Aprova e envia para email
6. Colaboradores recebem e fazem download em PDF
```

---

## 🚀 PRONTO PARA USAR

Quando seu frontend estiver online em Vercel:

```
🌐 https://seu-app.vercel.app

├─ Página de Login (escolhe seu tipo)
│
├─ Se for RH:
│  └─ Acesso completo ao sistema
│
└─ Se for Colaborador:
   └─ Acesso apenas seus dados
```

---

**Seu sistema é intuitivo, seguro e fácil de usar! 🎉**

*Qualquer dúvida sobre funcionalidades, me avisa!*
