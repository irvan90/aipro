import os

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    content = content.replace("'pocket-bca'", "'pocket-rupiah'")
    content = content.replace("Pocket BCA", "Pocket Rupiah")
    content = content.replace("/backlog/pocket-bca", "/backlog/pocket-rupiah")
    content = content.replace("MOCK_POCKET_BCA_AI_RESULT", "MOCK_POCKET_RUPIAH_AI_RESULT")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = r"C:\File\project\compass\compass\src\app\core\services"
replace_in_file(os.path.join(base_dir, "mock-data.service.ts"))
replace_in_file(os.path.join(base_dir, "ai.service.ts"))

print("Replacements completed.")
