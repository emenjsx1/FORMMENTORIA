# Formulário Mentoria Individual

Formulário moderno com tema escuro e design responsivo para coleta de dados de mentoria.

## 🚀 Como Usar

### Opção 1: Servidor Local (Recomendado - Resolve CORS)

1. **Instale o Node.js** (se ainda não tiver):
   - Baixe em: https://nodejs.org/

2. **Inicie o servidor**:
   ```bash
   npm start
   ```

3. **Abra no navegador**:
   - Acesse: `http://localhost:3000`

### Opção 2: Servidor Web (Produção)

Se você hospedar os arquivos em um servidor web (GitHub Pages, Netlify, Vercel, etc.), o CORS não será um problema e você pode usar os arquivos diretamente.

## 📁 Estrutura de Arquivos

- `index.html` - Página principal do formulário
- `obrigado.html` - Página de agradecimento
- `styles.css` - Estilos do formulário
- `script.js` - Lógica JavaScript
- `server.js` - Servidor local para proxy do webhook
- `package.json` - Configuração do Node.js

## 🔧 Configuração do Webhook

O formulário envia os dados para:
```
https://n8n.ejss.space/webhook/59f001b1-2dcc-43c3-bb40-5c9f5c0b91d7
```

Através do proxy local em `/api/webhook` quando usando o servidor Node.js.

## 📱 Recursos

- ✅ Design moderno com tema escuro
- ✅ 100% responsivo para mobile
- ✅ Validação em tempo real
- ✅ Campos condicionais
- ✅ Integração com webhook
- ✅ Página de agradecimento

## ⚠️ Nota sobre CORS

Se você abrir o arquivo `index.html` diretamente no navegador (file://), você encontrará erros de CORS. Use sempre o servidor local ou hospede em um servidor web.

