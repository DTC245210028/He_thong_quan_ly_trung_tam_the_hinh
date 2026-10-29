# Simple PowerShell HTTP Server for SmartGym AI Web App
$port = 8080
$folder = "C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "=========================================================="
    Write-Host " SmartGym AI Web App đang chạy tại: http://localhost:$port/"
    Write-Host " Thư mục phục vụ: $folder"
    Write-Host "=========================================================="
} catch {
    Write-Error "Không thể khởi động web server: $_"
    exit 1
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawUrl) -or $rawUrl -eq '/') {
            $rawUrl = "index.html"
        }

        $filePath = Join-Path $folder $rawUrl

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = "text/plain"
            switch ($ext) {
                ".html" { $mime = "text/html; charset=utf-8" }
                ".htm"  { $mime = "text/html; charset=utf-8" }
                ".css"  { $mime = "text/css; charset=utf-8" }
                ".js"   { $mime = "application/javascript; charset=utf-8" }
                ".json" { $mime = "application/json; charset=utf-8" }
                ".png"  { $mime = "image/png" }
                ".jpg"  { $mime = "image/jpeg" }
                ".svg"  { $mime = "image/svg+xml" }
                ".doc"  { $mime = "application/msword" }
                ".docx" { $mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
            }

            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # continue listening on errors
    }
}
