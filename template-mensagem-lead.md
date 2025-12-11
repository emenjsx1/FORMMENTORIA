# 📨 Template de Mensagem para Nova Lead

## 🎯 Versão Simples (Texto)

```
🚀 NOVA LEAD RECEBIDA!

👤 Nome: {{nomeCompleto}}
📱 WhatsApp: {{whatsapp}}
📸 Instagram: {{instagram}}
📊 Nível: {{nivel}}
💼 Experiência PLR: {{experiencia}}
⏰ Expectativa de Retorno: {{retorno}}
💰 Investimento Disponível: {{investimento}}
💳 Situação Financeira: {{situacaoFinanceira}}

{{#if dificuldade}}
🔴 Maior Dificuldade: {{dificuldade}}
{{/if}}

⏰ Recebido em: {{dataHora}}
```

## 📱 Versão WhatsApp (Formatada)

```
🚀 *NOVA LEAD - MENTORIA INDIVIDUAL*

━━━━━━━━━━━━━━━━━━━━
👤 *Nome Completo:*
{{nomeCompleto}}

📱 *WhatsApp:*
{{whatsapp}}

📸 *Instagram:*
{{instagram}}

📊 *Nível:*
{{nivel}}

💼 *Experiência com PLR:*
{{experiencia}}

⏰ *Expectativa de Retorno:*
{{retorno}}

💰 *Tem 10mil MT para investir?*
{{investimento}}

💳 *Situação Financeira:*
{{situacaoFinanceira}}
━━━━━━━━━━━━━━━━━━━━

{{#if dificuldade}}
🔴 *Maior Dificuldade:*
{{dificuldade}}
━━━━━━━━━━━━━━━━━━━━
{{/if}}

⏰ *Recebido em:* {{dataHora}}
```

## 📧 Versão Email (HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .field { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #6366f1; }
        .label { font-weight: bold; color: #6366f1; }
        .value { margin-top: 5px; color: #1f2937; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 NOVA LEAD RECEBIDA</h1>
            <p>Formulário de Mentoria Individual</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">👤 Nome Completo:</div>
                <div class="value">{{nomeCompleto}}</div>
            </div>
            
            <div class="field">
                <div class="label">📱 WhatsApp:</div>
                <div class="value">{{whatsapp}}</div>
            </div>
            
            <div class="field">
                <div class="label">📸 Instagram:</div>
                <div class="value">{{instagram}}</div>
            </div>
            
            <div class="field">
                <div class="label">📊 Nível:</div>
                <div class="value">{{nivel}}</div>
            </div>
            
            <div class="field">
                <div class="label">💼 Experiência com PLR Nacional:</div>
                <div class="value">{{experiencia}}</div>
            </div>
            
            {{#if dificuldade}}
            <div class="field">
                <div class="label">🔴 Maior Dificuldade:</div>
                <div class="value">{{dificuldade}}</div>
            </div>
            {{/if}}
            
            <div class="field">
                <div class="label">⏰ Expectativa de Retorno:</div>
                <div class="value">{{retorno}}</div>
            </div>
            
            <div class="field">
                <div class="label">💰 Tem 10mil MT para investir?</div>
                <div class="value">{{investimento}}</div>
            </div>
            
            <div class="field">
                <div class="label">💳 Situação Financeira:</div>
                <div class="value">{{situacaoFinanceira}}</div>
            </div>
        </div>
        <div class="footer">
            <p>Recebido em: {{dataHora}}</p>
        </div>
    </div>
</body>
</html>
```

## 🔧 Como Usar no N8N

### Passo 1: Configure os Data Fields

No N8N, você terá acesso aos seguintes campos:
- `nomeCompleto`
- `whatsapp`
- `instagram`
- `nivel` (INICIANTE, INTERMÉDIARIO, AVANÇADO)
- `experiencia` (SIM, NÃO)
- `dificuldade` (apenas se experiencia = SIM)
- `retorno`
- `investimento` (SIM, NÃO)
- `situacaoFinanceira`

### Passo 2: Adicione Data e Hora

No N8N, adicione um nó "Set" ou use expressão:
```javascript
{{ $now.format('DD/MM/YYYY HH:mm:ss') }}
```

### Passo 3: Substitua os Placeholders

No template acima, substitua:
- `{{nomeCompleto}}` → `{{ $json.nomeCompleto }}`
- `{{whatsapp}}` → `{{ $json.whatsapp }}`
- `{{instagram}}` → `{{ $json.instagram }}`
- `{{nivel}}` → `{{ $json.nivel }}`
- `{{experiencia}}` → `{{ $json.experiencia }}`
- `{{dificuldade}}` → `{{ $json.dificuldade }}`
- `{{retorno}}` → `{{ $json.retorno }}`
- `{{investimento}}` → `{{ $json.investimento }}`
- `{{situacaoFinanceira}}` → `{{ $json.situacaoFinanceira }}`
- `{{dataHora}}` → `{{ $now.format('DD/MM/YYYY HH:mm:ss') }}`

## 📋 Exemplo Prático no N8N

### Nó "Set" para formatar mensagem:

```javascript
// Mensagem formatada
const nome = $json.nomeCompleto || 'Não informado';
const whatsapp = $json.whatsapp || 'Não informado';
const instagram = $json.instagram || 'Não informado';
const nivel = $json.nivel || 'Não informado';
const experiencia = $json.experiencia || 'Não informado';
const retorno = $json.retorno || 'Não informado';
const investimento = $json.investimento || 'Não informado';
const situacaoFinanceira = $json.situacaoFinanceira || 'Não informado';
const dificuldade = $json.dificuldade || '';
const dataHora = $now.format('DD/MM/YYYY HH:mm:ss');

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

if (dificuldade) {
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

return { mensagem };
```

## 🎨 Versão JSON (Para Integrações)

```json
{
  "tipo": "nova_lead_mentoria",
  "timestamp": "{{dataHora}}",
  "dados": {
    "nomeCompleto": "{{nomeCompleto}}",
    "whatsapp": "{{whatsapp}}",
    "instagram": "{{instagram}}",
    "nivel": "{{nivel}}",
    "experiencia": "{{experiencia}}",
    "dificuldade": "{{dificuldade}}",
    "retorno": "{{retorno}}",
    "investimento": "{{investimento}}",
    "situacaoFinanceira": "{{situacaoFinanceira}}"
  }
}
```

