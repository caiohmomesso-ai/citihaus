# Citihaus — Sistema de gestão de contratos

Aplicação de página única, servida como arquivo estático. Os dados ficam no Supabase.
Não tem etapa de compilação: o que está no repositório é o que roda.

## 1. Antes de publicar

Abra o `index.html` e troque as duas linhas do começo do script:

```js
const SUPABASE_URL  = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON = 'SUA-CHAVE-ANON-AQUI';
```

Os dois valores estão no Supabase, em **Settings → API**:
- `Project URL` vai em `SUPABASE_URL`
- `anon public` vai em `SUPABASE_ANON`

A chave anon é pública por natureza — ela pode ficar no código. Quem protege os
dados é o RLS que já está ligado no banco: sem login válido, ela não lê nada.
A chave que **nunca** pode aparecer aqui é a `service_role`.

## 2. Subir para o GitHub

Crie um repositório novo (pode ser privado) e envie estes dois arquivos:

```
index.html
README.md
```

Pelo site do GitHub: **Add file → Upload files**, arraste os dois, e confirme.

## 3. Publicar na Vercel

1. Em **Add New → Project**, conecte a conta do GitHub e escolha o repositório
2. Framework Preset: **Other**
3. Root Directory: deixe na raiz
4. Build Command e Output Directory: deixe em branco
5. Deploy

Sai um endereço do tipo `citihaus.vercel.app`. A partir daí, toda alteração
enviada ao GitHub publica sozinha em alguns segundos.

## 4. Liberar o endereço no Supabase

Em **Authentication → URL Configuration**, coloque o endereço da Vercel em
`Site URL` e também em `Redirect URLs`.

## 5. Primeiro acesso

Entre com o e-mail e a senha criados em **Authentication → Users**.
Em **Providers → Email**, desligue `Enable sign ups` para ninguém mais criar conta.

## Ordem de cadastro

O banco está vazio e as tabelas dependem umas das outras. Cadastre nesta ordem:

1. **Pessoas** — proprietários primeiro, depois locatários
2. **Imóveis** — cada um ligado ao seu proprietário, já com as instalações
3. **Contratos** — ligam o imóvel ao locatário

## O que já funciona

- Login com usuário do Supabase
- Pessoas, imóveis e instalações
- Contratos com encargos, reajustes e alertas de vencimento
- Botão de WhatsApp com a mensagem pronta

## O que ainda vem

- Financeiro: contas a pagar e receber, DRE, relatórios em PDF
- Chamados com kanban e aprovação de orçamento
- Auditoria da carteira
- Leitura de documentos por IA
- Upload de arquivo para o Storage
- Agente de WhatsApp

## Se algo der errado

**Tela de login não passa:** confira se o e-mail foi confirmado em Authentication → Users.

**Entra mas não carrega:** provavelmente as políticas de RLS. Confira no SQL Editor:
```sql
select tablename, policyname from pg_policies where schemaname='public';
```

**Erro ao salvar contrato:** o código precisa ser único, e o imóvel tem que existir antes.
