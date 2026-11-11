with open('src/components/home/GallerySection.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('Previous Slide', 'Previous Photograph')
text = text.replace('Next Slide', 'Next Photograph')

with open('src/components/home/GallerySection.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated successfully!')
