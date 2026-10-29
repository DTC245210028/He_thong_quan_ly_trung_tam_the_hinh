import re

with open(r"C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\index.html", "r", encoding="utf-8") as f:
    html = f.read()

pos = html.find('ai-connection-hub-modal')
if pos != -1:
    modal_html = html[pos:pos+7000]
    ids = re.findall(r'id=["\']([^"\']+)["\']', modal_html)
    for i in ids:
        print(f"ID: {i}")
