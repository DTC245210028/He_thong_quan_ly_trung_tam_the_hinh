import re

with open(r"C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\app.js", "r", encoding="utf-8") as f:
    js = f.read()

missing = [
    'ai-gateway-toast',
    'btn-studio-audio-toggle',
    'btn-studio-mic',
    'input-claude-key-val',
    'input-gemini-key-val',
    'input-ollama-model-val',
    'input-ollama-url-val',
    'input-openai-key-val',
    'input-openrouter-key-val',
    'ollama-test-result',
    'studio-active-avatar',
    'studio-active-title',
    'studio-audio-label',
    'studio-chat-input',
    'studio-chat-stream'
]

lines = js.split('\n')
for idx, line in enumerate(lines, 1):
    for m in missing:
        if m in line:
            print(f"Line {idx}: {line.strip()}")
