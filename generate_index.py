import os
import json
from docx import Document

# Если библиотеки нет, установите в терминале: pip install python-docx

docs_dir = 'docs'
index_data = {}

for filename in os.listdir(docs_dir):
    if filename.endswith('.docx'):
        filepath = os.path.join(docs_dir, filename)
        try:
            doc = Document(filepath)
            # Извлекаем весь текст из параграфов
            full_text = []
            for para in doc.paragraphs:
                if para.text.strip():
                    full_text.append(para.text.strip())
            
            # Сохраняем текст под ключом имени файла (например, 'plenum_01.docx')
            index_data[filename] = "\n".join(full_text)
        except Exception as e:
            print(f"Ошибка чтения {filename}: {e}")

# Сохраняем результат в JS-файл
with open('search-index.js', 'w', encoding='utf-8') as f:
    f.write("const searchIndex = ")
    json.dump(index_data, f, ensure_ascii=False, indent=2)
    f.write(";\n")

print(f"Готово! Индекс создан для {len(index_data)} файлов.")
