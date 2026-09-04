import os
from PIL import Image

image_path = r"C:\Users\melvi\.gemini\antigravity\brain\562edf3c-3b70-4ee1-942b-07f4200a8003\.user_uploaded\media_1788343339181.png"
img = Image.open(image_path)
width, height = img.size
print(f"Image Size: {width} x {height}")
