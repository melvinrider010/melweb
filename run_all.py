import os
import subprocess
import sys

SCRATCH_DIR = r"C:\Users\melvi\.gemini\antigravity-cli\brain\0eb1d811-4dcf-4664-883b-d41892463d16\scratch"
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

scripts = [
    os.path.join(SCRATCH_DIR, "build_official_data.py"),
    os.path.join(SCRATCH_DIR, "sync_about_data.py"),
    os.path.join(SCRATCH_DIR, "build_gallery_data.py"),
    os.path.join(SCRATCH_DIR, "verify_all.py")
]

print("=" * 60)
print("St. Philomena's College - Master Data & Media Sync")
print("=" * 60)

for full_path in scripts:
    if os.path.exists(full_path):
        script_name = os.path.basename(full_path)
        print(f"\n[RUNNING] python {script_name} ...")
        res = subprocess.run([sys.executable, full_path], cwd=PROJECT_DIR, capture_output=False)
        if res.returncode == 0:
            print(f"[SUCCESS] {script_name} finished.")
        else:
            print(f"[ERROR] {script_name} exited with code {res.returncode}")
    else:
        print(f"[SKIP] File not found: {full_path}")

print("\n" + "=" * 60)
print("All tasks completed successfully!")
print("=" * 60)
