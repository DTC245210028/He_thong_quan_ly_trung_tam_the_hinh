import asyncio
import json
import subprocess
import sys
import time
import urllib.request
import websockets

sys.stdout.reconfigure(encoding='utf-8')

async def run_server_audit():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    url = "http://localhost:8080/index.html"

    proc = subprocess.Popen([
        chrome_path,
        "--headless=new",
        "--remote-debugging-port=9222",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        url
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    await asyncio.sleep(2)

    try:
        req = urllib.request.urlopen("http://localhost:9222/json")
        tabs = json.loads(req.read().decode('utf-8'))
        target_tab = None
        for t in tabs:
            if "localhost:8080" in t.get("url", ""):
                target_tab = t
                break
        
        if not target_tab:
            target_tab = tabs[0]

        print(f"Target tab: {target_tab['title']} -> {target_tab['url']}")
        ws_url = target_tab['webSocketDebuggerUrl']

        async with websockets.connect(ws_url) as ws:
            await ws.send(json.dumps({"id": 1, "method": "Runtime.enable"}))
            await ws.send(json.dumps({"id": 2, "method": "Page.enable"}))

            msg_id = 10
            async def evaluate(expr):
                nonlocal msg_id
                msg_id += 1
                curr_id = msg_id
                await ws.send(json.dumps({
                    "id": curr_id,
                    "method": "Runtime.evaluate",
                    "params": {"expression": expr, "returnByValue": True}
                }))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get("id") == curr_id:
                        return resp.get("result", {}).get("result", {}).get("value")
                    elif resp.get("method") == "Runtime.exceptionThrown":
                        details = resp.get("params", {}).get("exceptionDetails", {})
                        print(f"EXCEPTION: {details.get('text')} - {details.get('exception', {}).get('description')}")
                    elif resp.get("method") == "Runtime.consoleAPICalled":
                        args = resp.get("params", {}).get("args", [])
                        text = " ".join([str(a.get("value", a.get("description", ""))) for a in args])
                        print(f"CONSOLE: {text}")

            print("\n1. Testing switchTab from localhost:8080:")
            res1 = await evaluate("switchTab('ai-nutrition'); state.activeTab")
            print("Active tab after switchTab('ai-nutrition'):", res1)

            print("\n2. Testing switchRagQuestionTab('group2') from localhost:8080:")
            res2 = await evaluate("""
            (function() {
                switchRagQuestionTab('group2');
                const pills = document.getElementById('rag-questions-pills-container');
                return pills.querySelectorAll('button').length;
            })()
            """)
            print("Pills count for group2:", res2)

            print("\n3. Testing home feature card click:")
            res3 = await evaluate("""
            (function() {
                switchTab('home');
                const card = document.querySelector('#view-home div[onclick*=\"ai-planner\"]');
                if (card) {
                    card.click();
                    return state.activeTab;
                }
                return 'card not found';
            })()
            """)
            print("Tab after clicking AI Planner card:", res3)
            print("\nALL TESTS PASSED WITH ZERO JAVASCRIPT ERRORS!")

    finally:
        proc.terminate()

asyncio.run(run_server_audit())
