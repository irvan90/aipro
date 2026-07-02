import re

filepath = r"C:\File\project\compass\compass\src\app\core\services\mock-data.service.ts"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Map of backlog id pattern to their value/effort
# We match by the riceScore line and add valueEffort after it
replacements = [
    # qris-retry - High value, Medium effort
    ("riceScore: { reach: 120000, impact: 2, confidence: 85, effort: 10, total: 2040 },",
     "riceScore: { reach: 120000, impact: 2, confidence: 85, effort: 10, total: 2040 },\n      valueEffort: { value: 'High', effort: 'Medium' },"),
    # login-biometric - High value, High effort
    ("riceScore: { reach: 95000, impact: 2, confidence: 80, effort: 13, total: 1169 },",
     "riceScore: { reach: 95000, impact: 2, confidence: 80, effort: 13, total: 1169 },\n      valueEffort: { value: 'High', effort: 'High' },"),
    # dark-mode - Low value, High effort
    ("riceScore: { reach: 200000, impact: 0.5, confidence: 70, effort: 13, total: 538 },",
     "riceScore: { reach: 200000, impact: 0.5, confidence: 70, effort: 13, total: 538 },\n      valueEffort: { value: 'Low', effort: 'High' },"),
    # recurring-transfer - High value, Low effort
    ("riceScore: { reach: 90000, impact: 2, confidence: 82, effort: 7, total: 2109 },",
     "riceScore: { reach: 90000, impact: 2, confidence: 82, effort: 7, total: 2109 },\n      valueEffort: { value: 'High', effort: 'Low' },"),
    # spending-analytics-v2 - High value, Medium effort
    ("riceScore: { reach: 150000, impact: 2, confidence: 78, effort: 11, total: 2127 },",
     "riceScore: { reach: 150000, impact: 2, confidence: 78, effort: 11, total: 2127 },\n      valueEffort: { value: 'High', effort: 'Medium' },"),
    # split-bill - Medium value, Medium effort
    ("riceScore: { reach: 45000, impact: 1, confidence: 72, effort: 9, total: 360 },",
     "riceScore: { reach: 45000, impact: 1, confidence: 72, effort: 9, total: 360 },\n      valueEffort: { value: 'Medium', effort: 'Medium' },"),
    # virtual-card-control - Medium value, Medium effort
    ("riceScore: { reach: 30000, impact: 1, confidence: 68, effort: 8, total: 255 },",
     "riceScore: { reach: 30000, impact: 1, confidence: 68, effort: 8, total: 255 },\n      valueEffort: { value: 'Medium', effort: 'Medium' },"),
    # loyalty-dashboard - Low value, Medium effort
    ("riceScore: { reach: 25000, impact: 0.5, confidence: 65, effort: 10, total: 81 },",
     "riceScore: { reach: 25000, impact: 0.5, confidence: 65, effort: 10, total: 81 },\n      valueEffort: { value: 'Low', effort: 'Medium' },"),
    # onboarding-redesign - High value, High effort
    ("riceScore: { reach: 50000, impact: 3, confidence: 88, effort: 12, total: 1100 },",
     "riceScore: { reach: 50000, impact: 3, confidence: 88, effort: 12, total: 1100 },\n      valueEffort: { value: 'High', effort: 'High' },"),
    # statement-download - Medium value, Low effort
    ("riceScore: { reach: 200000, impact: 1, confidence: 80, effort: 6, total: 2667 },",
     "riceScore: { reach: 200000, impact: 1, confidence: 80, effort: 6, total: 2667 },\n      valueEffort: { value: 'Medium', effort: 'Low' },"),
    # pocket-rupiah main AI result - High value, Medium effort (Quick Win)
    ("riceScore: { reach: 80000, impact: 3, confidence: 75, effort: 8, total: 2250 },",
     "riceScore: { reach: 80000, impact: 3, confidence: 75, effort: 8, total: 2250 },\n  valueEffort: { value: 'High', effort: 'Medium' },"),
]

for old, new in replacements:
    content = content.replace(old, new, 1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("valueEffort added to all mock AI results")
