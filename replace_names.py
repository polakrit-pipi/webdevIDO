import os

replacements = {
    "idoidentity": "muhaidentity",
    "IDOIDENTITY": "MUHAIDENTITY",
    "ideabyido": "ideabymuha",
    "IdeaByIDO": "IdeaByMuha",
    "Idoidentity": "Muhaidentity",
    "Ideabyido": "Ideabymuha"
}

def process_file(filepath):
    if "node_modules" in filepath or ".git/" in filepath or ".next" in filepath or "package-lock.json" in filepath or "replace_names.py" in filepath:
        return
    if not os.path.isfile(filepath):
        return
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk("."):
    for file in files:
        process_file(os.path.join(root, file))
