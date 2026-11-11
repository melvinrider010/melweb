import re

with open('src/pages/NoticeDetailPage.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add PDFViewerEmbed import if not present
if 'import PDFViewerEmbed' not in code:
    code = code.replace(
        "import ViewAsBookButton from '../components/common/ViewAsBookButton';",
        "import ViewAsBookButton from '../components/common/ViewAsBookButton';\nimport PDFViewerEmbed from '../components/common/PDFViewerEmbed';"
    )

# 2. Add imageError state
if 'const [imageError, setImageError]' not in code:
    code = code.replace(
        "const [error, setError] = useState(null);",
        "const [error, setError] = useState(null);\n  const [imageError, setImageError] = useState(false);"
    )

# 3. Add primaryDocUrl calculation & enhanced contentParagraphs filtering
old_calc = """  const hasSubEvents = Array.isArray(item.subEvents) && item.subEvents.length > 0;
  const hasAttachments = Array.isArray(item.attachments) && item.attachments.length > 0;
  const displayDate = item.display_date || item.displayDate || (item.event_date ? String(item.event_date).split('T')[0].split(' ')[0] : '') || (item.date ? String(item.date).split('T')[0].split(' ')[0] : '');

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

new_calc = """  const hasSubEvents = Array.isArray(item.subEvents) && item.subEvents.length > 0;
  const hasAttachments = Array.isArray(item.attachments) && item.attachments.length > 0;
  const displayDate = item.display_date || item.displayDate || (item.event_date ? String(item.event_date).split('T')[0].split(' ')[0] : '') || (item.date ? String(item.date).split('T')[0].split(' ')[0] : '');

  // Primary attached document resolution
  const primaryDocUrl = (item.link && (item.link.endsWith('.pdf') || item.link.includes('/documents/')))
    ? item.link
    : (item.documentPdf || item.pdf_url || item.file_url || (Array.isArray(item.attachments) && item.attachments[0]?.url) || null);
  const isPdf = primaryDocUrl && primaryDocUrl.toLowerCase().endsWith('.pdf');
  const rawDocName = primaryDocUrl ? primaryDocUrl.split('/').pop().replace(/\\.pdf$/i, '') : '';
  const cleanDocTitle = rawDocName
    ? rawDocName.replace(/[-_]/g, ' ').replace(/\\(\\d+\\)/g, '').replace(/\\s+/g, ' ').trim()
    : item.title;

  // Authentic paragraph parsing preserving original content
  const contentParagraphs = (() => {
    let list = [];
    if (Array.isArray(item.content)) list = item.content;
    else if (typeof item.content === 'string' && item.content.trim()) {
      try {
        let parsed = JSON.parse(item.content);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (Array.isArray(parsed)) list = parsed;
        else if (parsed) list = [String(parsed)];
      } catch (e) {
        list = [item.content];
      }
    } else if (item.description || item.summary) {
      list = [item.description || item.summary];
    }

    return list.filter(p => {
      const text = String(p).trim();
      if (!text) return false;
      if (primaryDocUrl) {
        const isDownloadScrape = text.includes('Download') && (text.includes('.pdf') || text.includes('_') || text.includes('Report'));
        if (isDownloadScrape && text.length < 100) return false;
        if (rawDocName && text.toLowerCase().includes(rawDocName.toLowerCase()) && text.length < 100) return false;
      }
      return true;
    });
  })();"""

if old_calc in code:
    code = code.replace(old_calc, new_calc)

# 4. Update image error handler in documentImage
old_img = """          {/* DOCUMENT SCAN OR PHOTO DISPLAY */}
          {(item.documentImage || item.document_image) && (
            <div className="rounded-xl overflow-hidden border border-slate-300 shadow-md bg-slate-100 max-w-2xl mx-auto">
              <img
                src={item.documentImage || item.document_image}
                alt={item.title}
                className="w-full h-auto object-contain max-h-[600px] mx-auto"
              />
              <div className="bg-slate-900 text-slate-300 text-[11px] font-mono text-center py-1.5 px-4 border-t border-slate-700">
                Official Institutional Release · St. Philomena's College (Autonomous)
              </div>
            </div>
          )}"""

new_img = """          {/* DOCUMENT SCAN OR PHOTO DISPLAY */}
          {(item.documentImage || item.document_image) && !imageError && (
            <div className="rounded-xl overflow-hidden border border-slate-300 shadow-md bg-slate-100 max-w-2xl mx-auto">
              <img
                src={item.documentImage || item.document_image}
                alt={item.title}
                onError={() => setImageError(true)}
                className="w-full h-auto object-contain max-h-[600px] mx-auto"
              />
              <div className="bg-slate-900 text-slate-300 text-[11px] font-mono text-center py-1.5 px-4 border-t border-slate-700">
                Official Institutional Release · St. Philomena's College (Autonomous)
              </div>
            </div>
          )}"""

if old_img in code:
    code = code.replace(old_img, new_img)

# 5. Insert Professional Document Attachment & Embedded Viewer Section right before SIGNATURE & OFFICIAL SEAL BLOCK
old_sig = """          {/* SIGNATURE & OFFICIAL SEAL BLOCK */}"""

doc_attachment_block = """          {/* INSTITUTIONAL DOCUMENT ATTACHMENT & VIEWER SECTION */}
          {primaryDocUrl && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-start space-x-3.5">
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200/60 shadow-xs">
                    <FileText className="w-6 h-6 shrink-0" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-700 bg-red-100/70 px-2 py-0.5 rounded border border-red-200">
                      OFFICIAL ATTACHMENT · PDF
                    </span>
                    <h4 className="font-heading font-bold text-base sm:text-lg text-[#0B1F4E] mt-1">
                      {cleanDocTitle || item.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Verified St. Philomena's College Institutional Circular Attachment
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={primaryDocUrl}
                    download
                    className="btn-gold px-3.5 py-2 text-xs font-bold rounded-lg inline-flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                  <a
                    href={primaryDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-navy px-3.5 py-2 text-xs font-bold rounded-lg inline-flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Full Tab</span>
                  </a>
                </div>
              </div>

              {/* Embedded Document Preview */}
              {isPdf && (
                <div className="pt-2">
                  <PDFViewerEmbed
                    src={primaryDocUrl}
                    title={cleanDocTitle || item.title}
                    height="750px"
                    badge="Official College Document"
                    allowFullscreen={true}
                    allowDownload={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* SIGNATURE & OFFICIAL SEAL BLOCK */}"""

if old_sig in code and 'INSTITUTIONAL DOCUMENT ATTACHMENT & VIEWER SECTION' not in code:
    code = code.replace(old_sig, doc_attachment_block)

# 6. Also update top action bar to include primaryDocUrl
old_top = """            {item.documentPdf && (
              <ViewAsBookButton
                pdfUrl={item.documentPdf}
                title={item.title}
                label="View Document"
                variant="blue"
              />
            )}"""

new_top = """            {(primaryDocUrl || item.documentPdf) && (
              <ViewAsBookButton
                pdfUrl={primaryDocUrl || item.documentPdf}
                title={cleanDocTitle || item.title}
                label="View Document"
                variant="blue"
              />
            )}"""

if old_top in code:
    code = code.replace(old_top, new_top)

with open('src/pages/NoticeDetailPage.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated NoticeDetailPage.jsx successfully!')
