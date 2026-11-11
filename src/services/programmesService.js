import api from '../lib/api';

/**
 * Public Programmes Service - Server Authoritative
 */
export async function getProgrammes(filters = {}) {
  const params = {};
  if (filters.level && filters.level !== 'all') params.level = filters.level;

  const response = await api.get('/programmes', params);
  const list = Array.isArray(response) ? response : (response?.data || []);

  return list.map((p) => {
    const code = p.code || p.id || 'COURSE';
    const isHoneycomb = p.is_featured_honeycomb !== undefined 
      ? Boolean(p.is_featured_honeycomb) 
      : (p.isFeaturedHoneycomb !== undefined ? Boolean(p.isFeaturedHoneycomb) : true);

    return {
      ...p,
      id: p.id || code,
      code,
      type: (p.level || p.type || 'ug').toLowerCase(),
      description: p.overview || p.description,
      status: p.status || 'published',
      is_featured_honeycomb: isHoneycomb,
      isFeaturedHoneycomb: isHoneycomb
    };
  });
}

export async function getUGProgrammes() {
  return getProgrammes({ level: 'ug' });
}

export async function getPGProgrammes() {
  return getProgrammes({ level: 'pg' });
}
