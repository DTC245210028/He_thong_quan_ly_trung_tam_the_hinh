import subprocess
import time
import json
import urllib.request
import urllib.error

# Start Chrome in headless mode with remote debugging
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
proc = subprocess.Popen([
    chrome_path,
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    r"file:///C:/Users/Andiez/.gemini/antigravity/scratch/gym-ai-assistant/index.html"
], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

print("Started Chrome PID:", proc.pid)
time.sleep(2)

try:
    req = urllib.request.urlopen("http://localhost:9222/json")
    tabs = json.loads(req.read().decode())
    print("Open tabs in Chrome:")
    for t in tabs:
        print("Tab:", t.get("title"), t.get("url"), t.get("id"))
finally:
    proc.terminate()
