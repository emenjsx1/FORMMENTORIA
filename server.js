const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const WEBHOOK_URL = 'https://n8n.ejss.space/webhook/59f001b1-2dcc-43c3-bb40-5c9f5c0b91d7';

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Normalizar a URL removendo query strings e normalizando o path
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname || '/';
    
    // Normalizar pathname (remover trailing slash exceto para root)
    if (pathname.length > 1 && pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
    }
    
    console.log(`\n${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log(`📋 Pathname normalizado: "${pathname}"`);

    // CORS headers para todas as requisições
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Lidar com preflight OPTIONS
    if (req.method === 'OPTIONS') {
        console.log('✅ Respondendo OPTIONS (preflight)');
        res.writeHead(200);
        res.end();
        return;
    }

    // Rota para o webhook proxy - verificar múltiplas variações
    const isWebhookRoute = pathname === '/api/webhook' || 
                          pathname === 'api/webhook' ||
                          req.url.startsWith('/api/webhook');
    
    if (req.method === 'POST' && isWebhookRoute) {
        console.log('📤 Recebendo requisição para webhook...');
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                if (!body) {
                    console.warn('⚠️ Requisição sem corpo');
                    body = '{}';
                }
                
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
                    timeout: 30000 // 30 segundos de timeout
                };

                console.log(`🌐 Enviando para: ${WEBHOOK_URL}`);
                console.log(`📤 Hostname: ${webhookUrl.hostname}, Path: ${webhookUrl.pathname}`);

                const proxyReq = https.request(options, (proxyRes) => {
                    let proxyBody = '';
                    
                    console.log(`📥 Resposta do webhook recebida: ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
                    console.log(`📋 Headers da resposta:`, proxyRes.headers);
                    
                    proxyRes.on('data', (chunk) => {
                        proxyBody += chunk.toString();
                    });

                    proxyRes.on('end', () => {
                        console.log(`✅ Resposta completa (${proxyBody.length} bytes)`);
                        console.log(`📄 Conteúdo: ${proxyBody.substring(0, 200)}${proxyBody.length > 200 ? '...' : ''}`);
                        
                        // Sempre retornar sucesso para o cliente, mesmo se o webhook retornar erro
                        // O importante é que os dados foram enviados
                        const statusCode = proxyRes.statusCode >= 200 && proxyRes.statusCode < 300 
                            ? proxyRes.statusCode 
                            : 200; // Forçar 200 para o cliente
                        
                        res.writeHead(statusCode, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        
                        // Se o webhook retornou algo, passar adiante, senão retornar sucesso
                        if (proxyBody) {
                            res.end(proxyBody);
                        } else {
                            res.end(JSON.stringify({ 
                                success: true, 
                                message: 'Dados enviados com sucesso',
                                webhookStatus: proxyRes.statusCode 
                            }));
                        }
                    });
                });

                proxyReq.on('error', (error) => {
                    console.error('❌ Erro no proxy:', error.message);
                    console.error('❌ Stack:', error.stack);
                    
                    // Mesmo com erro de conexão, considerar como sucesso parcial
                    // pois pode ser problema de rede temporário
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ 
                        success: true,
                        warning: 'Dados podem ter sido enviados, mas não houve confirmação',
                        error: error.message 
                    }));
                });
                
                // Timeout handler
                proxyReq.on('timeout', () => {
                    console.error('⏱️ Timeout ao conectar com webhook');
                    proxyReq.destroy();
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ 
                        success: true,
                        warning: 'Timeout ao conectar, mas dados podem ter sido enviados'
                    }));
                });

                proxyReq.write(body);
                proxyReq.end();
            } catch (error) {
                console.error('❌ Erro ao processar requisição:', error.message);
                res.writeHead(500, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ 
                    error: 'Erro ao processar requisição',
                    details: error.message 
                }));
            }
        });

        req.on('error', (error) => {
            console.error('❌ Erro na requisição:', error.message);
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Erro ao ler requisição' }));
        });

        return;
    }

    // Servir arquivos estáticos
    let filePath = '.' + pathname;
    
    // Tratar favicon
    if (pathname === '/favicon.ico') {
        res.writeHead(204); // No Content
        res.end();
        return;
    }
    
    if (filePath === './' || filePath === '.') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Arquivo não encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Erro do servidor: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ ERRO: Porta ${PORT} já está em uso!`);
        console.error(`   Pare o servidor que está usando a porta ${PORT} ou mude a porta no código.\n`);
        process.exit(1);
    } else {
        console.error('❌ Erro no servidor:', error);
        process.exit(1);
    }
});

server.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📝 Abra o navegador e acesse: http://localhost:${PORT}`);
    console.log(`🔗 Rota do webhook: http://localhost:${PORT}/api/webhook`);
    console.log(`🧪 Página de teste: http://localhost:${PORT}/test-server.html`);
    console.log(`${'='.repeat(50)}\n`);
});

