import subprocess
import json
import time

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
file_url = r"file:///C:/Users/Andiez/.gemini/antigravity/scratch/gym-ai-assistant/index.html"

# Run chrome headless with logging
cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--enable-logging",
    "--v=1",
    "--dump-dom",
    file_url
]

res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
print("Return code:", res.returncode)
print("Stdout length:", len(res.stdout))
print("Stderr:", res.stderr[:2000])
