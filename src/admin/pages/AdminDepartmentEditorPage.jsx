import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  Save, 
  Eye, 
  Send, 
  Plus, 
  Trash2, 
  Edit3, 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Upload, 
  ImageIcon, 
  FileText, 
  Users, 
  GraduationCap, 
  Calendar, 
  Bell, 
  LayoutList, 
  Table as TableIcon, 
  Link as LinkIcon, 
  ExternalLink,
  RefreshCw,
  Sparkles,
  Info,
  Copy,
  Settings,
  HelpCircle,
  EyeOff
} from 'lucide-react';
import * as deptService from '../../services/departmentsService';
import FileUploadZone from '../../components/common/FileUploadZone';

export default function AdminDepartmentEditorPage() {
  const { deptId } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [sections, setSections] = useState([]);
  const [assignedFaculty, setAssignedFaculty] = useState([]);
  const [allFaculty, setAllFaculty] = useState([]);
  const [assignedProgrammes, setAssignedProgrammes] = useState([]);
  const [allProgrammes, setAllProgrammes] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // General Form State
  const [generalForm, setGeneralForm] = useState({
    name: '',
    slug: '',
    category: 'Science',
    head: '',
    short_description: '',
    description: '',
    banner_image: '',
    seo_title: '',
    seo_description: '',
  });

  // Active Tab: 'sections' | 'general' | 'faculty' | 'programmes'
  const [activeTab, setActiveTab] = useState('sections');

  // Section Editing Modal State
  const [editingSection, setEditingSection] = useState(null);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);

  // Load Department Data
  const loadDepartmentData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await deptService.getAdminDepartment(deptId);
      if (data?.department) {
        setDepartment(data.department);
        setGeneralForm({
          name: data.department.name || '',
          slug: data.department.slug || '',
          category: data.department.category || 'Science',
          head: data.department.head || '',
          short_description: data.department.short_description || '',
          description: data.department.description || '',
          banner_image: data.department.banner_image || '/assets/banner-college.jpg',
          seo_title: data.department.seo_title || '',
          seo_description: data.department.seo_description || '',
        });
        setSections(data.sections || []);
        setAssignedFaculty(data.assigned_faculty || []);
        setAllFaculty(data.all_faculty || []);
        setAssignedProgrammes(data.assigned_programmes || []);
        setAllProgrammes(data.all_programmes || []);
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to load department data from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDepartmentData();
  }, [deptId]);

  // Section Reordering (Up/Down)
  const handleMoveSection = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Recalculate display_order
    const updated = newSections.map((sec, idx) => ({
      ...sec,
      display_order: (idx + 1) * 10
    }));

    setSections(updated);
  };

  // Toggle section enabled
  const handleToggleSectionEnabled = (secId) => {
    setSections(prev => prev.map(s => s.id === secId ? { ...s, is_enabled: !s.is_enabled } : s));
  };

  // Delete section
  const handleDeleteSection = (secId) => {
    if (!window.confirm('Are you sure you want to remove this section from the page?')) return;
    setSections(prev => prev.filter(s => s.id !== secId));
  };

  // Add new section
  const handleAddSectionType = (typeKey, typeTitle) => {
    const newSectionId = `sec-dft-${Date.now()}`;
    let defaultContent = {};

    switch (typeKey) {
      case 'text':
        defaultContent = { heading: typeTitle, subheading: '', body: 'Write your content here...' };
        break;
      case 'image':
        defaultContent = { heading: typeTitle, imageUrl: '/assets/banner-college.jpg', alt: typeTitle, caption: '' };
        break;
      case 'text_image':
        defaultContent = { heading: typeTitle, body: 'Description text...', imageUrl: '/assets/banner-college.jpg', position: 'right' };
        break;
      case 'cards':
        defaultContent = { heading: typeTitle, subheading: '', cards: [{ id: 'c1', title: 'Highlight 1', description: 'Details here...' }] };
        break;
      case 'documents':
        defaultContent = { heading: typeTitle, subheading: 'Download files and syllabi', documents: [] };
        break;
      case 'tables':
        defaultContent = { heading: typeTitle, headers: ['Semester', 'Course Code', 'Credits'], rows: [['Sem 1', 'CS101', '4']] };
        break;
      case 'gallery':
        defaultContent = { heading: typeTitle, images: [] };
        break;
      case 'links':
        defaultContent = { heading: typeTitle, links: [{ title: 'Resource Link', url: 'https://', target: '_blank' }] };
        break;
      case 'programs':
        defaultContent = { heading: 'Programmes Offered', subheading: 'Degree pathways offered by the department' };
        break;
      case 'faculty':
        defaultContent = { heading: 'Faculty Directory', subheading: 'Our esteemed teaching faculty and researchers' };
        break;
      case 'facilities':
        defaultContent = { heading: 'Department Facilities & Laboratories', items: [] };
        break;
      case 'notices':
        defaultContent = { heading: 'Department Notices', limit: 4 };
        break;
      case 'events':
        defaultContent = { heading: 'Conferences & Seminars', limit: 3 };
        break;
      case 'contact':
        defaultContent = { heading: 'Get in Touch', email: `${department?.slug || 'dept'}@stphilos.ac.in`, phone: '+91 821 4240900' };
        break;
      default:
        defaultContent = { heading: typeTitle, body: '' };
    }

    const newSec = {
      id: newSectionId,
      department_id: department.id,
      section_key: `custom_${typeKey}_${Date.now()}`,
      title: typeTitle,
      type: typeKey,
      content: defaultContent,
      display_order: (sections.length + 1) * 10,
      is_enabled: true,
      version: 'draft'
    };

    setSections(prev => [...prev, newSec]);
    setIsAddSectionModalOpen(false);
    setEditingSection(newSec);
    setIsEditSectionModalOpen(true);
  };

  // Save Section Form
  const handleSaveSectionContent = (updatedSec) => {
    setSections(prev => prev.map(s => s.id === updatedSec.id ? updatedSec : s));
    setIsEditSectionModalOpen(false);
    setEditingSection(null);
  };

  // SAVE DRAFT
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const payload = {
        general: generalForm,
        sections: sections,
        faculty_ids: assignedFaculty.map(f => f.id),
        program_codes: assignedProgrammes.map(p => p.code),
      };

      const res = await deptService.saveDepartmentDraft(department.id, payload);
      setSuccessMessage('Draft saved successfully! The public website remains on the previously published version.');
      if (res?.sections) {
        setSections(res.sections);
      }
      if (res?.department) {
        setDepartment(res.department);
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  // PUBLISH
  const handlePublish = async () => {
    if (!window.confirm('Publish all draft changes to the live college website? This will immediately update the public department page.')) {
      return;
    }

    setIsPublishing(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      // Auto-save draft first to ensure state is clean
      await deptService.saveDepartmentDraft(department.id, {
        general: generalForm,
        sections: sections,
        faculty_ids: assignedFaculty.map(f => f.id),
        program_codes: assignedProgrammes.map(p => p.code),
      });

      // Call publish endpoint
      const res = await deptService.publishDepartment(department.id);
      setSuccessMessage(`"${department.name}" published successfully! Changes are now live on the public website.`);
      if (res?.department) {
        setDepartment(res.department);
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to publish department.');
    } finally {
      setIsPublishing(false);
    }
  };

  // UNPUBLISH
  const handleUnpublish = async () => {
    if (!window.confirm('Take this department page offline (Unpublish)?')) return;
    try {
      const res = await deptService.unpublishDepartment(department.id);
      setSuccessMessage('Department is now unpublished and hidden from public view.');
      if (res?.department) {
        setDepartment(res.department);
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to unpublish department.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-mono">Loading Department Editor...</p>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Department Not Found</h2>
        <p className="text-xs text-slate-500">The requested department could not be located.</p>
        <Link to="/admin/department-pages" className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Department List</span>
        </Link>
      </div>
    );
  }

  const isPublished = (department.status || 'published') === 'published';
  const previewUrl = `/departments/${department.slug || department.id}?preview=1`;
  const liveUrl = `/departments/${department.slug || department.id}`;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* 1. TOP TOOLBAR & CONTROLS */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
            <Link to="/admin/department-pages" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Departments</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Editor</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 tracking-tight">
              Edit {department.name}
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
              isPublished 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        {/* Action Buttons: Preview, Save Draft, Publish, Unpublish */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          
          {/* Preview Button */}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Preview current draft changes without publishing"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Preview Draft</span>
          </a>

          {/* Live Page link */}
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-3 py-2 text-slate-500 hover:text-slate-900 text-xs font-semibold"
            title="View current live page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live View</span>
          </a>

          {/* Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300/80 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-slate-700" />}
            <span>Save Draft</span>
          </button>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={isSaving || isPublishing}
            className="inline-flex items-center space-x-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            {isPublishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Publish Live</span>
          </button>

          {isPublished && (
            <button
              onClick={handleUnpublish}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
              title="Unpublish (Take offline)"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

      {/* NOTIFICATIONS */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="p-1 text-emerald-600 hover:text-emerald-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="p-1 text-rose-600 hover:text-rose-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'sections' ? 'bg-[#18191f] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          <span>Page Sections ({sections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'general' ? 'bg-[#18191f] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>General & Banner</span>
        </button>

        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'faculty' ? 'bg-[#18191f] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty Roster ({assignedFaculty.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('programmes')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'programmes' ? 'bg-[#18191f] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Programmes ({assignedProgrammes.length})</span>
        </button>
      </div>

      {/* 3. TAB CONTENT: PAGE SECTIONS */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Modular Page Sections</h3>
              <p className="text-xs text-slate-500">
                Reorder, configure, or add sections. The public page will render these sections in this exact order.
              </p>
            </div>
            
            <button
              onClick={() => setIsAddSectionModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#1C5496] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Section</span>
            </button>
          </div>

          {/* Sections List */}
          <div className="space-y-3">
            {sections.map((sec, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === sections.length - 1;

              return (
                <div
                  key={sec.id || idx}
                  className={`bg-white border rounded-2xl p-4 transition-all shadow-xs flex items-center justify-between gap-4 ${
                    sec.is_enabled ? 'border-slate-200/80 hover:border-slate-300' : 'border-slate-200/40 bg-slate-50/60 opacity-60'
                  }`}
                >
                  {/* Left: Reorder controls & Title */}
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    
                    {/* Move Up/Down buttons */}
                    <div className="flex flex-col space-y-0.5 shrink-0">
                      <button
                        onClick={() => handleMoveSection(idx, -1)}
                        disabled={isFirst}
                        className={`p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100 ${isFirst ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSection(idx, 1)}
                        disabled={isLast}
                        className={`p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100 ${isLast ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Order Index */}
                    <span className="w-6 text-center text-xs font-mono font-bold text-slate-400 shrink-0">
                      #{idx + 1}
                    </span>

                    {/* Section Details */}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {sec.title || sec.section_key}
                        </h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono font-bold uppercase">
                          {sec.type}
                        </span>
                        {!sec.is_enabled && (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[10px] font-bold">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans truncate">
                        {sec.content?.heading || sec.content?.subheading || sec.content?.body || 'Configured section content'}
                      </p>
                    </div>

                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    
                    {/* Visibility Toggle */}
                    <button
                      onClick={() => handleToggleSectionEnabled(sec.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                        sec.is_enabled ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                      }`}
                    >
                      {sec.is_enabled ? 'Visible' : 'Hidden'}
                    </button>

                    {/* Edit Section Content */}
                    <button
                      onClick={() => {
                        setEditingSection(sec);
                        setIsEditSectionModalOpen(true);
                      }}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Content</span>
                    </button>

                    {/* Delete Section */}
                    <button
                      onClick={() => handleDeleteSection(sec.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 4. TAB CONTENT: GENERAL & BANNER */}
      {activeTab === 'general' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif font-bold text-base text-slate-900">General Department Profile</h3>
            <p className="text-xs text-slate-500">Core identification, URL routing, banner, and search engine metadata.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Department Name *</label>
              <input
                type="text"
                value={generalForm.name}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">URL Slug *</label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 font-mono text-[11px]">
                  /departments/
                </span>
                <input
                  type="text"
                  value={generalForm.slug}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-xl focus:bg-white focus:border-slate-900 text-slate-900 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Faculty / Category</label>
              <select
                value={generalForm.category}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900"
              >
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Management">Management</option>
                <option value="Humanities">Humanities</option>
                <option value="Languages">Languages</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Head of Department (HOD)</label>
              <input
                type="text"
                value={generalForm.head}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, head: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-700">Short Summary</label>
              <textarea
                rows="2"
                value={generalForm.short_description}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, short_description: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900"
              />
            </div>

            {/* Banner Image */}
            <div className="md:col-span-2 space-y-2 pt-2 border-t border-slate-100">
              <label className="font-bold text-slate-700">Department Banner Image</label>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full sm:w-64 aspect-video bg-slate-900 rounded-xl overflow-hidden relative shadow-xs border border-slate-200">
                  <img
                    src={generalForm.banner_image || '/assets/banner-college.jpg'}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/assets/banner-college.jpg'; }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-mono rounded">
                    Banner Preview
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    placeholder="/assets/banner-college.jpg"
                    value={generalForm.banner_image}
                    onChange={(e) => setGeneralForm(prev => ({ ...prev, banner_image: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900 font-mono text-xs"
                  />
                  <FileUploadZone
                    onUploadSuccess={(fileUrl) => {
                      setGeneralForm(prev => ({ ...prev, banner_image: fileUrl }));
                      setSuccessMessage('Banner uploaded and attached.');
                    }}
                    accept="image/*"
                    label="Drop new banner image here, or browse files"
                  />
                </div>
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="md:col-span-2 space-y-3 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs">Search Engine Optimization (SEO)</h4>
              
              <div className="space-y-1.5">
                <label className="text-slate-600 font-medium">SEO Title</label>
                <input
                  type="text"
                  placeholder="Department Name | St. Philomena's College"
                  value={generalForm.seo_title}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, seo_title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 font-medium">SEO Meta Description</label>
                <textarea
                  rows="2"
                  value={generalForm.seo_description}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, seo_description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900 text-xs"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 bg-[#18191f] hover:bg-slate-800 text-white rounded-xl font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save General Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: FACULTY ROSTER */}
      {activeTab === 'faculty' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">Assigned Faculty Members</h3>
              <p className="text-xs text-slate-500">
                Faculty belonging to {department.name}. Changes saved here update the department's faculty directory section.
              </p>
            </div>

            <Link
              to="/admin/faculty"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              Manage All Faculty
            </Link>
          </div>

          {/* Assigned Faculty Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedFaculty.map(f => (
              <div key={f.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={f.photo_url || '/assets/faculty/default-avatar.png'}
                    alt={f.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    onError={(e) => { e.currentTarget.src = '/assets/faculty/default-avatar.png'; }}
                  />
                  <div className="min-w-0">
                    <h5 className="font-bold text-slate-900 truncate text-xs">{f.name}</h5>
                    <p className="text-[11px] text-slate-500 truncate">{f.designation || 'Faculty Member'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setAssignedFaculty(prev => prev.filter(x => x.id !== f.id))}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  title="Remove from Department"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Faculty from directory */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="font-bold text-xs text-slate-800">Add Faculty Member to Department</h4>
            <select
              onChange={(e) => {
                const facId = e.target.value;
                if (!facId) return;
                const match = allFaculty.find(f => f.id === facId);
                if (match && !assignedFaculty.some(f => f.id === facId)) {
                  setAssignedFaculty(prev => [...prev, match]);
                }
                e.target.value = '';
              }}
              defaultValue=""
              className="w-full sm:w-80 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            >
              <option value="" disabled>Select from college faculty directory...</option>
              {allFaculty
                .filter(f => !assignedFaculty.some(af => af.id === f.id))
                .map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.designation || 'Faculty'})</option>
                ))
              }
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 bg-[#18191f] hover:bg-slate-800 text-white rounded-xl font-bold transition-colors cursor-pointer flex items-center space-x-1.5 text-xs"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Faculty Assignments</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: PROGRAMMES */}
      {activeTab === 'programmes' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">Department Programmes</h3>
              <p className="text-xs text-slate-500">Degree courses offered or hosted under {department.name}.</p>
            </div>

            <Link
              to="/admin/programmes"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              Manage All Programmes
            </Link>
          </div>

          {/* Assigned Programmes List */}
          <div className="space-y-2">
            {assignedProgrammes.map(p => (
              <div key={p.code} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-100 text-blue-800">
                    {p.level || 'ug'}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">{p.title}</h5>
                    <span className="text-[11px] font-mono text-slate-400">Code: {p.code} • Degree: {p.degree || 'Autonomous'}</span>
                  </div>
                </div>

                <button
                  onClick={() => setAssignedProgrammes(prev => prev.filter(x => x.code !== p.code))}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  title="Remove from Department"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Programme from catalog */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="font-bold text-xs text-slate-800">Link Programme to Department</h4>
            <select
              onChange={(e) => {
                const pCode = e.target.value;
                if (!pCode) return;
                const match = allProgrammes.find(p => p.code === pCode);
                if (match && !assignedProgrammes.some(p => p.code === pCode)) {
                  setAssignedProgrammes(prev => [...prev, match]);
                }
                e.target.value = '';
              }}
              defaultValue=""
              className="w-full sm:w-80 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            >
              <option value="" disabled>Select from academic programmes...</option>
              {allProgrammes
                .filter(p => !assignedProgrammes.some(ap => ap.code === p.code))
                .map(p => (
                  <option key={p.code} value={p.code}>{p.title} ({p.code})</option>
                ))
              }
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 bg-[#18191f] hover:bg-slate-800 text-white rounded-xl font-bold transition-colors cursor-pointer flex items-center space-x-1.5 text-xs"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Programme Assignments</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. ADD SECTION MODAL (Section Types Selector) */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Add Page Section</h3>
                <p className="text-xs text-slate-500">Select a reusable content section component to add to this department.</p>
              </div>
              <button
                onClick={() => setIsAddSectionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto">
              
              <button
                onClick={() => handleAddSectionType('text', 'About & Overview')}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all space-y-1.5 group cursor-pointer"
              >
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-700">Text / Overview</h4>
                <p className="text-[11px] text-slate-500">Rich heading and markdown narrative.</p>
              </button>

              <button
                onClick={() => handleAddSectionType('cards', 'Highlights & Cards')}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-amber-500 hover:bg-amber-50/50 text-left transition-all space-y-1.5 group cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-700">Cards & Grid</h4>
                <p className="text-[11px] text-slate-500">Specializations, vision, or highlights.</p>
              </button>

              <button
                onClick={() => handleAddSectionType('programs', 'Programmes Offered')}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all space-y-1.5 group cursor-pointer"
              >
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">Programmes</h4>
                <p className="text-[11px] text-slate-500">Degree curriculum pathways grid.</p>
              </button>

              <button
                onClick={() => handleAddSectionType('faculty', 'Faculty Members')}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all space-y-1.5 group cursor-pointer"
              >
                <Users className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-700">Faculty Roster</h4>
                <p className="text-[11px] text-slate-500">Interactive faculty profiles & avatars.</p>
              </button>

              <button
                onClick={() => handleAddSectionType('facilities', 'Laboratories & Facilities')}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-cyan-500 hover:bg-cyan-50/50 text-left transition-all space-y-1.5 group cursor-pointer"
              >
                <Building2 className="w-5 h-5 text-cyan-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-cyan-700">Facilities</h4>
                <p className="text-[11px] text-slate-500">Lab equipment and infrastructure.</p>
              </button>

              <button
                onClick={() => handleAddSectionType('documents', 'Documents & Syllabus')}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-purple-500 hover:bg-purple-50/50 text-left transition-all space-y-1.5 group cursor-pointer"
              >
                <FileText className="w-5 h-5 text-purple-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-purple-700">Documents</h4>
                <p className="text-[11px] text-slate-500">Syllabi and academic PDF files.</p>
              </button>

              <button
                onClick={() => handleAddSectionType('notices', 'Department Notices')}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-rose-500 hover:bg-rose-50/50 text-left transition-all space-y-1.5 group cursor-pointer"
              >
                <Bell className="w-5 h-5 text-rose-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-rose-700">Notices</h4>
                <p className="text-[11px] text-slate-500">Circulars and announcements.</p>
              </button>

              <button
                onClick={() => handleAddSectionType('events', 'Events & Workshops')}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all space-y-1.5 group cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-teal-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-700">Events</h4>
                <p className="text-[11px] text-slate-500">Conferences and seminars.</p>
              </button>

              <button
                onClick={() => handleAddSectionType('contact', 'Contact Information')}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-500 hover:bg-slate-100/50 text-left transition-all space-y-1.5 group cursor-pointer"
              >
                <Building2 className="w-5 h-5 text-slate-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-slate-900">Contact</h4>
                <p className="text-[11px] text-slate-500">Office room, email, and phone.</p>
              </button>

            </div>

          </div>
        </div>
      )}

      {/* 8. SECTION CONTENT EDITOR MODAL */}
      {isEditSectionModalOpen && editingSection && (
        <SectionContentEditorModal
          section={editingSection}
          onSave={handleSaveSectionContent}
          onClose={() => {
            setIsEditSectionModalOpen(false);
            setEditingSection(null);
          }}
        />
      )}

    </div>
  );
}

/**
 * Dedicated Section Content Editor Modal
 */
function SectionContentEditorModal({ section, onSave, onClose }) {
  const [title, setTitle] = useState(section.title || '');
  const [content, setContent] = useState(section.content || {});

  const handleUpdateField = (key, val) => {
    setContent(prev => ({ ...prev, [key]: val }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...section,
      title,
      content
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Type: {section.type}
            </span>
            <h3 className="font-serif font-bold text-base text-slate-900 mt-1">
              Edit Section: {section.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Section Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Heading Displayed on Page</label>
            <input
              type="text"
              value={content.heading || ''}
              onChange={(e) => handleUpdateField('heading', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Subheading / Badge</label>
            <input
              type="text"
              value={content.subheading || ''}
              onChange={(e) => handleUpdateField('subheading', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900"
            />
          </div>

          {/* Type-Specific Editors */}
          {section.type === 'text' && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Narrative / Rich Text Body</label>
              <textarea
                rows="6"
                value={content.body || ''}
                onChange={(e) => handleUpdateField('body', e.target.value)}
                placeholder="Enter markdown or plain text paragraphs..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900 font-sans leading-relaxed"
              />
            </div>
          )}

          {section.type === 'cards' && (
            <div className="space-y-3 pt-2">
              <label className="font-bold text-slate-700 block">Cards Items</label>
              {(content.cards || []).map((card, cIdx) => (
                <div key={cIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[11px] text-slate-700">Card #{cIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newCards = content.cards.filter((_, i) => i !== cIdx);
                        handleUpdateField('cards', newCards);
                      }}
                      className="text-rose-600 hover:text-rose-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Card Title"
                    value={card.title || ''}
                    onChange={(e) => {
                      const newCards = [...content.cards];
                      newCards[cIdx].title = e.target.value;
                      handleUpdateField('cards', newCards);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <textarea
                    rows="2"
                    placeholder="Card Description"
                    value={card.description || ''}
                    onChange={(e) => {
                      const newCards = [...content.cards];
                      newCards[cIdx].description = e.target.value;
                      handleUpdateField('cards', newCards);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newCards = [...(content.cards || []), { title: 'New Highlight', description: '' }];
                  handleUpdateField('cards', newCards);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
              >
                + Add Card
              </button>
            </div>
          )}

          {section.type === 'contact' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Department Email</label>
                <input
                  type="email"
                  value={content.email || ''}
                  onChange={(e) => handleUpdateField('email', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Department Phone</label>
                <input
                  type="text"
                  value={content.phone || ''}
                  onChange={(e) => handleUpdateField('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="font-bold text-slate-700">Office Location</label>
                <input
                  type="text"
                  value={content.office || ''}
                  onChange={(e) => handleUpdateField('office', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {section.type === 'documents' && (
            <div className="space-y-3 pt-2">
              <label className="font-bold text-slate-700 block">Attached Documents</label>
              {(content.documents || []).map((doc, dIdx) => (
                <div key={dIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[11px] text-slate-700">Document #{dIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newDocs = content.documents.filter((_, i) => i !== dIdx);
                        handleUpdateField('documents', newDocs);
                      }}
                      className="text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Document Title"
                    value={doc.title || ''}
                    onChange={(e) => {
                      const newDocs = [...content.documents];
                      newDocs[dIdx].title = e.target.value;
                      handleUpdateField('documents', newDocs);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="File URL (/assets/...)"
                    value={doc.fileUrl || ''}
                    onChange={(e) => {
                      const newDocs = [...content.documents];
                      newDocs[dIdx].fileUrl = e.target.value;
                      handleUpdateField('documents', newDocs);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-[11px]"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newDocs = [...(content.documents || []), { title: 'New Document', fileUrl: '', type: 'PDF' }];
                  handleUpdateField('documents', newDocs);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
              >
                + Add Document
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#18191f] hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
            >
              Apply to Draft
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
