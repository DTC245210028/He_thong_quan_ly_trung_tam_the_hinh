import re

with open(r"C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\app.js", "r", encoding="utf-8") as f:
    code = f.read()

# Let's search for ``` occurrences in app.js
matches = [m.start() for m in re.finditer(r'```', code)]
print(f"Total occurrences of ``` in app.js: {len(matches)}")

lines = code.split('\n')
for idx, line in enumerate(lines, 1):
    if '```' in line:
        print(f"Line {idx}: {line}")
