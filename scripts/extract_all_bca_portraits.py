import os
from PIL import Image

image_path = r"C:\Users\melvi\.gemini\antigravity\brain\562edf3c-3b70-4ee1-942b-07f4200a8003\.user_uploaded\media_1788343339181.png"
img = Image.open(image_path)
width, height = img.size

out_dir = r"d:\melvin colg\Stphilos\public\assets\faculty\computer-applications"
os.makedirs(out_dir, exist_ok=True)

# Grid layout:
# Top header "Present Faculties" is roughly y = 0..30
# Row 0: y ~ 35 .. 108
# Row 1: y ~ 130 .. 205
# Row 2: y ~ 228 .. 302
# Row 3: y ~ 324 .. 398
# Row 4: y ~ 420 .. 494
# Row 5: y ~ 516 .. 590

# Let's define the 17 faculty records in order
faculty_defs = [
    # Row 0
    {"id": "bca-gloriya.jpg", "box": (12, 35, 60, 83), "name": "Mrs. E Gloriya Priyadarshini", "desig": "Head of the Department & Assistant Professor", "qual": "M.Sc., M.Phil."},
    {"id": "bca-syeda-masarath.jpg", "box": (108, 35, 156, 83), "name": "Mrs. Syeda Masarath", "desig": "Assistant Professor", "qual": "M.Sc. (CS), M.Phil."},
    {"id": "bca-archana.jpg", "box": (205, 35, 253, 83), "name": "Ms. Archana A", "desig": "Assistant Professor", "qual": "MCA"},

    # Row 1
    {"id": "bca-sandra-agnes.jpg", "box": (12, 132, 60, 180), "name": "Ms. J. Sandra Agnes", "desig": "Assistant Professor", "qual": "MCA, M.Phil."},
    {"id": "bca-manasa.jpg", "box": (108, 132, 156, 180), "name": "Ms. Manasa E", "desig": "Assistant Professor", "qual": "MCA"},
    {"id": "bca-lydia-anjalla.jpg", "box": (205, 132, 253, 180), "name": "Ms. LYDIA ANJALI.A", "desig": "Assistant Professor", "qual": "MCA"},

    # Row 2
    {"id": "bca-harshitha.jpg", "box": (12, 228, 60, 276), "name": "Ms. HARSHITHA M", "desig": "Assistant Professor", "qual": "MCA"},
    {"id": "bca-ajay-anthony.jpg", "box": (108, 228, 156, 276), "name": "Mr. Ajay Anthony G", "desig": "Assistant Professor", "qual": "MCA"},
    {"id": "bca-priyanka.jpg", "box": (205, 228, 253, 276), "name": "Ms. Priyanka MK", "desig": "Assistant Professor", "qual": "MCA"},

    # Row 3
    {"id": "bca-lenard-p.jpg", "box": (12, 324, 60, 372), "name": "Mr. Lenard P", "desig": "Assistant Professor", "qual": "MCA / M.Sc."},
    {"id": "bca-judith.jpg", "box": (108, 324, 156, 372), "name": "Ms. Judith", "desig": "Assistant Professor", "qual": "MCA / M.Sc."},
    {"id": "bca-ayesha-siddiqa.jpg", "box": (205, 324, 253, 372), "name": "Ms. Ayesha Siddiqa", "desig": "Assistant Professor", "qual": "MCA / M.Sc."},

    # Row 4
    {"id": "bca-mohammed-maaz.jpg", "box": (12, 420, 60, 468), "name": "Mr. Mohammed Maaz", "desig": "Assistant Professor", "qual": "MCA / M.Sc."},
    {"id": "bca-vidyashree.jpg", "box": (108, 420, 156, 468), "name": "Ms. Vidyashree", "desig": "Assistant Professor", "qual": "MCA / M.Sc."},
    {"id": "bca-prakruthi-v.jpg", "box": (205, 420, 253, 468), "name": "Ms. Prakruthi V", "desig": "Assistant Professor", "qual": "MCA / M.Sc."},

    # Row 5
    {"id": "bca-kusuma-mv.jpg", "box": (60, 516, 108, 564), "name": "Ms. Kusuma MV", "desig": "Assistant Professor", "qual": "MCA / M.Sc."},
    {"id": "bca-anarghya-theodor.jpg", "box": (158, 516, 206, 564), "name": "Mr. Anarghya Theodor", "desig": "Assistant Professor", "qual": "MCA / M.Sc."}
]

for fac in faculty_defs:
    crop = img.crop(fac["box"])
    # Resize with high quality for display
    crop_resized = crop.resize((200, 200), Image.Resampling.LANCZOS)
    out_path = os.path.join(out_dir, fac["id"])
    crop_resized.convert("RGB").save(out_path, "JPEG", quality=95)
    print(f"Saved: {fac['id']} for {fac['name']}")

print(f"\nAll {len(faculty_defs)} BCA faculty portraits successfully extracted from official screenshot!")
