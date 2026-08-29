# Citihaus — Sistema de gestão de contratos

Página única servida como arquivo estático, mais uma função de servidor para a leitura por IA.
Os dados ficam no Supabase. Não há etapa de compilação.

## Arquivos

```
index.html              o sistema inteiro
api/ler-documento.js    função que fala com a Anthropic (leitura de documentos)
README.md               este arquivo
```

Mantenha a pasta `api` com esse nome e na raiz. É assim que a Vercel reconhece a função.

## 1. Subir para o GitHub

Repositório novo, pode ser privado. Envie os três arquivos preservando a pasta `api`.

## 2. Publicar na Vercel

**Add New → Project**, escolha o repositório, Framework Preset **Other**,
Build Command e Output Directory **em branco**, e Deploy.

## 3. Variável de ambiente da IA

Em **Settings → Environment Variables**, adicione:

| Nome | Valor |
|---|---|
| `ANTHROPIC_API_KEY` | sua chave, criada em console.anthropic.com |

Depois de salvar, vá em **Deployments** e faça **Redeploy** — variável nova só vale
para publicações seguintes.

Sem essa chave o sistema inteiro funciona; só a leitura por IA fica indisponível,
avisando na tela.

## 4. Liberar o endereço no Supabase

**Authentication → URL Configuration**: coloque o endereço da Vercel em `Site URL`
e em `Redirect URLs`.

## 5. Primeiro acesso

Na primeira abertura ele pede a URL do projeto e a chave anon — as duas estão no
Supabase, em **Settings → API**. Ficam guardadas no navegador. Se preferir que
ninguém precise digitar, preencha `URL_FIXA` e `CHAVE_FIXA` no começo do script.

Entre com o usuário criado em **Authentication → Users**. Em **Providers → Email**,
desligue `Enable sign ups`.

## O que o sistema faz

**Contratos** — cadastro em tela única: dá para criar proprietário, imóvel, instalações
e locatário sem sair do formulário. Ficha com dados, encargos, instalações, financeiro,
chamados e documentos. Reajuste que aplica o índice, atualiza o encargo, grava histórico
e gera o aditivo em PDF.

**Financeiro** — contas a pagar e a receber separadas em vencidas, próximos 7 dias e
mais adiante. Lançamentos com titularidade e marcação de DRE. Provisionamento com
repetição mensal. Oito relatórios em PDF, incluindo o DRE.

**Chamados** — kanban de quatro colunas, prazo por tipo, aprovação de orçamento acima
de R$ 500 travando a conclusão, e custo virando lançamento ao concluir.

**Auditoria** — 13 regras sobre a carteira (IPTU sem inscrição, contrato não anexado,
apólice vencida, reajuste atrasado, proprietário sem dados de repasse). Abre chamado
de um achado ou de todos.

**Leitura por IA** — contrato, conta de energia ou água, IPTU, condomínio, apólice.
Identifica o tipo, extrai os dados, sugere o contrato pelo endereço, e você decide:
provisionar em contas a pagar, gravar nas instalações, ou abrir como contrato novo.

**WhatsApp** — botão com mensagem pronta na ficha do contrato, no chamado, em pessoas
e nas contas a receber vencidas.

**Documentos** — arquivo guardado no Storage do Supabase, com link temporário para abrir.

## O que ainda não existe

- Emissão de boleto (fica com a Superlógica ou a Kenlo)
- Repasse automático por split de pagamento
- Caixa de entrada do WhatsApp e agente conectado
- Conciliação automática com o sistema de cobrança atual

## Ordem sugerida para começar

1. Cadastre um contrato completo pelo botão **Novo contrato**, criando tudo ali
2. Adicione os encargos na ficha dele
3. Anexe o contrato assinado em Documentos
4. Rode a auditoria no painel e veja o que ela aponta
5. Lance as despesas fixas no financeiro com repetição de 12 meses
