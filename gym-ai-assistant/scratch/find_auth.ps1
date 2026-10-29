$appJs = Get-Content -Path "C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\app.js" -Raw
$lines = $appJs -split "`n"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'updateAuthUI') {
        Write-Host "Line $($i+1): $($lines[$i])"
    }
}
