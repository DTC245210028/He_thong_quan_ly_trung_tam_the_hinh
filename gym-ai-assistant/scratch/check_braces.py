with open(r"C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\app.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_line = None
for idx, line in enumerate(lines, 1):
    if "function generateUniversalGeminiKnowledge" in line:
        start_line = idx
        break

print(f"generateUniversalGeminiKnowledge starts at line {start_line}")

stack = 0
for idx in range(start_line - 1, len(lines)):
    line_num = idx + 1
    line = lines[idx]
    # Simple counting of { and } ignoring strings/comments roughly
    # Let's count properly
    i = 0
    while i < len(line):
        ch = line[i]
        if ch == '{':
            stack += 1
        elif ch == '}':
            stack -= 1
            if stack == 0:
                print(f"generateUniversalGeminiKnowledge closed at line {line_num}!")
                print(f"Content of line {line_num}: {line.strip()}")
                break
        i += 1
    if stack == 0:
        break
