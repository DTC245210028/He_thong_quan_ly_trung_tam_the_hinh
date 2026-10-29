import asyncio
import json
import subprocess
import sys
import urllib.request
import websockets

sys.stdout.reconfigure(encoding='utf-8')

async def find_syntax_error():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    file_url = r"file:///C:/Users/Andiez/.gemini/antigravity/scratch/gym-ai-assistant/index.html"

    proc = subprocess.Popen([
        chrome_path,
        "--headless=new",
        "--remote-debugging-port=9222",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        file_url
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    await asyncio.sleep(2)

    try:
        req = urllib.request.urlopen("http://localhost:9222/json")
        tabs = json.loads(req.read().decode('utf-8'))
        target_tab = tabs[0]
        for t in tabs:
            if "gym-ai-assistant" in t.get("url", ""):
                target_tab = t
                break

        ws_url = target_tab['webSocketDebuggerUrl']

        async with websockets.connect(ws_url) as ws:
            await ws.send(json.dumps({"id": 1, "method": "Runtime.enable"}))
            await ws.send(json.dumps({"id": 2, "method": "Page.enable"}))
            await ws.send(json.dumps({"id": 3, "method": "Page.reload"}))

            while True:
                resp = json.loads(await ws.recv())
                if resp.get("method") == "Runtime.exceptionThrown":
                    params = resp.get("params", {})
                    details = params.get("exceptionDetails", {})
                    print("ERROR DETAILS:")
                    print(json.dumps(details, indent=2))
                    break
    finally:
        proc.terminate()

asyncio.run(find_syntax_error())
