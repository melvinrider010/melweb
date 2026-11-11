import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Award, 
  Briefcase, 
  HeartHandshake, 
  Building2, 
  Globe2, 
  CheckCircle2, 
  FileText, 
  Download, 
  Search, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Upload, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  X,
  Share2,
  ExternalLink
} from 'lucide-react';
import useCms from '../lib/useCms';
import cmsStore from '../lib/cmsStore';
import alumniData from '../data/alumniData.json';

export default function AlumniPage() {
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'hall-of-fame' | 'network' | 'about'
  
  // Reactive Alumni submissions from local CMS store
  const alumniList = useCms(() => cmsStore.getAlumniSubmissions());

  // Form State
  const initialForm = {
    // 1. Academic History
    course: alumniData.options.courses[0] || 'Bachelor of Computer Applications (BCA)',
    department: alumniData.options.departments[0] || 'Department of Computer Science & Applications',
    batchYear: '',
    passingYear: '',
    registerNumber: '',
    classObtained: alumniData.options.classes[0] || 'First Class (60% - 79%)',

    // 2. Contact & Personal
    fullName: '',
    photo: '',
    dob: '',
    gender: 'Male',
    email: '',
    mobile: '',
    address: '',
    city: 'Mysuru',
    state: 'Karnataka',
    country: 'India',

    // 3. Career & Employment
    jobTitle: '',
    organisation: '',
    industry: alumniData.options.industries[0] || 'Information Technology & Artificial Intelligence',
    workLocation: '',
    higherStudies: '',

    // 4. Engagement & Mentorship
    willingToMentor: 'Yes',
    expertise: '',
    linkedinUrl: '',
    achievements: '',
    remarks: '',

    // Anti-spam honeypot
    website: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [directorySearch, setDirectorySearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  // Handle Photo Upload (Client-side DataURL)
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.website) return; // Spam prevention

    setIsSubmitting(true);

    try {
      const result = await cmsStore.saveAlumniRegistration(formData);
      setSubmittedData(result);
      setFormData(initialForm);
      setPhotoPreview(null);
    } catch (err) {
      console.error('Error saving alumni registration:', err);
      alert('There was an issue recording your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Directory of Mentors & Alumni
  const filteredDirectory = alumniList.filter(item => {
    const matchesSearch = (
      (item.fullName || '').toLowerCase().includes(directorySearch.toLowerCase()) ||
      (item.organisation || '').toLowerCase().includes(directorySearch.toLowerCase()) ||
      (item.jobTitle || '').toLowerCase().includes(directorySearch.toLowerCase()) ||
      (item.batchYear || '').includes(directorySearch) ||
      (item.city || '').toLowerCase().includes(directorySearch.toLowerCase())
    );
    const matchesCourse = selectedCourseFilter === 'all' || (item.course || '').includes(selectedCourseFilter);
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ================= 1. OFFICIAL BANNER & HEADER ================= */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          
          {/* Official Banner Image */}
          <div className="relative h-44 sm:h-56 md:h-64 bg-slate-900 overflow-hidden">
            <img 
              src="/assets/images/alumni/alumni_banner.jpg" 
              alt="St. Philomena's College Alumni Banner"
              className="w-full h-full object-cover object-center opacity-95"
              onError={(e) => { e.target.src = "/assets/images/campus/intro_heritage_building.jpg"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071A33] via-[#071A33]/40 to-transparent" />
            
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 right-4 text-white">
              <span className="bg-[#FFD84A] text-[#071A33] font-mono text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                SPCAA Official Institutional Network
              </span>
              <h1 className="font-heading font-semibold text-2xl sm:text-3xl text-white mt-1.5 tracking-tight">
                St. Philomena's College Alumni Association
              </h1>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="p-4 sm:p-6 bg-white border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            {alumniData.association.stats.map((stat, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-0.5">
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#1C5496]">{stat.value}</span>
                <p className="text-[11px] font-semibold text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>

        {/* ================= 2. NAVIGATION TABS ================= */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 bg-slate-200/70 backdrop-blur-sm rounded-2xl border border-slate-300/60 max-w-full overflow-x-auto gap-1">
            
            <button
              onClick={() => setActiveTab('register')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#1C5496] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Alumni Registration Form</span>
            </button>

            <button
              onClick={() => setActiveTab('hall-of-fame')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 'hall-of-fame'
                  ? 'bg-[#1C5496] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Distinguished Alumni</span>
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 'network'
                  ? 'bg-[#1C5496] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Alumni Directory & Mentors ({alumniList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-[#1C5496] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>About SPCAA</span>
            </button>

          </div>
        </div>

        {/* ================= 3. TAB 1: OFFICIAL REGISTRATION FORM ================= */}
        {activeTab === 'register' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
              
              <div className="space-y-1.5 border-b border-slate-100 pb-5">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-[#1C5496]" />
                  <span className="text-xs font-semibold text-[#1C5496] uppercase tracking-widest font-mono">Official Membership Enrollment</span>
                </div>
                <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900">
                  Alumni Registration Form
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  Please complete the four sections below to register with the St. Philomena's College Alumni Association. All records are verified and preserved in the institutional alumni registry.
                </p>
              </div>

              {/* SUCCESS CONFIRMATION RECEIPT */}
              {submittedData && (
                <div className="p-6 bg-emerald-50 border-2 border-emerald-500/40 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 text-emerald-800">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                      <h3 className="font-bold text-base sm:text-lg">Thank You for Registering, {submittedData.fullName}!</h3>
                    </div>
                    <span className="bg-emerald-600 text-white font-mono text-xs font-bold px-3 py-1 rounded-full">
                      {submittedData.registrationNo}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Your alumni membership profile has been recorded in the St. Philomena's College database. A confirmation receipt and member credentials have been generated for batch <strong>{submittedData.batchYear || 'Alumnus'}</strong> ({submittedData.course}).
                  </p>
                  <div className="pt-2 flex items-center space-x-3">
                    <button
                      onClick={() => setActiveTab('network')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      View Alumni Directory →
                    </button>
                    <button
                      onClick={() => setSubmittedData(null)}
                      className="px-4 py-2 bg-white border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      Submit Another Registration
                    </button>
                  </div>
                </div>
              )}

              {/* THE OFFICIAL 4-SECTION FORM */}
              <form id="spc-alumni-form" onSubmit={handleSubmit} className="space-y-10">
                
                {/* Honeypot hidden input */}
                <input 
                  type="text" 
                  name="website" 
                  value={formData.website} 
                  onChange={e => setFormData({ ...formData, website: e.target.value })} 
                  style={{ display: 'none' }} 
                  tabIndex="-1" 
                  autoComplete="off" 
                />

                {/* --- SECTION 1: ACADEMIC HISTORY --- */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                    <span className="w-6 h-6 rounded-full bg-[#1C5496] text-white flex items-center justify-center font-mono text-xs font-bold">1</span>
                    <h3 className="font-heading font-semibold text-base sm:text-card text-slate-900">Academic History</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                    
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-semibold text-slate-700 block">Course / Programme Completed *</label>
                      <select
                        value={formData.course}
                        onChange={e => setFormData({ ...formData, course: e.target.value })}
                        required
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      >
                        {alumniData.options.courses.map((c, i) => (
                          <option key={i} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Department *</label>
                      <select
                        value={formData.department}
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                        required
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      >
                        {alumniData.options.departments.map((d, i) => (
                          <option key={i} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Year of Admission (Batch) *</label>
                      <input
                        type="text"
                        placeholder="e.g. 2016"
                        required
                        value={formData.batchYear}
                        onChange={e => setFormData({ ...formData, batchYear: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Year of Passing *</label>
                      <input
                        type="text"
                        placeholder="e.g. 2019"
                        required
                        value={formData.passingYear}
                        onChange={e => setFormData({ ...formData, passingYear: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Register Number / Roll No</label>
                      <input
                        type="text"
                        placeholder="e.g. U16CS042"
                        value={formData.registerNumber}
                        onChange={e => setFormData({ ...formData, registerNumber: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="font-semibold text-slate-700 block">Class / Result Obtained</label>
                      <select
                        value={formData.classObtained}
                        onChange={e => setFormData({ ...formData, classObtained: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      >
                        {alumniData.options.classes.map((cls, i) => (
                          <option key={i} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>

                {/* --- SECTION 2: CONTACT & PERSONAL --- */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                    <span className="w-6 h-6 rounded-full bg-[#1C5496] text-white flex items-center justify-center font-mono text-xs font-bold">2</span>
                    <h3 className="font-heading font-semibold text-base sm:text-card text-slate-900">Contact & Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                    
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-semibold text-slate-700 block">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Rajeshwari Rao"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Profile Photo (JPG / PNG)</label>
                      <div className="flex items-center space-x-3">
                        <label className="flex-1 cursor-pointer bg-slate-50 border border-dashed border-slate-300 hover:border-[#1C5496] rounded-xl p-2.5 text-center transition-colors">
                          <Upload className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                          <span className="text-[11px] text-slate-600 block">Upload Portrait</span>
                          <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </label>
                        {photoPreview && (
                          <img src={photoPreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      >
                        {alumniData.options.genders.map((g, i) => (
                          <option key={i} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="rajeshwari@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Mobile Number / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98450 XXXXX"
                        value={formData.mobile}
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">City</label>
                      <input
                        type="text"
                        placeholder="Mysuru"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">State</label>
                      <input
                        type="text"
                        placeholder="Karnataka"
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Country</label>
                      <input
                        type="text"
                        placeholder="India"
                        value={formData.country}
                        onChange={e => setFormData({ ...formData, country: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="font-semibold text-slate-700 block">Residential Address</label>
                      <textarea
                        rows="2"
                        placeholder="Street, locality, postal code"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                  </div>
                </div>

                {/* --- SECTION 3: CAREER & EMPLOYMENT --- */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                    <span className="w-6 h-6 rounded-full bg-[#1C5496] text-white flex items-center justify-center font-mono text-xs font-bold">3</span>
                    <h3 className="font-heading font-semibold text-base sm:text-card text-slate-900">Career & Professional Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                    
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Current Job Title / Designation</label>
                      <input
                        type="text"
                        placeholder="e.g. Lead Consultant / Vice President"
                        value={formData.jobTitle}
                        onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Organisation / Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Infosys / Government of Karnataka"
                        value={formData.organisation}
                        onChange={e => setFormData({ ...formData, organisation: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Industry / Sector</label>
                      <select
                        value={formData.industry}
                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      >
                        {alumniData.options.industries.map((ind, i) => (
                          <option key={i} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Work Location (City & Country)</label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru, India or London, UK"
                        value={formData.workLocation}
                        onChange={e => setFormData({ ...formData, workLocation: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-semibold text-slate-700 block">Higher Studies Pursued (Postgraduate / Ph.D / Certifications)</label>
                      <input
                        type="text"
                        placeholder="e.g. MBA from IIM Bangalore / Ph.D in Physics"
                        value={formData.higherStudies}
                        onChange={e => setFormData({ ...formData, higherStudies: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                  </div>
                </div>

                {/* --- SECTION 4: ENGAGEMENT & MENTORSHIP --- */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                    <span className="w-6 h-6 rounded-full bg-[#1C5496] text-white flex items-center justify-center font-mono text-xs font-bold">4</span>
                    <h3 className="font-heading font-semibold text-base sm:text-card text-slate-900">Alumni Engagement & Mentorship</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Willing to Mentor Current Students / Deliver Guest Lectures?</label>
                      <select
                        value={formData.willingToMentor}
                        onChange={e => setFormData({ ...formData, willingToMentor: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      >
                        <option value="Yes">Yes — I would love to mentor and guide Philominites</option>
                        <option value="No">No / Not at this moment</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">LinkedIn / Professional Profile URL</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/your-profile"
                        value={formData.linkedinUrl}
                        onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-semibold text-slate-700 block">Areas of Expertise / Key Skills</label>
                      <input
                        type="text"
                        placeholder="e.g. Artificial Intelligence, Financial Auditing, Molecular Biology, Corporate Law"
                        value={formData.expertise}
                        onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-semibold text-slate-700 block">Notable Achievements / Awards / Milestones</label>
                      <textarea
                        rows="2"
                        placeholder="Mention any honors, patents, publications, or professional accolades..."
                        value={formData.achievements}
                        onChange={e => setFormData({ ...formData, achievements: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-semibold text-slate-700 block">Remarks / Memories / Message to Alma Mater</label>
                      <textarea
                        rows="2"
                        placeholder="Share a cherished memory of St. Philomena's College..."
                        value={formData.remarks}
                        onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Your contact details are securely handled under Institutional Privacy Norms.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#1C5496] hover:bg-[#2563eb] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all inline-flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Recording Registration...</span>
                    ) : (
                      <>
                        <span>Submit Official Alumni Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>

          </div>
        )}

        {/* ================= 4. TAB 2: DISTINGUISHED ALUMNI ================= */}
        {activeTab === 'hall-of-fame' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#C9A84C]" />
                <span className="text-xs font-semibold text-[#1C5496] uppercase tracking-widest font-mono">Roll of Honor</span>
              </div>
              <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900">
                Distinguished Philominites
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                Honoring alumni who have reached extraordinary heights in healthcare, the judiciary, science, academia, and global corporate leadership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alumniData.distinguishedAlumni.map((alum, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="bg-[#1C5496]/10 text-[#1C5496] font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                        {alum.batch}
                      </span>
                      <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-wide">
                        {alum.sector}
                      </span>
                    </div>

                    <h3 className="font-heading font-semibold text-card text-slate-900">
                      {alum.name}
                    </h3>

                    <p className="text-xs font-semibold text-slate-700">
                      {alum.role}
                    </p>

                    <blockquote className="text-xs italic text-slate-600 bg-slate-50 border-l-3 border-[#C9A84C] p-3 rounded-r-lg leading-relaxed">
                      "{alum.quote}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= 5. TAB 3: ALUMNI DIRECTORY & MENTORS ================= */}
        {activeTab === 'network' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900">
                    Alumni Mentorship Network
                  </h2>
                  <p className="text-xs text-slate-500">
                    Directory of registered Philominites offering student mentorship and industry guidance.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('register')}
                  className="px-4 py-2 bg-[#1C5496] text-white text-xs font-semibold rounded-xl hover:bg-[#2563eb] transition-colors inline-flex items-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  <span>+ Join Directory</span>
                </button>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search by name, organisation, skill, city, or batch..."
                    value={directorySearch}
                    onChange={e => setDirectorySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1C5496]"
                  />
                </div>

                <select
                  value={selectedCourseFilter}
                  onChange={e => setSelectedCourseFilter(e.target.value)}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
                >
                  <option value="all">All Programmes</option>
                  <option value="BCA">BCA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="B.Com">B.Com</option>
                  <option value="BA">BA</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                </select>
              </div>

            </div>

            {/* Grid of Alumni Directory Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDirectory.map((alum, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      {alum.photo ? (
                        <img src={alum.photo} alt={alum.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-[#1C5496] shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#1C5496] flex items-center justify-center text-[#1C5496] font-bold text-sm shrink-0">
                          {alum.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                      )}
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-heading font-semibold text-sm sm:text-base text-slate-900 truncate">
                            {alum.fullName}
                          </h4>
                          {alum.willingToMentor === 'Yes' && (
                            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0">
                              Mentor
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#1C5496] font-semibold truncate">
                          {alum.jobTitle || 'Alumnus'} {alum.organisation ? `at ${alum.organisation}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Course:</span>
                        <span className="font-semibold text-slate-800 text-right truncate max-w-[180px]">{alum.course}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Batch:</span>
                        <span className="font-mono font-bold text-slate-700">{alum.batchYear ? `Batch of ${alum.batchYear}` : 'Alumnus'}</span>
                      </div>
                      {alum.workLocation && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Location:</span>
                          <span className="text-slate-700">{alum.workLocation}</span>
                        </div>
                      )}
                    </div>

                    {alum.expertise && (
                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">Expertise:</span>
                        <p className="line-clamp-2">{alum.expertise}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[10px] text-slate-400">{alum.registrationNo}</span>
                    {alum.linkedinUrl && (
                      <a 
                        href={alum.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#0A66C2] hover:underline font-semibold inline-flex items-center space-x-1"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </a>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= 6. TAB 4: ABOUT SPCAA & DOCUMENTS ================= */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#1C5496] uppercase tracking-widest font-mono">Institutional Legacy</span>
                <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900">
                  About St. Philomena's College Alumni Association
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                  {alumniData.association.description}
                </p>
              </div>

              {/* Objectives Grid */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="font-heading font-semibold text-base sm:text-card text-slate-900">Key Objectives & Missions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {alumniData.association.objectives.map((obj, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-[#1C5496] shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-700 leading-relaxed">{obj}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downloads & Contact */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <div className="space-y-1">
                  <h4 className="font-heading font-semibold text-sm sm:text-base text-slate-900">Download Official Association Documents</h4>
                  <p className="text-xs text-slate-600">Access the SPCAA constitution, chapter bylaws, and membership guidelines.</p>
                </div>

                <a
                  href="/assets/images/alumni/alumni_banner.jpg"
                  download="spcaa-constitution.pdf"
                  className="px-5 py-2.5 bg-[#1C5496] hover:bg-[#2563eb] text-white text-xs font-semibold rounded-xl transition-all shadow-sm inline-flex items-center space-x-2 shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Constitution & Bylaws PDF</span>
                </a>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
