$html = Get-Content -Path "C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\index.html" -Raw
$appJs = Get-Content -Path "C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\app.js" -Raw

$onclicks = [regex]::Matches($html, 'onclick=["'']([^"'']+)["'']') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique

Write-Host "--- ALL ONCLICK HANDLERS IN INDEX.HTML ---"
foreach ($oc in $onclicks) {
    # Extract function name
    if ($oc -match '([a-zA-Z0-9_$]+)\(') {
        $fn = $matches[1]
        if ($appJs -notmatch "function\s+$fn\b" -and $appJs -notmatch "$fn\s*=" -and $fn -ne "alert") {
            Write-Host "WARNING: Function $fn NOT found in app.js! Full expression: $oc"
        }
    }
}
