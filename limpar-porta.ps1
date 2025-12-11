# Script para limpar processos usando a porta 3000
Write-Host "🔍 Procurando processos na porta 3000..." -ForegroundColor Yellow

$connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($connections) {
    $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    
    Write-Host "📋 Processos encontrados:" -ForegroundColor Cyan
    foreach ($pid in $processes) {
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "   PID: $pid - Nome: $($proc.ProcessName) - Caminho: $($proc.Path)" -ForegroundColor White
        }
    }
    
    Write-Host "`n⚠️  Deseja parar esses processos? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq 'S' -or $response -eq 's') {
        foreach ($pid in $processes) {
            try {
                Stop-Process -Id $pid -Force -ErrorAction Stop
                Write-Host "✅ Processo $pid parado com sucesso" -ForegroundColor Green
            } catch {
                Write-Host "❌ Erro ao parar processo $pid : $_" -ForegroundColor Red
            }
        }
        Write-Host "`n✅ Porta 3000 está livre agora!" -ForegroundColor Green
    } else {
        Write-Host "❌ Operação cancelada" -ForegroundColor Red
    }
} else {
    Write-Host "✅ Nenhum processo encontrado na porta 3000" -ForegroundColor Green
    Write-Host "   A porta está livre para uso!" -ForegroundColor Green
}

Write-Host "`nPressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

