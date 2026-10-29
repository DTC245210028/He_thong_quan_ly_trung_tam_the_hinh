$html = Get-Content -Path "C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\index.html" -Raw
$js = Get-Content -Path "C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\app.js" -Raw

$views = [regex]::Matches($html, 'id=["'']view-([^"'']+)["'']') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
$switchTabs = [regex]::Matches($html + $js, 'switchTab\(["'']([^"'']+)["'']\)') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique

Write-Host "--- VIEWS IN HTML ---"
$views | Sort-Object

Write-Host "`n--- switchTab CALLS ---"
$switchTabs | Sort-Object

Write-Host "`n--- MISSING VIEWS FOR switchTab CALLS ---"
foreach ($t in $switchTabs) {
    if ($views -notcontains $t) {
        Write-Host "MISSING: $t"
    }
}
