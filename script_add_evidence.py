import re

file_path = r'C:\File\project\compass\mock-data.backup.ts'
dest_path = r'C:\File\project\compass\compass\src\app\core\services\mock-data.service.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('export const MOCK_BACKLOGS: Backlog[] = [')
end_idx = content.find('];', start_idx)

mock_backlogs_str = content[start_idx:end_idx]

def add_extra(match):
    text = match.group(0)
    if 'opportunityAtRisk' in text or 'evidenceSignals' in text:
        return text
    
    extra = """    opportunityAtRisk: {
      metric: 'engagement_drop',
      label: 'Potensi Penurunan Engagement',
      formula: 'Berdasarkan data historis fitur serupa',
      assumptions: ['Asumsi tren pasar berlanjut', 'Kompetitor belum rilis fitur serupa']
    },
    evidenceSignals: [
      { type: 'business', label: 'Analisis internal', detail: 'Fitur direkomendasikan berdasarkan feedback user.', source: 'User Survey', observedAt: 'Bulan lalu' },
      { type: 'customer', label: 'Data Penggunaan', detail: 'Tingkat drop-off pada tahap awal mencapai 15%.', source: 'Product Analytics', observedAt: 'Minggu lalu' }
    ],
    productId: 'prod-001',"""
    return text.replace("productId: 'prod-001',", extra)

current_pos = 0
while True:
    match = re.search(r'    id: \'.*?\',\n(?:.*?\n)+?    productId: \'prod-001\',', mock_backlogs_str[current_pos:], re.MULTILINE)
    if not match:
        break
    
    replaced = add_extra(match)
    mock_backlogs_str = mock_backlogs_str[:current_pos + match.start()] + replaced + mock_backlogs_str[current_pos + match.end():]
    current_pos += match.start() + len(replaced)

new_content = content[:start_idx] + mock_backlogs_str + content[end_idx:]

with open(dest_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Success')
