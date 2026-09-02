import React, { useState, useEffect, useRef } from 'react';
import { 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  CreditCard, 
  HelpCircle, 
  Phone, 
  Mail, 
  Download, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Search, 
  Calendar, 
  Clock, 
  Award, 
  Printer, 
  Check, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import collegeInfo from '../data/college_info.json';
import { ASSETS } from '../data/assets';
import { animatePageIn } from '../animations/pageTransitions';

export default function AdmissionsPage() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('apply'); // 'apply', 'status', 'eligibility', 'dates', 'prospectus'

  // Application Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    level: 'UG',
    course: 'B.Sc (Computer Science, Mathematics, Electronics)',
    secondLanguage: 'Kannada',
    fullName: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    aadhaarNumber: '',
    fatherName: '',
    motherName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Mysuru',
    state: 'Karnataka',
    pincode: '',
    category: 'General',
    previousInstitution: '',
    qualifyingBoard: 'Karnataka Pre-University Board (PUC)',
    passingYear: '2026',
    regNumber: '',
    marksObtained: '',
    maxMarks: '600',
    documents: {
      photo: null,
      marksCard10th: null,
      marksCard12th: null,
      tc: null
    }
  });

  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [statusQuery, setStatusQuery] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    animatePageIn(containerRef);
  }, []);

  const coursesUG = [
    "B.Sc (Computer Science, Mathematics, Electronics)",
    "B.Sc (Biotechnology, Chemistry, Botany)",
    "B.Sc (Physics, Chemistry, Mathematics)",
    "B.Sc (Microbiology, Biochemistry, Chemistry)",
    "BCA (Bachelor of Computer Applications)",
    "B.Com (Regular / Professional Accounting)",
    "BBA (Bachelor of Business Administration)",
    "BBA (Tourism & Hospitality Management - BTHM)",
    "BA (Journalism, Psychology, English Literature)",
    "BA (History, Economics, Political Science)",
    "BSW (Bachelor of Social Work)",
    "B.Voc (Health Care Technology)",
    "B.Voc (Digital Media & Animation)"
  ];

  const coursesPG = [
    "M.Sc Computer Science",
    "M.Sc Physics",
    "M.Sc Chemistry (Organic / General)",
    "M.Sc Mathematics",
    "M.Com (Master of Commerce)",
    "MA English Literature",
    "MA Journalism & Mass Communication",
    "MSW (Master of Social Work)",
    "MA Economics"
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFileChange = (docKey, fileName) => {
    setFormData((prev) => ({
      ...prev,
      documents: { ...prev.documents, [docKey]: fileName }
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.course) errors.course = "Please select a program.";
    } else if (step === 2) {
      if (!formData.fullName.trim()) errors.fullName = "Full name is required.";
      if (!formData.email.trim()) errors.email = "Email is required.";
      if (!formData.phone.trim()) errors.phone = "Mobile number is required.";
      if (!formData.dob) errors.dob = "Date of birth is required.";
    } else if (step === 3) {
      if (!formData.previousInstitution.trim()) errors.previousInstitution = "Previous institution is required.";
      if (!formData.marksObtained) errors.marksObtained = "Marks obtained is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    const randomId = `SPC-2026-${formData.level}-${Math.floor(10000 + Math.random() * 90000)}`;
    const submission = {
      ...formData,
      appId: randomId,
      submittedAt: new Date().toLocaleString(),
      status: "Submitted & Document Verification Pending",
      percentage: formData.marksObtained && formData.maxMarks 
        ? ((Number(formData.marksObtained) / Number(formData.maxMarks)) * 100).toFixed(2) + '%'
        : '84.50%'
    };
    setSubmittedApplication(submission);
  };

  const handleTrackStatus = (e) => {
    e.preventDefault();
    if (!statusQuery.trim()) return;
    
    // Simulate lookup
    if (submittedApplication && (submittedApplication.appId.toLowerCase() === statusQuery.trim().toLowerCase() || submittedApplication.phone === statusQuery.trim())) {
      setStatusResult(submittedApplication);
    } else {
      setStatusResult({
        appId: statusQuery.toUpperCase(),
        fullName: "Registered Philomenite Applicant",
        course: "B.Sc (Computer Science, Mathematics, Electronics)",
        level: "UG",
        submittedAt: "24/04/2026, 11:30 AM",
        status: "Application Verified · Merit List Seat Allotted",
        percentage: "87.60%"
      });
    }
  };

  return (
    <div ref={containerRef} className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 space-y-8 text-[#071A33]">
      
      {/* HERO BANNER */}
      <div className="bg-[#071A33] text-white rounded-2xl p-6 sm:p-10 border-l-8 border-[#FFC928] shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FFD84A]" />
            <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest">
              Admissions Portal · Academic Year 2026–2027
            </span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Apply Online for UG & PG Admissions
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Applications are invited from eligible candidates across India and overseas for Undergraduate (B.Sc, BCA, B.Com, BBA, BA, BSW, B.Voc) and Postgraduate (M.Sc, M.Com, MA, MSW) degree programs at St. Philomena's College (Autonomous), Mysuru.
          </p>
        </div>

        <div className="shrink-0 relative z-10">
          <a
            href="https://student.stphiloserp.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-xl inline-flex items-center space-x-2 whitespace-nowrap"
          >
            <span>Launch Official ERP Portal</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>

      {/* HORIZONTAL INTERACTIVE NAVIGATION TABS */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-1.5 shadow-md">
        <div className="flex overflow-x-auto gap-1.5 no-scrollbar py-0.5">
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'apply' ? 'bg-[#1C5496] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-[#1C5496]'
            }`}
          >
            <UserCheck className={`w-3.5 h-3.5 ${activeTab === 'apply' ? 'text-[#FFD84A]' : 'text-slate-400'}`} />
            <span>Online Application Form</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'status' ? 'bg-[#1C5496] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-[#1C5496]'
            }`}
          >
            <Search className={`w-3.5 h-3.5 ${activeTab === 'status' ? 'text-[#FFD84A]' : 'text-slate-400'}`} />
            <span>Check Application Status</span>
          </button>

          <button
            onClick={() => setActiveTab('eligibility')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'eligibility' ? 'bg-[#1C5496] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-[#1C5496]'
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${activeTab === 'eligibility' ? 'text-[#FFD84A]' : 'text-slate-400'}`} />
            <span>Courses & Eligibility Criteria</span>
          </button>

          <button
            onClick={() => setActiveTab('dates')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'dates' ? 'bg-[#1C5496] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-[#1C5496]'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${activeTab === 'dates' ? 'text-[#FFD84A]' : 'text-slate-400'}`} />
            <span>Important Admission Dates</span>
          </button>

          <button
            onClick={() => setActiveTab('prospectus')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'prospectus' ? 'bg-[#1C5496] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-[#1C5496]'
            }`}
          >
            <Download className={`w-3.5 h-3.5 ${activeTab === 'prospectus' ? 'text-[#FFD84A]' : 'text-slate-400'}`} />
            <span>Prospectus & Fee PDFs</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC CONTENT PANELS */}
      <div className="transition-all duration-300">

        {/* 1. INTERACTIVE ONLINE APPLICATION FORM */}
        {activeTab === 'apply' && (
          <div className="space-y-8 animate-fadeIn">
            
            {!submittedApplication ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                
                {/* Form Progress Stepper Header */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-6">
                  <div className="flex justify-between items-center max-w-2xl mx-auto">
                    {[
                      { step: 1, label: '1. Program' },
                      { step: 2, label: '2. Personal' },
                      { step: 3, label: '3. Academic' },
                      { step: 4, label: '4. Review & Submit' }
                    ].map((s) => (
                      <div key={s.step} className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          currentStep === s.step 
                            ? 'bg-[#1C5496] text-white shadow-xs' 
                            : currentStep > s.step 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
                        </div>
                        <span className={`text-xs font-bold hidden sm:inline ${currentStep === s.step ? 'text-[#1C5496]' : 'text-slate-500'}`}>
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmitApplication} className="p-6 sm:p-10 space-y-6">
                  
                  {/* STEP 1: PROGRAMME SELECTION */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="font-serif font-bold text-xl text-slate-900">Step 1: Select Level & Degree Program</h3>
                        <p className="text-xs text-slate-500">Choose your desired level of study and degree discipline.</p>
                      </div>

                      {/* Level Radios */}
                      <div className="grid grid-cols-2 gap-4 max-w-md">
                        <label className={`p-4 rounded-xl border cursor-pointer flex items-center space-x-3 transition-all ${
                          formData.level === 'UG' ? 'border-[#1C5496] bg-blue-50/50 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                        }`}>
                          <input
                            type="radio"
                            name="level"
                            value="UG"
                            checked={formData.level === 'UG'}
                            onChange={(e) => {
                              handleInputChange('level', e.target.value);
                              handleInputChange('course', coursesUG[0]);
                            }}
                            className="text-[#1C5496]"
                          />
                          <div>
                            <span className="font-bold text-sm text-slate-900 block">Undergraduate (UG)</span>
                            <span className="text-[11px] text-slate-500">3 or 4-Year Honors Degree</span>
                          </div>
                        </label>

                        <label className={`p-4 rounded-xl border cursor-pointer flex items-center space-x-3 transition-all ${
                          formData.level === 'PG' ? 'border-[#1C5496] bg-blue-50/50 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                        }`}>
                          <input
                            type="radio"
                            name="level"
                            value="PG"
                            checked={formData.level === 'PG'}
                            onChange={(e) => {
                              handleInputChange('level', e.target.value);
                              handleInputChange('course', coursesPG[0]);
                            }}
                            className="text-[#1C5496]"
                          />
                          <div>
                            <span className="font-bold text-sm text-slate-900 block">Postgraduate (PG)</span>
                            <span className="text-[11px] text-slate-500">2-Year Master's Degree</span>
                          </div>
                        </label>
                      </div>

                      {/* Course Selection Dropdown */}
                      <div className="space-y-1.5 max-w-xl">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Degree Course / Specialization Combination *
                        </label>
                        <select
                          value={formData.course}
                          onChange={(e) => handleInputChange('course', e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1C5496] font-medium"
                        >
                          {(formData.level === 'UG' ? coursesUG : coursesPG).map((c, idx) => (
                            <option key={idx} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Second Language Choice */}
                      <div className="space-y-1.5 max-w-sm">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Part-I Language Option *
                        </label>
                        <select
                          value={formData.secondLanguage}
                          onChange={(e) => handleInputChange('secondLanguage', e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1C5496] font-medium"
                        >
                          <option value="Kannada">Kannada</option>
                          <option value="Hindi">Hindi</option>
                          <option value="French">French</option>
                          <option value="Malayalam">Malayalam</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Arabic">Arabic</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PERSONAL DETAILS */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="font-serif font-bold text-xl text-slate-900">Step 2: Candidate & Contact Details</h3>
                        <p className="text-xs text-slate-500">Provide official identity and communication information.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-800 block">Candidate Full Name (as in 10th Card) *</label>
                          <input
                            type="text"
                            placeholder="e.g. John Emmanuel D'Souza"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1C5496] ${
                              formErrors.fullName ? 'border-red-400' : 'border-slate-200'
                            }`}
                          />
                          {formErrors.fullName && <p className="text-[11px] text-red-600">{formErrors.fullName}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">Date of Birth *</label>
                          <input
                            type="date"
                            value={formData.dob}
                            onChange={(e) => handleInputChange('dob', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1C5496]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">Gender</label>
                          <select
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">Blood Group</label>
                          <select
                            value={formData.bloodGroup}
                            onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">Social Category</label>
                          <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                          >
                            <option value="General">General / Open Merit</option>
                            <option value="Christian Minority">Christian Minority</option>
                            <option value="OBC (Cat-1/2A/2B/3A/3B)">OBC (Cat-1, 2A, 2B, 3A, 3B)</option>
                            <option value="SC">Scheduled Caste (SC)</option>
                            <option value="ST">Scheduled Tribe (ST)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">Email Address *</label>
                          <input
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">Mobile Phone Number *</label>
                          <input
                            type="tel"
                            placeholder="+91 9876543210"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">Father's / Guardian's Name</label>
                          <input
                            type="text"
                            placeholder="Father's Name"
                            value={formData.fatherName}
                            onChange={(e) => handleInputChange('fatherName', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-800 block">Residential Address</label>
                        <input
                          type="text"
                          placeholder="House / Street / Area"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: ACADEMIC QUALIFICATIONS & MARKS */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="font-serif font-bold text-xl text-slate-900">Step 3: Qualifying Examination Record</h3>
                        <p className="text-xs text-slate-500">Enter marks and passing institution information.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-800 block">Previous School / College Attended *</label>
                          <input
                            type="text"
                            placeholder="e.g. St. Joseph's PU College, Mysuru"
                            value={formData.previousInstitution}
                            onChange={(e) => handleInputChange('previousInstitution', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">Examination Board</label>
                          <select
                            value={formData.qualifyingBoard}
                            onChange={(e) => handleInputChange('qualifyingBoard', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                          >
                            <option value="Karnataka Pre-University Board (PUC)">Karnataka Pre-University (PUC)</option>
                            <option value="CBSE Board">CBSE Board (Class 12)</option>
                            <option value="ISC Board">ISC Council (Class 12)</option>
                            <option value="Other State Board">Other State Board</option>
                            <option value="University Degree (for PG)">University Degree (for PG)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">Registration / Roll Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 2026PU89421"
                            value={formData.regNumber}
                            onChange={(e) => handleInputChange('regNumber', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">Total Marks Obtained *</label>
                          <input
                            type="number"
                            placeholder="e.g. 524"
                            value={formData.marksObtained}
                            onChange={(e) => handleInputChange('marksObtained', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">Maximum Marks</label>
                          <input
                            type="number"
                            placeholder="e.g. 600"
                            value={formData.maxMarks}
                            onChange={(e) => handleInputChange('maxMarks', e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Computed Percentage Pill */}
                      {formData.marksObtained && formData.maxMarks && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1C5496]">Calculated Qualifying Percentage:</span>
                          <span className="font-serif font-extrabold text-base text-[#1C5496]">
                            {((Number(formData.marksObtained) / Number(formData.maxMarks)) * 100).toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 4: REVIEW & SUBMIT */}
                  {currentStep === 4 && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="font-serif font-bold text-xl text-slate-900">Step 4: Review Application & Submit</h3>
                        <p className="text-xs text-slate-500">Verify your information before finalizing registration.</p>
                      </div>

                      {/* Summary Box */}
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-slate-500 block font-semibold">Selected Course:</span>
                            <span className="font-bold text-slate-900">{formData.course} ({formData.level})</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block font-semibold">Candidate Name:</span>
                            <span className="font-bold text-slate-900">{formData.fullName || "Not provided"}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block font-semibold">Mobile & Email:</span>
                            <span className="font-bold text-slate-900">{formData.phone} · {formData.email}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block font-semibold">Previous Institution:</span>
                            <span className="font-bold text-slate-900">{formData.previousInstitution}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block font-semibold">Marks & Percentage:</span>
                            <span className="font-bold text-[#1C5496]">{formData.marksObtained} / {formData.maxMarks}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block font-semibold">Category & Language:</span>
                            <span className="font-bold text-slate-900">{formData.category} · {formData.secondLanguage}</span>
                          </div>
                        </div>
                      </div>

                      {/* Declaration */}
                      <label className="flex items-start space-x-3 cursor-pointer p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
                        <input type="checkbox" required className="mt-0.5 text-[#1C5496]" defaultChecked />
                        <span className="text-xs text-slate-700 leading-relaxed">
                          I declare that the details provided are true and accurate to the best of my knowledge. I understand that admission is subject to University of Mysore and St. Philomena's College autonomous regulations and original document verification.
                        </span>
                      </label>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="btn-gold w-full py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Submit Online Application & Generate Slip</span>
                      </button>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        <span>Previous Step</span>
                      </button>
                    ) : <div />}

                    {currentStep < 4 && (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="btn-primary-blue px-6 py-2.5 rounded-lg text-xs font-bold flex items-center shadow-xs"
                      >
                        <span>Continue to Step {currentStep + 1}</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </button>
                    )}
                  </div>

                </form>

              </div>
            ) : (

              /* APPLICATION SUCCESS ACKNOWLEDGMENT SLIP */
              <div className="bg-white rounded-2xl border-2 border-[#D4AF37] p-8 sm:p-12 shadow-xl space-y-6 text-center animate-fadeIn max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
                    Registration Successful · AY 2026–27
                  </span>
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900">
                    Application Submitted Successfully!
                  </h2>
                  <p className="text-xs text-slate-600">
                    Your application has been received and registered on the college autonomous admission server.
                  </p>
                </div>

                {/* Acknowledgment Slip Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Official Application ID</span>
                      <p className="font-mono font-extrabold text-lg text-[#1C5496]">{submittedApplication.appId}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-md text-[11px]">
                      {submittedApplication.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 font-semibold block">Candidate Name:</span>
                      <p className="font-bold text-slate-900">{submittedApplication.fullName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">Programme Applied:</span>
                      <p className="font-bold text-slate-900">{submittedApplication.course}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">Submitted On:</span>
                      <p className="font-bold text-slate-900">{submittedApplication.submittedAt}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">Qualifying Score:</span>
                      <p className="font-bold text-emerald-700">{submittedApplication.percentage}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="btn-primary-blue px-6 py-2.5 rounded-lg text-xs font-bold inline-flex items-center"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    <span>Print Acknowledgment Slip</span>
                  </button>
                  <button
                    onClick={() => {
                      setSubmittedApplication(null);
                      setCurrentStep(1);
                    }}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>

            )}

          </div>
        )}

        {/* 2. REAL-TIME APPLICATION STATUS TRACKER */}
        {activeTab === 'status' && (
          <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-center">
              <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Real-time Portal</span>
              <h2 className="font-serif font-extrabold text-2xl text-slate-900">Track Your Admission Status</h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                Enter your Application ID (e.g. <code>SPC-2026-UG-84920</code>) or registered Mobile Number to check scrutiny and merit seat allotment.
              </p>

              <form onSubmit={handleTrackStatus} className="flex gap-2 max-w-md mx-auto pt-2">
                <input
                  type="text"
                  placeholder="Enter Application ID or Mobile..."
                  value={statusQuery}
                  onChange={(e) => setStatusQuery(e.target.value)}
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1C5496]"
                />
                <button
                  type="submit"
                  className="btn-primary-blue px-6 py-3 rounded-xl text-xs font-bold shrink-0"
                >
                  Track Status
                </button>
              </form>
            </div>

            {statusResult && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Application Number</span>
                    <h3 className="font-mono font-extrabold text-lg text-[#1C5496]">{statusResult.appId}</h3>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-md text-xs">
                    {statusResult.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Applicant Name:</span>
                    <span className="font-bold text-slate-900">{statusResult.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Course Choice:</span>
                    <span className="font-bold text-slate-900">{statusResult.course}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Submission Date:</span>
                    <span className="font-bold text-slate-900">{statusResult.submittedAt}</span>
                  </div>
                </div>

                {/* Admission Progress Tracker */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="font-serif font-bold text-xs text-slate-800 uppercase tracking-wider">Admission Milestones</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center text-emerald-700 font-semibold space-x-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>1. Application Received & Registered Online</span>
                    </div>
                    <div className="flex items-center text-emerald-700 font-semibold space-x-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>2. Academic Marks Verified by Scrutiny Desk</span>
                    </div>
                    <div className="flex items-center text-[#1C5496] font-semibold space-x-2">
                      <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                      <span>3. Campus Verification & Seat Confirmation Scheduled</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. COURSES & ELIGIBILITY */}
        {activeTab === 'eligibility' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h2 className="font-serif font-extrabold text-2xl text-slate-900">Programmes & Minimum Eligibility</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Summary of degree courses offered under University of Mysore Autonomous framework.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#071A33] text-white">
                      <th className="p-4 font-bold uppercase">Degree Program</th>
                      <th className="p-4 font-bold uppercase">Duration</th>
                      <th className="p-4 font-bold uppercase">Minimum Eligibility</th>
                      <th className="p-4 font-bold uppercase">Annual Fee Approx.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-[#1C5496]">B.Sc (Physical & Life Sciences)</td>
                      <td className="p-4 text-slate-600">3 or 4 Years (Honors)</td>
                      <td className="p-4 text-slate-700">Pass in 10+2 / PUC Science with relevant subjects (Min 45%)</td>
                      <td className="p-4 font-semibold text-slate-900">₹32,000 – ₹42,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-[#1C5496]">BCA (Computer Applications)</td>
                      <td className="p-4 text-slate-600">3 or 4 Years (Honors)</td>
                      <td className="p-4 text-slate-700">Pass in 10+2 / PUC with Mathematics / Computer Science</td>
                      <td className="p-4 font-semibold text-slate-900">₹45,000 – ₹55,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-[#1C5496]">B.Com & BBA</td>
                      <td className="p-4 text-slate-600">3 or 4 Years (Honors)</td>
                      <td className="p-4 text-slate-700">Pass in 10+2 / PUC in Commerce, Arts, or Science (Min 40%)</td>
                      <td className="p-4 font-semibold text-slate-900">₹36,000 – ₹48,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-[#1C5496]">M.Sc (Physics / Chemistry / CS)</td>
                      <td className="p-4 text-slate-600">2 Years (4 Semesters)</td>
                      <td className="p-4 text-slate-700">B.Sc Degree with 50% aggregate in cognate subject</td>
                      <td className="p-4 font-semibold text-slate-900">₹50,000 – ₹65,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-[#1C5496]">M.Com & MSW</td>
                      <td className="p-4 text-slate-600">2 Years (4 Semesters)</td>
                      <td className="p-4 text-slate-700">B.Com / BBA / BSW / Any Degree with 45% aggregate</td>
                      <td className="p-4 font-semibold text-slate-900">₹42,000 – ₹52,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. IMPORTANT DATES */}
        {activeTab === 'dates' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h2 className="font-serif font-extrabold text-2xl text-slate-900">Admissions Schedule 2026–2027</h2>
              <p className="text-xs sm:text-sm text-slate-600">Key institutional milestones for the upcoming academic session.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-[#1C5496] uppercase">Stage 1</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">Online Applications Open</h4>
                <p className="font-mono text-xs text-emerald-700 font-bold">April 01, 2026</p>
                <p className="text-[11px] text-slate-500">Portal open for UG and PG registrations.</p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-[#1C5496] uppercase">Stage 2</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">First Merit List</h4>
                <p className="font-mono text-xs text-[#1C5496] font-bold">May 20, 2026</p>
                <p className="text-[11px] text-slate-500">Publication on college portal and notice boards.</p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-[#1C5496] uppercase">Stage 3</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">Document Scrutiny</h4>
                <p className="font-mono text-xs text-[#D4AF37] font-bold">May 22 – June 05, 2026</p>
                <p className="text-[11px] text-slate-500">Original certificates verification at campus desk.</p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-[#1C5496] uppercase">Stage 4</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">Orientation & Classes</h4>
                <p className="font-mono text-xs text-blue-800 font-bold">June 15, 2026</p>
                <p className="text-[11px] text-slate-500">Deeksharambh orientation and regular lectures begin.</p>
              </div>
            </div>
          </div>
        )}

        {/* 5. PROSPECTUS & DOWNLOADS */}
        {activeTab === 'prospectus' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="font-serif font-extrabold text-2xl text-slate-900">Official Prospectus & Downloads</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                Download the official admission prospectus, detailed fee structure breakdown, and academic calendar for the 2026–2027 academic session.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href={ASSETS.documents.admissions.prospectus}
                  download="st-philomena-prospectus-2026-27.pdf"
                  className="btn-primary-blue px-5 py-2.5 rounded-lg text-xs font-bold inline-flex items-center shadow-xs"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download UG/PG Prospectus PDF</span>
                </a>
                <a
                  href={ASSETS.documents.admissions.feeStructure}
                  download="admissions-fee-structure-2026-27.pdf"
                  className="px-5 py-2.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 inline-flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download Fee Structure PDF</span>
                </a>
              </div>
            </div>

            {/* Helpdesk Contacts */}
            <div className="bg-[#071A33] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-[#FFD84A]">Need Assistance with Your Application?</h3>
                <p className="text-xs text-slate-300">Our Admissions Office is available Monday through Saturday, 9:00 AM – 5:00 PM.</p>
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <a href={`tel:${collegeInfo.phone}`} className="flex items-center text-slate-200 hover:text-[#FFD84A]">
                  <Phone className="w-4 h-4 mr-1.5 text-[#FFD84A]" />
                  <span>{collegeInfo.phone}</span>
                </a>
                <a href={`mailto:${collegeInfo.email}`} className="flex items-center text-slate-200 hover:text-[#FFD84A]">
                  <Mail className="w-4 h-4 mr-1.5 text-[#FFD84A]" />
                  <span>{collegeInfo.email}</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
