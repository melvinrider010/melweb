import re

pages = [
    'src/pages/ExaminationsPage.jsx',
    'src/pages/AdmissionsPage.jsx',
    'src/pages/IqacPage.jsx',
    'src/pages/NaacPage.jsx',
    'src/pages/NirfPage.jsx',
    'src/pages/IicPage.jsx',
    'src/pages/DocumentsPage.jsx',
    'src/pages/MandatoryDisclosurePage.jsx',
    'src/pages/ComplianceDocumentPage.jsx',
    'src/pages/NewsEventsPage.jsx',
    'src/pages/NoticeDetailPage.jsx',
    'src/components/home/AnnouncementTicker.jsx',
    'src/components/home/NoticeBoardSection.jsx',
    'src/components/home/NewsEventsSection.jsx'
]

print("=== DATA SOURCES USED IN PAGES ===")
for p in pages:
    try:
        with open(p, 'r', encoding='utf-8') as f:
            content = f.read()
        imports = re.findall(r'import\s+.*?\s+from\s+[\'"](.*?)[\'"]', content)
        data_imports = [imp for imp in imports if any(k in imp for k in ['data', 'services', 'cmsStore', 'api', 'json'])]
        print(f"\n{p}:")
        for di in data_imports:
            print(f"  <- {di}")
    except Exception as e:
        print(f"\n{p}: Error reading - {e}")
