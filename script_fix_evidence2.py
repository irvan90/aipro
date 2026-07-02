import re

file_path = r'C:\File\project\compass\compass\src\app\core\services\mock-data.service.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("metric: 'retained_balance',\n        min: 10000000,\n        max: 50000000,\n        currency: 'IDR',", "metric: 'retained_balance',\n        min: 10000000,\n        max: 50000000,\n        currency: 'IDR',\n        isDemoEstimate: true,")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
