import api from '../lib/api';

/**
 * Normalize raw backend document record into frontend consumer contract.
 */
function normalizeDocument(doc) {
  if (!doc) return null;
  const rawUrl = doc.original_url || doc.originalUrl || '';
  const localPath = doc.local_path || doc.localPath || '';

  // Resolve viewable PDF/document URL
  let resolvedUrl = rawUrl;
  if (!resolvedUrl && localPath) {
    resolvedUrl = localPath.startsWith('/') ? localPath : `/${localPath}`;
  }

  const ext = (doc.extension || 'pdf').toLowerCase();

  return {
    ...doc,
    id: doc.id,
    title: doc.title,
    document_name: doc.title,
    link_text: doc.title,
    category: doc.category || 'Other',
    year: doc.year || '',
    extension: ext,
    file_type: ext.toUpperCase(),
    file_size: doc.file_size || doc.fileSize || 0,
    download_status: doc.download_status || doc.downloadStatus || 'Downloaded',
    url: resolvedUrl,
    original_url: rawUrl,
    local_path: localPath,
    originalUrl: rawUrl,
    localPath: localPath
  };
}

/**
 * Public Documents Service - Server Authoritative
 * 
 * Supports category, search, year, page, and per_page parameters.
 */
export async function getDocuments(filters = {}) {
  const params = {};

  if (filters.category && filters.category !== 'All' && filters.category !== 'all') {
    params.category = filters.category;
  }
  if (filters.year && filters.year !== 'all') {
    params.year = filters.year;
  }
  if (filters.search && filters.search.trim() !== '') {
    params.search = filters.search.trim();
  }
  if (filters.page) {
    params.page = filters.page;
  }
  if (filters.per_page) {
    params.per_page = filters.per_page;
  }

  const response = await api.get('/documents', params);

  // Handle paginated response structure from Laravel paginate()
  if (response && Array.isArray(response.data)) {
    return {
      documents: response.data.map(normalizeDocument),
      pagination: {
        currentPage: response.current_page || 1,
        lastPage: response.last_page || 1,
        perPage: response.per_page || 24,
        total: response.total !== undefined ? response.total : response.data.length,
        from: response.from || 1,
        to: response.to || response.data.length
      }
    };
  }

  // Handle flat array response
  const list = Array.isArray(response) ? response : [];
  return {
    documents: list.map(normalizeDocument),
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: list.length,
      total: list.length,
      from: 1,
      to: list.length
    }
  };
}

/**
 * Get single document by ID.
 */
export async function getDocumentById(id) {
  if (!id) return null;
  const response = await api.get(`/documents/${encodeURIComponent(id)}`);
  return normalizeDocument(response?.data || response);
}
