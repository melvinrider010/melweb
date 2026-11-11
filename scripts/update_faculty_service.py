with open('src/services/facultyService.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
text = text.replace(
    "import api from '../lib/api';",
    "import api from '../lib/api';\nimport hierarchyData from '../data/academicsHierarchyData.json';"
)

# Update getFacultyById
old_fn = """export async function getFacultyById(id) {
  if (!id) return null;
  try {
    const response = await api.get(`/faculty/${encodeURIComponent(id)}`);
    const f = response?.data || response || null;
    if (!f) return null;"""

new_fn = """export async function getFacultyById(id) {
  if (!id) return null;
  const localCanonical = (hierarchyData.faculty || []).find(
    item => item.id === id || item.slug === id || (item.name && item.name.toLowerCase() === id.toLowerCase())
  );

  let f = null;
  try {
    const response = await api.get(`/faculty/${encodeURIComponent(id)}`);
    const serverData = response?.data || response || null;
    if (serverData) {
      f = { ...localCanonical, ...serverData, cvData: localCanonical?.cvData || serverData.cvData };
    }
  } catch (err) {
    if (err.status !== 404) console.warn('Faculty backend fetch error:', err);
  }

  if (!f) f = localCanonical;
  if (!f) return null;"""

text = text.replace(old_fn, new_fn)

# Also ensure cvData is preserved in return
text = text.replace(
    "programmes: Array.isArray(f.programmes) ? f.programmes : [],",
    "programmes: Array.isArray(f.programmes) ? f.programmes : [],\n      cvData: f.cvData || localCanonical?.cvData || null,"
)

with open('src/services/facultyService.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated facultyService.js successfully.")
