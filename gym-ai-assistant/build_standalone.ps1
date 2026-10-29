# Build standalone single-file HTML version
$baseFolder = "C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant"
$html = Get-Content -Raw -Path "$baseFolder\index.html" -Encoding UTF8
$css = Get-Content -Raw -Path "$baseFolder\style.css" -Encoding UTF8
$js = Get-Content -Raw -Path "$baseFolder\app.js" -Encoding UTF8

# Replace <link rel="stylesheet" href="style.css"> with inline style
$html = $html.Replace('<link rel="stylesheet" href="style.css">', "<style>`n$css`n</style>")

# Replace <script src="app.js"></script> with inline script
$html = $html.Replace('<script src="app.js"></script>', "<script>`n$js`n</script>")

Set-Content -Path "$baseFolder\gym_ai_standalone.html" -Value $html -Encoding UTF8
Write-Host "Đã tạo xong file trang web độc lập gym_ai_standalone.html"
