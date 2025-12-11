const http = require('http');

console.log('🔍 Diagnosticando servidor...\n');

// Testar se a porta está livre
const testPort = 3000;
const testServer = http.createServer();

testServer.listen(testPort, () => {
    console.log(`✅ Porta ${testPort} está livre e disponível`);
    testServer.close(() => {
        console.log('✅ Teste concluído - Porta pode ser usada\n');
        process.exit(0);
    });
});

testServer.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Porta ${testPort} já está em uso!`);
        console.error(`   Algo está rodando na porta ${testPort}`);
        console.error(`   Solução: Pare o processo que está usando a porta ou mude a porta\n`);
        
        // Tentar descobrir qual processo está usando
        console.log('💡 Para descobrir qual processo está usando a porta:');
        console.log('   Windows: netstat -ano | findstr :3000');
        console.log('   Linux/Mac: lsof -i :3000\n');
    } else {
        console.error('❌ Erro:', error.message);
    }
    process.exit(1);
});

