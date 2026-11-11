with open('src/components/home/CourseHoneycombSection.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('key={cell.id || ${rowIndex}--}', 'key={cell.id || `cell-${rowIndex}-${colIdx}`}')

with open('src/components/home/CourseHoneycombSection.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed line 519 in CourseHoneycombSection.jsx.")
