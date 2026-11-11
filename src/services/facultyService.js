import api from '../lib/api';
import hierarchyData from '../data/academicsHierarchyData.json';

/**
 * Faculty Service - Server Authoritative
 * Handles public faculty reading and administrative faculty mutations via Laravel API.
 */

export async function getFaculty(filters = {}) {
  const params = {};
  if (filters.department_id && filters.department_id !== 'All' && filters.department_id !== 'all') {
    params.department_id = filters.department_id;
  } else if (filters.department && filters.department !== 'All' && filters.department !== 'all') {
    params.department = filters.department;
  }

  if (filters.programme_code && filters.programme_code !== 'All' && filters.programme_code !== 'all') {
    params.programme_code = filters.programme_code;
  }

  if (filters.category && filters.category !== 'All' && filters.category !== 'all') {
    params.category = filters.category;
  }

  if (filters.search && filters.search.trim() !== '') {
    params.search = filters.search.trim();
  }

  const response = await api.get('/faculty', params);
  const list = Array.isArray(response) ? response : (response?.data || []);

  return list.map(f => ({
    ...f,
    id: f.id,
    name: f.name,
    designation: f.designation || 'Faculty Member',
    department_id: f.department_id || f.departmentId || f.department?.id,
    departmentId: f.department_id || f.departmentId || f.department?.id,
    department: f.department?.name || f.department || 'Academic Department',
    departmentName: f.department?.name || f.department || 'Academic Department',
    facultyCategory: f.department?.category || 'Academics',
    qualification: f.qualification || '',
    photo_url: f.photo_url || f.photoUrl || f.photo,
    photoUrl: f.photo_url || f.photoUrl || f.photo,
    programmes: Array.isArray(f.programmes) ? f.programmes : [],
      cvData: f.cvData || null,
  }));
}

export async function getFacultyById(id) {
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
  if (!f) return null;

    const deptName = typeof f.department === 'string'
      ? f.department
      : (f.department?.name || f.departmentName || 'Academic Department');

    const deptId = typeof f.department === 'object' && f.department?.id
      ? f.department.id
      : (f.department_id || f.departmentId);

    return {
      ...f,
      id: f.id,
      name: f.name,
      designation: f.designation || 'Faculty Member',
      department_id: deptId,
      departmentId: deptId,
      department: deptName,
      departmentName: deptName,
      departmentObj: typeof f.department === 'object' ? f.department : null,
      facultyCategory: f.department?.category || 'Academics',
      qualification: f.qualification || '',
      photo_url: f.photo_url || f.photoUrl || f.photo,
      photoUrl: f.photo_url || f.photoUrl || f.photo,
      programmes: Array.isArray(f.programmes) ? f.programmes : [],
      cvData: f.cvData || null,
    };
}

export async function createFaculty(facultyData) {
  const payload = {
    ...facultyData,
    photoUrl: facultyData.photoUrl || facultyData.image || facultyData.photo || null,
  };
  const response = await api.post('/admin/faculty', payload);
  return response?.faculty || response?.data || response;
}

export async function updateFaculty(id, facultyData) {
  const payload = {
    ...facultyData,
    photoUrl: facultyData.photoUrl || facultyData.image || facultyData.photo || null,
  };
  const response = await api.put(`/admin/faculty/${encodeURIComponent(id)}`, payload);
  return response?.faculty || response?.data || response;
}

export async function saveFaculty(facultyData) {
  if (facultyData.id) {
    return updateFaculty(facultyData.id, facultyData);
  }
  return createFaculty(facultyData);
}

export async function deleteFaculty(id) {
  if (!id) return null;
  const response = await api.delete(`/admin/faculty/${encodeURIComponent(id)}`);
  return response;
}

export default {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  saveFaculty,
  deleteFaculty
};
