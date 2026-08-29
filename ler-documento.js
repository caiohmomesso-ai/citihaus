// Função serverless da Vercel — lê documentos com a API da Anthropic.
// A chave fica na variável de ambiente ANTHROPIC_API_KEY, nunca no navegador.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Use POST.' });
  }
  const chave = process.env.ANTHROPIC_API_KEY;
  if (!chave) {
    return res.status(500).json({
      erro: 'Chave da Anthropic não configurada. Adicione ANTHROPIC_API_KEY nas variáveis de ambiente da Vercel.'
    });
  }

  try {
    const { arquivo, tipoArquivo, carteira } = req.body || {};
    if (!arquivo) return res.status(400).json({ erro: 'Nenhum arquivo recebido.' });

    const ehPdf = tipoArquivo === 'application/pdf';
    const bloco = ehPdf
      ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: arquivo } }
      : { type: 'image',    source: { type: 'base64', media_type: tipoArquivo, data: arquivo } };

    const instrucao = `Você lê documentos da imobiliária Citihaus e devolve dados estruturados.

CARTEIRA DE CONTRATOS (para sugerir o vínculo pelo endereço, unidade ou nome das partes):
${carteira || 'nenhum contrato cadastrado ainda'}

Devolva SOMENTE um objeto JSON válido, sem markdown e sem texto em volta:
{"tipo":"Contrato de locação|Conta de energia|Conta de água|IPTU|Condomínio|Apólice de seguro|Boleto|Orçamento|Outro",
"contrato_sugerido":"código da carteira ou null","confianca_vinculo":"alta|media|baixa",
"emissor":null,"titular":null,"identificador":null,"tipo_identificador":"UC|matrícula|inscrição|apólice|contrato|null",
"competencia":null,"vencimento":"AAAA-MM-DD ou null","valor":null,
"contrato_dados":{"imovel":null,"endereco":null,"proprietario":null,"proprietario_doc":null,
 "locatario":null,"locatario_doc":null,"uso":null,"inicio":null,"fim":null,"aluguel":null,
 "dia_vencimento":null,"indice":null,"garantia":null,"taxa_adm":null,"comissao":null,
 "seguradora":null,"valor_segurado":null,"venc_seguro":null},
"observacoes":"o que não conseguiu ler com segurança"}

Regras: use null onde não encontrar, nunca invente. "identificador" é o número que identifica a instalação —
UC na conta de energia, matrícula na de água, inscrição no IPTU, número da apólice no seguro.
Preencha "contrato_dados" só quando o tipo for Contrato de locação.
Datas em AAAA-MM-DD. Valores em número puro, sem R$ e sem separador de milhar.
taxa_adm em porcentagem (10 para 10%).`;

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': chave,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: [bloco, { type: 'text', text: instrucao }] }]
      })
    });

    if (!r.ok) {
      const detalhe = await r.text();
      return res.status(502).json({ erro: 'A leitura falhou (' + r.status + ').', detalhe });
    }

    const data = await r.json();
    const bruto = (data.content || [])
      .filter(b => b.type === 'text').map(b => b.text).join('')
      .replace(/```json|```/g, '').trim();

    try {
      return res.status(200).json(JSON.parse(bruto));
    } catch {
      return res.status(502).json({ erro: 'A resposta veio fora do formato esperado.', bruto });
    }
  } catch (ex) {
    return res.status(500).json({ erro: ex.message });
  }
}

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };
