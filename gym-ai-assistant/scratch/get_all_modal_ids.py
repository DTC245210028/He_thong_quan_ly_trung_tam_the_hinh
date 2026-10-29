import re

with open(r"C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\index.html", "r", encoding="utf-8") as f:
    html = f.read()

start = html.find('id="ai-connection-hub-modal"')
end = html.find('<!-- END AI CONNECTION HUB MODAL -->')
if end == -1:
    end = start + 10000

modal_html = html[start:end]
ids = re.findall(r'id=["\']([^"\']+)["\']', modal_html)
print(f"Total IDs in modal: {len(ids)}")
for i in ids:
    print(f" - {i}")
