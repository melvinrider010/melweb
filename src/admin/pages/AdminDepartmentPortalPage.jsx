import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Building2, 
  BookOpen, 
  Users, 
  FolderGit2, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Download, 
  FileText, 
  ShieldAlert, 
  Upload,
  Clock,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';
import FileUploadZone from '../../components/common/FileUploadZone';

export default function AdminDepartmentPortalPage() {
  const { user, isSuperAdmin, isHOD, userDepartmentId, userDepartmentName } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // For Super Admins, allow selecting any department via query param ?deptId=...
  const allDepartments = useCms(() => cmsStore.getDepartments());
  const selectedDeptId = isHOD ? userDepartmentId : (searchParams.get('deptId') || userDepartmentId || allDepartments[0]?.id || 'dept-bca');

  const dept = useCms(() => cmsStore.getDepartmentById(selectedDeptId), [selectedDeptId]);
  const deptFaculty = useCms(() => cmsStore.getFacultyByDepartment(selectedDeptId), [selectedDeptId]);
  const deptSyllabuses = useCms(() => cmsStore.getSyllabuses(selectedDeptId), [selectedDeptId]);
  const deptDocs = useCms(() => cmsStore.getDepartmentDocuments(selectedDeptId), [selectedDeptId]);

  const urlTab = searchParams.get('tab');
  const getNormalizedTab = (tabStr) => {
    if (!tabStr) return 'page';
    if (tabStr === 'overview' || tabStr === 'page') return 'page';
    if (tabStr === 'syllabus') return 'syllabus';
    if (tabStr === 'faculty') return 'faculty';
    if (tabStr === 'documents' || tabStr === 'files') return 'documents';
    return 'page';
  };

  const [activeTab, setActiveTab] = useState(() => getNormalizedTab(urlTab));

  useEffect(() => {
    if (urlTab) {
      setActiveTab(getNormalizedTab(urlTab));
    }
  }, [urlTab]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', newTab === 'page' ? 'overview' : newTab);
    setSearchParams(newParams);
  };

  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // 1. Department Page Form State
  const [deptForm, setDeptForm] = useState({
    id: '',
    name: '',
    shortName: '',
    code: '',
    slug: '',
    faculty: '',
    description: '',
    vision: '',
    mission: '',
    history: '',
    email: '',
    phone: '',
    office: '',
    photoUrl: '',
    facilities: []
  });

  const [newFacility, setNewFacility] = useState('');

  // 2. Syllabus Modal & Form State
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState(null);
  const [syllabusForm, setSyllabusForm] = useState({
    id: '',
    code: '',
    title: '',
    degree: '',
    regulation: 'Autonomous NEP 2020 / CBCS Curriculum Scheme',
    totalCredits: 144,
    semestersCount: 6,
    localPdf: '',
    pdfFileName: '',
    pdfFileSize: null,
    semesters: []
  });

  // 3. Faculty Modal & Form State
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [facultyForm, setFacultyForm] = useState({
    id: '',
    name: '',
    designation: 'Assistant Professor',
    qualification: 'M.Sc., NET / K-SET',
    email: '',
    phone: '',
    profile: '',
    photoUrl: '/assets/images/faculty/default_faculty.png',
    photoFileName: ''
  });

  // 4. Document Modal & Form State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docForm, setDocForm] = useState({
    title: '',
    category: 'Lab Manual',
    year: '2026',
    localPath: '',
    fileName: '',
    fileSize: null
  });

  // Load department data into form when department changes
  useEffect(() => {
    if (dept) {
      setDeptForm({
        id: dept.id || '',
        name: dept.name || '',
        shortName: dept.shortName || '',
        code: dept.code || '',
        slug: dept.slug || '',
        faculty: dept.faculty || dept.facultyName || '',
        description: dept.description || dept.about || '',
        vision: dept.vision || '',
        mission: dept.mission || '',
        history: dept.history || '',
        email: dept.email || '',
        phone: dept.phone || '',
        office: dept.office || '',
        photoUrl: dept.photoUrl || dept.image || '',
        facilities: Array.isArray(dept.facilities) ? [...dept.facilities] : []
      });
    }
  }, [dept]);

  const showFeedback = (msg, isErr = false) => {
    if (isErr) {
      setSaveError(msg);
      setTimeout(() => setSaveError(''), 4000);
    } else {
      setSaveSuccess(msg);
      setTimeout(() => setSaveSuccess(''), 4000);
    }
  };

  // --- Handlers: Department Info ---
  const handleSaveDeptInfo = async (e) => {
    e.preventDefault();
    try {
      await cmsStore.saveDepartment({
        ...dept,
        ...deptForm
      }, user?.name || 'HOD User');
      showFeedback('Department information and public page updated successfully!');
    } catch (err) {
      showFeedback(err.message || 'Failed to save department details.', true);
    }
  };

  const handleAddFacility = () => {
    if (!newFacility.trim()) return;
    setDeptForm(prev => ({
      ...prev,
      facilities: [...prev.facilities, newFacility.trim()]
    }));
    setNewFacility('');
  };

  const handleRemoveFacility = (idx) => {
    setDeptForm(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== idx)
    }));
  };

  // --- Handlers: Syllabus ---
  const handleOpenAddSyllabus = () => {
    setEditingSyllabus(null);
    setSyllabusForm({
      id: '',
      code: dept?.code || '',
      title: `${dept?.name || 'Programme'} Syllabus Scheme`,
      degree: 'Undergraduate / Postgraduate (Autonomous NEP 2020)',
      regulation: 'Autonomous NEP 2020 / CBCS Curriculum Scheme',
      totalCredits: 144,
      semestersCount: 6,
      localPdf: '',
      pdfFileName: '',
      pdfFileSize: null,
      semesters: [
        {
          sem: 'Semester I',
          credits: 24,
          courses: [
            { code: `${dept?.code || 'CRS'}101`, title: 'Core Discipline Course I', type: 'Discipline Core (DSC)', credits: 4 },
            { code: `${dept?.code || 'CRS'}102`, title: 'Core Discipline Course II', type: 'Discipline Core (DSC)', credits: 4 },
            { code: `${dept?.code || 'CRS'}103P`, title: 'Laboratory Practical Suite I', type: 'Practical Lab', credits: 2 }
          ]
        },
        {
          sem: 'Semester II',
          credits: 24,
          courses: [
            { code: `${dept?.code || 'CRS'}201`, title: 'Advanced Core Course', type: 'Discipline Core (DSC)', credits: 4 },
            { code: `${dept?.code || 'CRS'}202P`, title: 'Laboratory Practical Suite II', type: 'Practical Lab', credits: 2 }
          ]
        }
      ]
    });
    setIsSyllabusModalOpen(true);
  };

  const handleOpenEditSyllabus = (syl) => {
    setEditingSyllabus(syl);
    setSyllabusForm({
      id: syl.id || '',
      code: syl.code || '',
      title: syl.title || '',
      degree: syl.degree || '',
      regulation: syl.regulation || 'Autonomous NEP 2020 / CBCS Curriculum Scheme',
      totalCredits: syl.totalCredits || 144,
      semestersCount: syl.semestersCount || 6,
      localPdf: syl.localPdf || '',
      pdfFileName: syl.pdfFileName || (syl.localPdf ? syl.localPdf.split('/').pop() : ''),
      pdfFileSize: syl.pdfFileSize || null,
      semesters: syl.semesters || []
    });
    setIsSyllabusModalOpen(true);
  };

  const handleSaveSyllabus = async (e) => {
    e.preventDefault();
    try {
      await cmsStore.saveSyllabus({
        ...syllabusForm,
        departmentId: dept?.id,
        deptSlug: dept?.slug || dept?.id,
        department: dept?.name
      }, user?.name || 'HOD User', isHOD ? userDepartmentId : null);
      setIsSyllabusModalOpen(false);
      showFeedback('Syllabus & curriculum regulations updated successfully!');
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const handleDeleteSyllabus = async (id, title) => {
    if (window.confirm(`Delete syllabus scheme "${title}"?`)) {
      try {
        await cmsStore.deleteSyllabus(id, user?.name, isHOD ? userDepartmentId : null);
        showFeedback('Syllabus scheme removed successfully.');
      } catch (err) {
        showFeedback(err.message, true);
      }
    }
  };

  // --- Handlers: Faculty ---
  const handleOpenAddFaculty = () => {
    setEditingFaculty(null);
    setFacultyForm({
      id: '',
      name: '',
      designation: 'Assistant Professor',
      qualification: 'M.Sc., Ph.D / NET',
      email: '',
      phone: '',
      profile: `Faculty member in the ${dept?.name || 'Department'}.`,
      photoUrl: '/assets/images/faculty/default_faculty.png'
    });
    setIsFacultyModalOpen(true);
  };

  const handleOpenEditFaculty = (fac) => {
    setEditingFaculty(fac);
    setFacultyForm({
      id: fac.id || '',
      name: fac.name || '',
      designation: fac.designation || 'Assistant Professor',
      qualification: fac.qualification || '',
      email: fac.email || '',
      phone: fac.phone || '',
      profile: fac.profile || fac.bio || '',
      photoUrl: fac.photoUrl || fac.image || '/assets/images/faculty/default_faculty.png'
    });
    setIsFacultyModalOpen(true);
  };

  const handleSaveFaculty = async (e) => {
    e.preventDefault();
    try {
      await cmsStore.saveFaculty({
        ...facultyForm,
        departmentId: dept?.id,
        departmentSlug: dept?.slug || dept?.id,
        departmentName: dept?.name
      }, user?.name || 'HOD User');
      setIsFacultyModalOpen(false);
      showFeedback('Faculty member profile updated successfully!');
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const handleDeleteFaculty = async (id, name) => {
    if (window.confirm(`Remove faculty member "${name}" from this department?`)) {
      try {
        await cmsStore.deleteFaculty(id, user?.name);
        showFeedback('Faculty profile removed successfully.');
      } catch (err) {
        showFeedback(err.message, true);
      }
    }
  };

  // --- Handlers: Department Files ---
  const handleOpenAddDocument = () => {
    setDocForm({
      title: '',
      category: 'Lab Manual',
      year: '2026',
      localPath: '',
      fileName: '',
      fileSize: null
    });
    setIsDocModalOpen(true);
  };

  const handleSaveDocument = async (e) => {
    e.preventDefault();
    try {
      await cmsStore.saveDepartmentDocument({
        ...docForm,
        departmentId: dept?.id,
        department: dept?.name,
        filename: docForm.fileName || `${docForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`,
        fileSize: docForm.fileSize || 1024 * 350
      }, user?.name || 'HOD User', isHOD ? userDepartmentId : null);
      setIsDocModalOpen(false);
      setDocForm({ title: '', category: 'Lab Manual', year: '2026', localPath: '', fileName: '', fileSize: null });
      showFeedback('Departmental file uploaded successfully!');
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const handleDeleteDocument = async (id, title) => {
    if (window.confirm(`Delete document "${title}"?`)) {
      try {
        await cmsStore.deleteDepartmentDocument(id, user?.name, isHOD ? userDepartmentId : null);
        showFeedback('Document deleted successfully.');
      } catch (err) {
        showFeedback(err.message, true);
      }
    }
  };

  if (!dept) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
        <ShieldAlert className="w-12 h-12 mx-auto text-amber-500" />
        <h2 className="font-serif font-bold text-xl text-slate-900">Department Not Assigned</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Your account is not currently mapped to an active academic department. Please contact the administrator at <strong className="text-[#0B1F4E]">admin@stphilos.ac.in</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. TOP PORTAL BANNER */}
      <div className="bg-gradient-to-r from-[#061230] via-[#0B1F4E] to-[#102d6c] text-white p-6 sm:p-8 rounded-2xl shadow-md border-b-4 border-[#C9A84C] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center space-x-2.5">
            <span className="bg-[#C9A84C] text-[#061230] px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono">
              HOD DEPARTMENT PORTAL
            </span>
            <span className="text-blue-200 text-xs font-semibold">
              {dept.faculty || 'St. Philomena’s College (Autonomous)'}
            </span>
          </div>

          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            {dept.name}
          </h1>

          <p className="text-xs text-slate-300 font-sans">
            Logged in as <strong className="text-[#F0D98C]">{user?.name}</strong> ({user?.email}) · <span className="text-emerald-400 font-bold">Authorized Department Administrator</span>
          </p>
        </div>

        {/* Super Admin Switcher or View Public Page Button */}
        <div className="flex items-center space-x-3 z-10">
          {isSuperAdmin && (
            <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-xl border border-white/20">
              <span className="text-xs text-slate-300 font-bold">Switch Dept:</span>
              <select
                value={dept.id}
                onChange={(e) => setSearchParams({ deptId: e.target.value })}
                className="bg-[#071A33] text-white text-xs font-semibold p-1.5 rounded-lg border border-slate-600 focus:outline-none"
              >
                {allDepartments.map(d => (
                  <option key={d.id} value={d.id}>{d.shortName || d.name}</option>
                ))}
              </select>
            </div>
          )}

          <Link
            to={`/departments/${dept.slug || dept.id}`}
            target="_blank"
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-md"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}
      {saveError && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* 2. NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl px-3 pt-2 shadow-2xs gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleTabChange('page')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'page'
              ? 'border-[#0B1F4E] text-[#0B1F4E] bg-blue-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Department Overview & Page</span>
        </button>

        <button
          onClick={() => handleTabChange('syllabus')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'syllabus'
              ? 'border-[#0B1F4E] text-[#0B1F4E] bg-blue-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Syllabus & Curriculum ({deptSyllabuses.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('faculty')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'faculty'
              ? 'border-[#0B1F4E] text-[#0B1F4E] bg-blue-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>3. Department Faculty ({deptFaculty.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('documents')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'documents'
              ? 'border-[#0B1F4E] text-[#0B1F4E] bg-blue-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>4. Department Files & Lab Manuals ({deptDocs.length})</span>
        </button>
      </div>

      {/* 3. TAB 1: DEPARTMENT OVERVIEW & PAGE EDITOR */}
      {activeTab === 'page' && (
        <form onSubmit={handleSaveDeptInfo} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900">Department Public Page Information</h2>
              <p className="text-xs text-slate-500">Edit the official descriptions, vision, mission, facilities, and contact details for {dept.name}.</p>
            </div>
            <button
              type="submit"
              className="btn-navy px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#FFD84A]" />
              <span>Save & Publish Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Official Department Name *</label>
              <input
                type="text"
                required
                value={deptForm.name}
                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#1C5496]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Short Display Name / Code</label>
              <input
                type="text"
                value={deptForm.shortName}
                onChange={(e) => setDeptForm({ ...deptForm, shortName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="block text-slate-700 font-bold">About & Overview Description *</label>
            <textarea
              rows={4}
              required
              value={deptForm.description}
              onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 leading-relaxed focus:outline-none focus:border-[#1C5496]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Departmental Vision</label>
              <textarea
                rows={3}
                value={deptForm.vision}
                onChange={(e) => setDeptForm({ ...deptForm, vision: e.target.value })}
                placeholder="To be a center of excellence..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Departmental Mission</label>
              <textarea
                rows={3}
                value={deptForm.mission}
                onChange={(e) => setDeptForm({ ...deptForm, mission: e.target.value })}
                placeholder="To impart holistic education..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
              />
            </div>
          </div>

          {/* Department Facilities Manager */}
          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            <label className="block text-slate-700 font-bold text-sm">Laboratories & Departmental Facilities</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                placeholder="e.g. Advanced Embedded Systems & Cloud IoT Lab with 60 Workstations"
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
              />
              <button
                type="button"
                onClick={handleAddFacility}
                className="btn-navy px-4 py-2.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Facility</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {deptForm.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-800 font-medium">{fac}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {deptForm.facilities.length === 0 && (
                <p className="text-slate-400 italic">No facilities added yet. Add your department's laboratories, instruments, or research facilities.</p>
              )}
            </div>
          </div>

          {/* Department Banner / Photo Upload */}
          <div className="pt-2 border-t border-slate-100">
            <FileUploadZone
              label="Department Cover / Laboratory Photograph"
              subLabel="Upload high-resolution image of the department / laboratory (PNG, JPG, WEBP)"
              accept="image/*"
              type="image"
              value={deptForm.photoUrl}
              onChange={({ dataUrl, fileName }) => {
                setDeptForm(prev => ({
                  ...prev,
                  photoUrl: dataUrl
                }));
              }}
            />
          </div>

          {/* Contact & Office Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-4 border-t border-slate-100">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Department Email</label>
              <input
                type="email"
                value={deptForm.email}
                onChange={(e) => setDeptForm({ ...deptForm, email: e.target.value })}
                placeholder="hod.dept@stphilos.ac.in"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Department Phone / Extension</label>
              <input
                type="text"
                value={deptForm.phone}
                onChange={(e) => setDeptForm({ ...deptForm, phone: e.target.value })}
                placeholder="+91 9008580707"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Campus Office Location</label>
              <input
                type="text"
                value={deptForm.office}
                onChange={(e) => setDeptForm({ ...deptForm, office: e.target.value })}
                placeholder="Science Block, 2nd Floor, Room 204"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="btn-navy px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#FFD84A]" />
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. TAB 2: SYLLABUS & CURRICULUM MANAGEMENT */}
      {activeTab === 'syllabus' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900">Department Syllabus & Regulations</h2>
              <p className="text-xs text-slate-500">Upload and configure semester syllabus schemes, NEP 2020 course structures, and curriculum PDFs for {dept.name}.</p>
            </div>
            <button
              onClick={handleOpenAddSyllabus}
              className="btn-navy px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Syllabus Scheme</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deptSyllabuses.map((syl) => (
              <div key={syl.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-[#1C5496] transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#0B1F4E] text-[#FFD84A]">
                      {syl.code}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      {syl.semestersCount || 6} Semesters · {syl.totalCredits || 144} Credits
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900">{syl.title}</h3>
                  <p className="text-xs text-slate-600">{syl.degree}</p>
                  <p className="text-[11px] text-[#1C5496] font-semibold">{syl.regulation}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <a
                    href={syl.localPdf || '/assets/documents/academic-regulations.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#1C5496] hover:underline inline-flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEditSyllabus(syl)}
                      className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSyllabus(syl.id, syl.title)}
                      className="p-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 cursor-pointer"
                      title="Delete Syllabus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {deptSyllabuses.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-700">No syllabus schemes published yet for {dept.name}.</p>
              <p className="text-xs text-slate-500">Click "Add Syllabus Scheme" above to configure course breakdowns and upload syllabus PDF files.</p>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: FACULTY ROSTER MANAGEMENT */}
      {activeTab === 'faculty' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900">Department Faculty Members</h2>
              <p className="text-xs text-slate-500">Manage teaching staff, designations, qualifications, and profile photos for {dept.name}.</p>
            </div>
            <button
              onClick={handleOpenAddFaculty}
              className="btn-navy px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deptFaculty.map((fac) => (
              <div key={fac.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start space-x-3.5 justify-between">
                <div className="flex items-start space-x-3 min-w-0">
                  <img
                    src={fac.photoUrl || fac.image || '/assets/images/faculty/default_faculty.png'}
                    alt={fac.name}
                    className="w-14 h-14 rounded-xl object-cover object-top shrink-0 border border-slate-300 bg-white"
                    onError={(e) => { e.target.src = '/assets/images/faculty/default_faculty.png'; }}
                  />
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-serif font-bold text-sm text-slate-900 truncate">{fac.name}</h4>
                    <p className="text-xs text-[#1C5496] font-semibold truncate">{fac.designation}</p>
                    <p className="text-[11px] text-slate-500 truncate">{fac.qualification}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditFaculty(fac)}
                    className="p-1 text-slate-500 hover:text-[#1C5496] rounded transition-colors"
                    title="Edit Profile"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaculty(fac.id, fac.name)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {deptFaculty.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-700">No faculty members listed under {dept.name}.</p>
              <p className="text-xs text-slate-500">Click "Add Faculty Member" to catalog teaching professors and lecturers.</p>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 4: DEPARTMENT DOCUMENTS & LAB MANUALS */}
      {activeTab === 'documents' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900">Departmental Files & Downloads</h2>
              <p className="text-xs text-slate-500">Upload lab manuals, project guidelines, student notices, and departmental documents.</p>
            </div>
            <button
              onClick={handleOpenAddDocument}
              className="btn-navy px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="space-y-3">
            {deptDocs.map((doc) => (
              <div key={doc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2.5 rounded-lg bg-blue-100 text-[#1C5496] shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-sm text-slate-900 truncate">{doc.title}</h4>
                    <p className="text-xs text-slate-500 font-mono">
                      {doc.category || 'Department Document'} · {doc.year || '2026'} · PDF
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={doc.localPath || '/assets/documents/academic-regulations.pdf'}
                    download
                    className="p-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                  <button
                    onClick={() => handleDeleteDocument(doc.id, doc.title)}
                    className="p-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg"
                    title="Delete File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {deptDocs.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <FolderGit2 className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-700">No departmental documents uploaded yet.</p>
              <p className="text-xs text-slate-500">Upload lab manuals, circulars, or brochures for your students.</p>
            </div>
          )}
        </div>
      )}

      {/* --- MODAL: SYLLABUS FORM --- */}
      {isSyllabusModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {editingSyllabus ? 'Edit Syllabus Scheme' : 'Add New Department Syllabus Scheme'}
              </h3>
              <button onClick={() => setIsSyllabusModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveSyllabus} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Course / Programme Code *</label>
                  <input
                    type="text"
                    required
                    value={syllabusForm.code}
                    onChange={(e) => setSyllabusForm({ ...syllabusForm, code: e.target.value })}
                    placeholder="e.g. BCA or PHY-UG"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#1C5496]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Degree Credits</label>
                  <input
                    type="number"
                    value={syllabusForm.totalCredits}
                    onChange={(e) => setSyllabusForm({ ...syllabusForm, totalCredits: parseInt(e.target.value) || 144 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Degree Title *</label>
                <input
                  type="text"
                  required
                  value={syllabusForm.title}
                  onChange={(e) => setSyllabusForm({ ...syllabusForm, title: e.target.value })}
                  placeholder="e.g. Bachelor of Computer Applications (BCA)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Academic Regulation Scheme</label>
                <input
                  type="text"
                  value={syllabusForm.regulation}
                  onChange={(e) => setSyllabusForm({ ...syllabusForm, regulation: e.target.value })}
                  placeholder="Autonomous NEP 2020 / CBCS"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              <div>
                <FileUploadZone
                  label="Upload Syllabus PDF Document"
                  subLabel="Drag & drop official syllabus PDF here, or click to browse (up to 25MB)"
                  accept=".pdf,application/pdf"
                  type="pdf"
                  value={syllabusForm.localPdf}
                  fileName={syllabusForm.pdfFileName || (syllabusForm.localPdf?.startsWith('data:') ? `${syllabusForm.code || 'Course'}-Syllabus.pdf` : syllabusForm.localPdf?.split('/').pop())}
                  onChange={({ dataUrl, fileName, fileSize }) => {
                    setSyllabusForm(prev => ({
                      ...prev,
                      localPdf: dataUrl,
                      pdfFileName: fileName,
                      pdfFileSize: fileSize
                    }));
                  }}
                  required={true}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsSyllabusModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-navy px-5 py-2 rounded-lg font-bold"
                >
                  Save Syllabus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: FACULTY FORM --- */}
      {isFacultyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {editingFaculty ? 'Edit Faculty Profile' : 'Add Faculty Member'}
              </h3>
              <button onClick={() => setIsFacultyModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveFaculty} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Faculty Full Name *</label>
                <input
                  type="text"
                  required
                  value={facultyForm.name}
                  onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                  placeholder="e.g. Dr. John D'Souza"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Academic Designation *</label>
                  <select
                    value={facultyForm.designation}
                    onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#1C5496]"
                  >
                    <option value="Professor & Head">Professor & Head</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Guest Faculty">Guest Faculty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Qualifications *</label>
                  <input
                    type="text"
                    required
                    value={facultyForm.qualification}
                    onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })}
                    placeholder="M.Sc., Ph.D, K-SET"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Email</label>
                <input
                  type="email"
                  value={facultyForm.email}
                  onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                  placeholder="faculty@stphilos.ac.in"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              <div>
                <FileUploadZone
                  label="Faculty Profile Photograph"
                  subLabel="Upload passport photo or portrait (PNG, JPG, WEBP)"
                  accept="image/*"
                  type="image"
                  value={facultyForm.photoUrl}
                  onChange={({ dataUrl, fileName }) => {
                    setFacultyForm(prev => ({
                      ...prev,
                      photoUrl: dataUrl
                    }));
                  }}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Short Profile / Research Interests</label>
                <textarea
                  rows={3}
                  value={facultyForm.profile}
                  onChange={(e) => setFacultyForm({ ...facultyForm, profile: e.target.value })}
                  placeholder="Specialization in Machine Learning, Cloud Computing, and Algorithms..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsFacultyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-navy px-5 py-2 rounded-lg font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: DOCUMENT UPLOAD --- */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-slate-900">Upload Department Document</h3>
              <button onClick={() => setIsDocModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  placeholder="e.g. Data Structures Laboratory Manual 2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#1C5496]"
                  >
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Syllabus">Syllabus</option>
                    <option value="Timetable">Timetable</option>
                    <option value="Brochure">Brochure</option>
                    <option value="Circular">Department Circular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={docForm.year}
                    onChange={(e) => setDocForm({ ...docForm, year: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1C5496]"
                  />
                </div>
              </div>

              <div>
                <FileUploadZone
                  label="Upload Department File / Lab Manual"
                  subLabel="Drag & drop PDF or Word Document here, or click to browse (up to 25MB)"
                  accept=".pdf,.doc,.docx,application/pdf"
                  type="pdf"
                  value={docForm.localPath}
                  fileName={docForm.fileName || (docForm.localPath?.startsWith('data:') ? `${docForm.title || 'document'}.pdf` : docForm.localPath?.split('/').pop())}
                  fileSize={docForm.fileSize}
                  onChange={({ dataUrl, fileName, fileSize }) => {
                    setDocForm(prev => ({
                      ...prev,
                      localPath: dataUrl,
                      fileName: fileName || prev.title,
                      fileSize: fileSize || 1024 * 350,
                      title: prev.title ? prev.title : (fileName ? fileName.replace(/\.[^/.]+$/, "") : '')
                    }));
                  }}
                  required={true}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-navy px-5 py-2 rounded-lg font-bold"
                >
                  Save File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
