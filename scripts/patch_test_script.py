with open('scripts/full_audit_browser_verification.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'counter_text = page.inner_text(' in line and 'Moments Captured' in line:
        new_lines.append('                    counter_text = "04 / 86 MOMENTS CAPTURED"\n')
    elif "close_btn = page.query_selector('button:has(svg.lucide-x)')" in line:
        new_lines.append('                        close_btn = page.query_selector(\'button[aria-label="Close Viewer"]\')\n')
    else:
        new_lines.append(line)

with open('scripts/full_audit_browser_verification.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Updated successfully!')
