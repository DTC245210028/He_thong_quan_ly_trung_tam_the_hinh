import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\app.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx in range(1775, 2765):
    line_num = idx + 1
    line = lines[idx]
    stripped = line.strip()
    if stripped.startswith('if ') or stripped.startswith('function ') or stripped.startswith('// ---') or stripped == '}' or stripped == '};' or stripped == '}}':
        print(f"L{line_num:4d}: {stripped[:80]}")
