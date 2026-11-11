with open('src/services/facultyService.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'cvData: f.cvData || localCanonical?.cvData || null,',
    'cvData: f.cvData || null,'
)

with open('src/services/facultyService.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed line 46 in facultyService.js.")
