import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\index.html", "r", encoding="utf-8") as f:
    html = f.read()

pos = html.find('ai-provider-panel-anthropic')
if pos != -1:
    print(html[pos:pos+3000])
