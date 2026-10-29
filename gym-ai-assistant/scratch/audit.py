import re

with open(r"C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\index.html", "r", encoding="utf-8") as f:
    html = f.read()

with open(r"C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Find all view IDs
view_ids = set(re.findall(r'id=["\']view-([^"\']+)["\']', html))
print(f"Total view sections in HTML: {len(view_ids)}")
print("Views:", sorted(list(view_ids)))

# 2. Find all switchTab calls
switch_tabs = set(re.findall(r'switchTab\(["\']([^"\']+)["\']\)', html + js))
print(f"\nTotal switchTab targets: {len(switch_tabs)}")
print("Targets:", sorted(list(switch_tabs)))

missing_views = [t for t in switch_tabs if t not in view_ids]
print(f"\nMissing views for switchTab calls: {missing_views}")

# 3. Check document.getElementById calls in app.js against index.html IDs
get_elem_ids = set(re.findall(r'document\.getElementById\(["\']([^"\']+)["\']\)', js))
html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html))

print(f"\nTotal getElementById calls in JS: {len(get_elem_ids)}")
missing_html_ids = []
for elem_id in sorted(list(get_elem_ids)):
    # Ignore dynamic IDs constructed like `view-${tabId}` or `tab-${tabId}` or `rag-tab-${gid}`
    if elem_id not in html_ids and not elem_id.startswith('${'):
        missing_html_ids.append(elem_id)

print(f"IDs referenced in JS getElementById but NOT present in HTML ({len(missing_html_ids)}):")
for mid in missing_html_ids:
    print(f" - {mid}")
