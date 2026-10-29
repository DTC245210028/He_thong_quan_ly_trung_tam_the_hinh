import asyncio
import json
import subprocess
import sys
import time
import urllib.request
import websockets

sys.stdout.reconfigure(encoding='utf-8')

async def run_audit():
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
        target_tab = None
        for t in tabs:
            if "gym-ai-assistant" in t.get("url", ""):
                target_tab = t
                break
        
        if not target_tab:
            for t in tabs:
                if t.get("type") == "page":
                    target_tab = t
                    break

        print(f"Target tab: {target_tab['title']} -> {target_tab['url']}")
        ws_url = target_tab['webSocketDebuggerUrl']

        async with websockets.connect(ws_url) as ws:
            # Enable Runtime and Page
            await ws.send(json.dumps({"id": 1, "method": "Runtime.enable"}))
            await ws.send(json.dumps({"id": 2, "method": "Page.enable"}))

            # Helper to send and wait for eval
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
                        print(f"EXCEPTION THROWN: {details.get('text')} - {details.get('exception', {}).get('description')}")
                    elif resp.get("method") == "Runtime.consoleAPICalled":
                        args = resp.get("params", {}).get("args", [])
                        text = " ".join([str(a.get("value", a.get("description", ""))) for a in args])
                        print(f"CONSOLE [{resp['params']['type']}]: {text}")

            print("\n--- 1. Checking window and initial state ---")
            state_info = await evaluate("JSON.stringify({ activeTab: state.activeTab, currentUser: state.currentUser })")
            print("Initial state:", state_info)

            print("\n--- 2. Testing switchTab calls for all tabs ---")
            tabs_to_test = [
                'home', 'ai-planner', 'gemini-universal', 'ai-nutrition',
                'ai-form-checker', 'ai-inbody', 'clubs', 'events',
                'news', 'calendar', 'packages', 'booking',
                'attendance', 'db-schema', 'admin-panel'
            ]
            for tab_id in tabs_to_test:
                res = await evaluate(f"""
                (function() {{
                    try {{
                        switchTab('{tab_id}');
                        const view = document.getElementById('view-{tab_id}');
                        const isHidden = view ? view.classList.contains('hidden') : true;
                        const isBlock = view ? view.classList.contains('block') : false;
                        const activeTab = state.activeTab;
                        return {{ tabId: '{tab_id}', activeTab: activeTab, viewFound: !!view, isHidden: isHidden, isBlock: isBlock }};
                    }} catch (e) {{
                        return {{ tabId: '{tab_id}', error: e.toString() }};
                    }}
                }})()
                """)
                print(f"switchTab('{tab_id}'): {res}")

            print("\n--- 3. Testing RAG category tab clicks ---")
            rag_groups = ['group1', 'group2', 'group3', 'group4', 'group5']
            for gid in rag_groups:
                res = await evaluate(f"""
                (function() {{
                    try {{
                        switchRagQuestionTab('{gid}');
                        const pills = document.getElementById('rag-questions-pills-container');
                        const buttonsCount = pills ? pills.querySelectorAll('button').length : 0;
                        return {{ groupId: '{gid}', buttonsRendered: buttonsCount }};
                    }} catch (e) {{
                        return {{ groupId: '{gid}', error: e.toString() }};
                    }}
                }})()
                """)
                print(f"switchRagQuestionTab('{gid}'): {res}")

            print("\n--- 4. Testing RAG question click ---")
            q_res = await evaluate("""
            (function() {
                try {
                    askRagQuestionById(1);
                    return { success: true };
                } catch (e) {
                    return { error: e.toString() };
                }
            })()
            """)
            print("askRagQuestionById(1):", q_res)

            print("\n--- 5. Testing Home feature cards click handlers ---")
            feature_cards_res = await evaluate("""
            (function() {
                const results = [];
                switchTab('home');
                const cards = document.querySelectorAll('#view-home [onclick*="switchTab"]');
                cards.forEach((card, idx) => {
                    const oc = card.getAttribute('onclick');
                    try {
                        card.click();
                        results.push({ idx: idx, onclick: oc, currentTab: state.activeTab });
                    } catch (e) {
                        results.push({ idx: idx, onclick: oc, error: e.toString() });
                    }
                });
                return results;
            })()
            """)
            print("Feature cards click results:", feature_cards_res)

    finally:
        proc.terminate()

asyncio.run(run_audit())
