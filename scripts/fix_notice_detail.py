import re

with open('src/pages/NoticeDetailPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update displayDate and contentParagraphs
old_date = 'const displayDate = item.displayDate || item.event_date || item.date;'
new_date = """const displayDate = item.display_date || item.displayDate || (item.event_date ? String(item.event_date).split('T')[0].split(' ')[0] : '') || (item.date ? String(item.date).split('T')[0].split(' ')[0] : '');

  // Authentic paragraph parsing preserving original content
  const contentParagraphs = (() => {
    if (Array.isArray(item.content)) return item.content;
    if (typeof item.content === 'string' && item.content.trim()) {
      try {
        let parsed = JSON.parse(item.content);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (Array.isArray(parsed)) return parsed;
        if (parsed) return [String(parsed)];
      } catch (e) {
        return [item.content];
      }
    }
    if (item.description || item.summary) return [item.description || item.summary];
    return [];
  })();"""

content = content.replace(old_date, new_date)

# 2. Update Ref No
old_ref = '{item.refNo || `SPC/ADMIN/2026/${item.id.toUpperCase()}`}'
new_ref = '{item.ref_no || item.refNo || item.ref || (item.id ? `SPC/ADMIN/2026/${item.id.toUpperCase()}` : "")}'
content = content.replace(old_ref, new_ref)

# 3. Update body rendering
old_body = """            {Array.isArray(item.content) ? (
              item.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="leading-relaxed text-justify">{item.description || item.summary}</p>
            )}"""

new_body = """            {contentParagraphs.map((paragraph, pIdx) => (
              <p key={pIdx} className="leading-relaxed text-justify">
                {paragraph}
              </p>
            ))}"""

content = content.replace(old_body, new_body)

with open('src/pages/NoticeDetailPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated NoticeDetailPage.jsx successfully.")

with open('src/pages/NewsEventsPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const itemDate = item.event_date || item.date || item.publishDate;',
    "const itemDate = item.display_date || item.displayDate || (item.event_date ? String(item.event_date).split('T')[0].split(' ')[0] : '') || (item.date ? String(item.date).split('T')[0].split(' ')[0] : '') || item.publishDate;"
)

content = content.replace(
    '{item.refNo || item.id}',
    '{item.ref_no || item.refNo || item.id}'
)

with open('src/pages/NewsEventsPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated NewsEventsPage.jsx successfully.")
