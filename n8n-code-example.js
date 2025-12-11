// ============================================
// CÓDIGO PRONTO PARA COLAR NO N8N
// ============================================
// Use este código no nó "Code" do N8N
// Ele formata automaticamente a mensagem da lead
// ============================================

// Extrair dados do webhook
const nome = $input.item.json.nomeCompleto || 'Não informado';
const whatsapp = $input.item.json.whatsapp || 'Não informado';
const instagram = $input.item.json.instagram || 'Não informado';
const nivel = $input.item.json.nivel || 'Não informado';
const experiencia = $input.item.json.experiencia || 'Não informado';
const retorno = $input.item.json.retorno || 'Não informado';
const investimento = $input.item.json.investimento || 'Não informado';
const situacaoFinanceira = $input.item.json.situacaoFinanceira || 'Não informado';
const dificuldade = $input.item.json.dificuldade || '';

// Formatar data e hora
const agora = new Date();
const dataHora = agora.toLocaleString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

// Construir mensagem formatada
let mensagem = `🚀 *NOVA LEAD - MENTORIA INDIVIDUAL*

━━━━━━━━━━━━━━━━━━━━
👤 *Nome Completo:*
${nome}

📱 *WhatsApp:*
${whatsapp}

📸 *Instagram:*
${instagram}

📊 *Nível:*
${nivel}

💼 *Experiência com PLR:*
${experiencia}`;

// Adicionar dificuldade apenas se existir
if (dificuldade && dificuldade.trim() !== '') {
  mensagem += `\n\n🔴 *Maior Dificuldade:*\n${dificuldade}`;
}

mensagem += `

⏰ *Expectativa de Retorno:*
${retorno}

💰 *Tem 10mil MT para investir?*
${investimento}

💳 *Situação Financeira:*
${situacaoFinanceira}
━━━━━━━━━━━━━━━━━━━━

⏰ *Recebido em:* ${dataHora}`;

// Retornar dados formatados
return {
  mensagem: mensagem,
  mensagemSimples: mensagem.replace(/\*/g, ''), // Versão sem formatação
  dados: {
    nomeCompleto: nome,
    whatsapp: whatsapp,
    instagram: instagram,
    nivel: nivel,
    experiencia: experiencia,
    dificuldade: dificuldade || null,
    retorno: retorno,
    investimento: investimento,
    situacaoFinanceira: situacaoFinanceira,
    dataHora: dataHora
  },
  // Link direto para WhatsApp (se quiser adicionar botão)
  linkWhatsApp: `https://wa.me/${whatsapp.replace(/\D/g, '')}`,
  // Link direto para Instagram
  linkInstagram: `https://instagram.com/${instagram.replace('@', '')}`
};

