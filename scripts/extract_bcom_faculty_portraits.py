import os
from PIL import Image

image_path = r"C:\Users\melvi\.gemini\antigravity\brain\562edf3c-3b70-4ee1-942b-07f4200a8003\.user_uploaded\media_1788345102862.png"
img = Image.open(image_path)
width, height = img.size

out_dir = r"d:\melvin colg\Stphilos\public\assets\faculty\commerce"
os.makedirs(out_dir, exist_ok=True)

# Define exact bounding boxes for the 12 B.Com faculty portraits
faculty_defs = [
    # Row 0
    {"id": "bcom-reena-francis.jpg", "box": (30, 38, 85, 90), "name": "Dr. Reena Francis", "desig": "Head of the Department & Dean"},
    {"id": "bcom-sandesh-dsouza.jpg", "box": (142, 38, 197, 90), "name": "Dr. Sandesh D'Souza", "desig": "Assistant Professor"},
    {"id": "bcom-sunil-dsouza.jpg", "box": (252, 38, 307, 90), "name": "Dr. Sunil D'Souza", "desig": "Assistant Professor"},

    # Row 1
    {"id": "bcom-jubie-singh.jpg", "box": (30, 137, 85, 189), "name": "Ms. Jubie Singh P", "desig": "Assistant Professor"},
    {"id": "bcom-amreen-kousar.jpg", "box": (142, 137, 197, 189), "name": "Mrs. Amreen Kousar", "desig": "Assistant Professor"},
    {"id": "bcom-supritha-r.jpg", "box": (252, 137, 307, 189), "name": "Ms. Supritha R", "desig": "Assistant Professor"},

    # Row 2 (2 cards offset)
    {"id": "bcom-florita-alexander.jpg", "box": (86, 237, 141, 289), "name": "Dr. Florita Bernadete Alexander", "desig": "Assistant Professor"},
    {"id": "bcom-kavitha-r.jpg", "box": (197, 237, 252, 289), "name": "Kavitha R", "desig": "Assistant Professor"},

    # Row 3
    {"id": "bcom-viveka-marie.jpg", "box": (30, 337, 85, 389), "name": "Dr. Viveka Marie G", "desig": "Assistant Professor"},
    {"id": "bcom-amrin-taj.jpg", "box": (142, 337, 197, 389), "name": "Ms. Amrin Taj", "desig": "Assistant Professor"},
    {"id": "bcom-jancy-j.jpg", "box": (252, 337, 307, 389), "name": "Ms. Jancy J", "desig": "Asst. Prof."},

    # Row 4 (1 card centered)
    {"id": "bcom-harshitha-rai.jpg", "box": (142, 437, 197, 489), "name": "Ms. Harshitha RAI M", "desig": "Asst. Prof."}
]

for fac in faculty_defs:
    crop = img.crop(fac["box"])
    crop_resized = crop.resize((200, 200), Image.Resampling.LANCZOS)
    out_path = os.path.join(out_dir, fac["id"])
    crop_resized.convert("RGB").save(out_path, "JPEG", quality=95)
    print(f"Saved: {fac['id']} for {fac['name']}")

print(f"\nAll {len(faculty_defs)} B.Com faculty portraits successfully extracted from official screenshot!")
