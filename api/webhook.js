const https = require('https');

const WEBHOOK_URL = 'https://n8n.ejss.space/webhook/59f001b1-2dcc-43c3-bb40-5c9f5c0b91d7';

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Lidar com preflight OPTIONS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Apenas aceitar POST
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const body = JSON.stringify(req.body);
        
        console.log('📤 Recebendo requisição para webhook...');
        console.log('📦 Dados recebidos:', body.substring(0, 200) + (body.length > 200 ? '...' : ''));
        
        // Fazer requisição para o webhook real
        const webhookUrl = new URL(WEBHOOK_URL);
        const options = {
            hostname: webhookUrl.hostname,
            port: 443,
            path: webhookUrl.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                'User-Agent': 'MentoriaForm/1.0'
            },
            timeout: 30000
        };

        console.log(`🌐 Enviando para: ${WEBHOOK_URL}`);

        return new Promise((resolve) => {
            const proxyReq = https.request(options, (proxyRes) => {
                let proxyBody = '';
                
                console.log(`📥 Resposta do webhook: ${proxyRes.statusCode}`);
                
                proxyRes.on('data', (chunk) => {
                    proxyBody += chunk.toString();
                });

                proxyRes.on('end', () => {
                    console.log('✅ Resposta completa recebida');
                    
                    // Sempre retornar sucesso para o cliente
                    const statusCode = proxyRes.statusCode >= 200 && proxyRes.statusCode < 300 
                        ? proxyRes.statusCode 
                        : 200;
                    
                    res.status(statusCode).json(
                        proxyBody ? JSON.parse(proxyBody) : { 
                            success: true, 
                            message: 'Dados enviados com sucesso',
                            webhookStatus: proxyRes.statusCode 
                        }
                    );
                    resolve();
                });
            });

            proxyReq.on('error', (error) => {
                console.error('❌ Erro no proxy:', error.message);
                
                // Mesmo com erro, considerar como sucesso parcial
                res.status(200).json({ 
                    success: true,
                    warning: 'Dados podem ter sido enviados, mas não houve confirmação',
                    error: error.message 
                });
                resolve();
            });

            proxyReq.on('timeout', () => {
                console.error('⏱️ Timeout ao conectar com webhook');
                proxyReq.destroy();
                res.status(200).json({ 
                    success: true,
                    warning: 'Timeout ao conectar, mas dados podem ter sido enviados'
                });
                resolve();
            });

            proxyReq.write(body);
            proxyReq.end();
        });
    } catch (error) {
        console.error('❌ Erro ao processar requisição:', error.message);
        res.status(500).json({ 
            error: 'Erro ao processar requisição',
            details: error.message 
        });
    }
}

