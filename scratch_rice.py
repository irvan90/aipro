import re

filepath = r"C:\File\project\compass\compass\src\app\core\services\mock-data.service.ts"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find aiResult block and add riceScore if not present
def add_rice_score(match):
    block = match.group(0)
    if 'riceScore:' in block:
        return block
    # Insert riceScore after confidenceLevel
    return re.sub(
        r'(confidenceLevel: \d+,)',
        r'\1\n      riceScore: { reach: 50000, impact: 2, confidence: 80, effort: 5, total: 16000 },',
        block
    )

# Match aiResult block roughly up to scoredAt
new_content = re.sub(r'aiResult: \{[\s\S]*?scoredAt,?\n\s*\}', add_rice_score, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated mock-data.service.ts with RICE scores")
