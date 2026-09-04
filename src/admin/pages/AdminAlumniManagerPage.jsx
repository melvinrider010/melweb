import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  X, 
  GraduationCap, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Download, 
  Check, 
  ExternalLink,
  Linkedin,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';
import alumniData from '../../data/alumniData.json';

export default function AdminAlumniManagerPage() {
  const alumniList = useCms(() => cmsStore.getAlumniSubmissions());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedMentorFilter, setSelectedMentorFilter] = useState('all');

  // Detail Modal State
  const [selectedAlum, setSelectedAlum] = useState(null);

  // Filter logic
  const filteredAlumni = alumniList.filter(a => {
    const matchesSearch = (
      (a.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.registrationNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.organisation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.batchYear || '').includes(searchTerm) ||
      (a.city || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesCourse = selectedCourseFilter === 'all' || (a.course || '').includes(selectedCourseFilter);
    const matchesStatus = selectedStatusFilter === 'all' || (a.status || 'approved') === selectedStatusFilter;
    const matchesMentor = selectedMentorFilter === 'all' || 
      (selectedMentorFilter === 'yes' && a.willingToMentor === 'Yes') ||
      (selectedMentorFilter === 'no' && a.willingToMentor !== 'Yes');

    return matchesSearch && matchesCourse && matchesStatus && matchesMentor;
  });

  const handleStatusChange = async (id, newStatus) => {
    await cmsStore.updateAlumniStatus(id, newStatus);
    if (selectedAlum && selectedAlum.id === id) {
      setSelectedAlum(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete alumni record for "${name}"?`)) {
      await cmsStore.deleteAlumni(id);
      if (selectedAlum && selectedAlum.id === id) {
        setSelectedAlum(null);
      }
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Registration No', 'Full Name', 'Email', 'Mobile', 'Course', 'Department', 'Batch Year', 'Passing Year', 'Job Title', 'Organisation', 'Industry', 'City', 'Country', 'Willing to Mentor', 'LinkedIn', 'Status'];
    const rows = filteredAlumni.map(a => [
      `"${a.registrationNo || ''}"`,
      `"${a.fullName || ''}"`,
      `"${a.email || ''}"`,
      `"${a.mobile || ''}"`,
      `"${a.course || ''}"`,
      `"${a.department || ''}"`,
      `"${a.batchYear || ''}"`,
      `"${a.passingYear || ''}"`,
      `"${a.jobTitle || ''}"`,
      `"${a.organisation || ''}"`,
      `"${a.industry || ''}"`,
      `"${a.city || ''}"`,
      `"${a.country || ''}"`,
      `"${a.willingToMentor || ''}"`,
      `"${a.linkedinUrl || ''}"`,
      `"${a.status || 'approved'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stphilos-alumni-registry-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08121E] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C5496] text-[#FFD84A] font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module 22.8
            </span>
            <span className="text-slate-400 text-xs">Alumni Association Registry & CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            Alumni Registrations Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Review online alumni submissions from the website form, manage memberships, verified directory listings, and student mentorship assignments.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg inline-flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Alumni CSV</span>
        </button>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Registered</span>
          <p className="text-2xl font-bold text-white">{alumniList.length}</p>
        </div>
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-emerald-400 uppercase">Verified Live</span>
          <p className="text-2xl font-bold text-emerald-400">
            {alumniList.filter(a => (a.status || 'approved') === 'approved').length}
          </p>
        </div>
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-[#FFD84A] uppercase">Active Mentors</span>
          <p className="text-2xl font-bold text-[#FFD84A]">
            {alumniList.filter(a => a.willingToMentor === 'Yes').length}
          </p>
        </div>
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-blue-400 uppercase">Distinct Batches</span>
          <p className="text-2xl font-bold text-blue-400">
            {new Set(alumniList.map(a => a.batchYear).filter(Boolean)).size || 1}
          </p>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH TOOLBAR */}
      <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, reg no, company, batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1C5496]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          
          <div className="flex items-center space-x-2">
            <span>Course:</span>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
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

          <div className="flex items-center space-x-2">
            <span>Mentorship:</span>
            <select
              value={selectedMentorFilter}
              onChange={(e) => setSelectedMentorFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="yes">Willing to Mentor (Yes)</option>
              <option value="no">Not Mentoring (No)</option>
            </select>
          </div>

        </div>

      </div>

      {/* 4. ALUMNI TABLE */}
      <div className="bg-[#0D1B2A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08121E] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Reg No / Member</th>
                <th className="py-3.5 px-4">Degree & Batch</th>
                <th className="py-3.5 px-4">Current Employment</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-center">Mentor</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredAlumni.map((alum, idx) => {
                const isApproved = (alum.status || 'approved') === 'approved';

                return (
                  <tr key={alum.id || idx} className="hover:bg-slate-800/40 transition-colors group">
                    
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-amber-400 font-bold">{alum.registrationNo}</div>
                      <div className="font-bold text-white group-hover:text-[#FFD84A] transition-colors">{alum.fullName}</div>
                      <div className="text-[11px] text-slate-400">{alum.email}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-white font-semibold truncate max-w-[200px]">{alum.course}</div>
                      <div className="text-[11px] font-mono text-slate-400">Batch {alum.batchYear || 'N/A'} (Class {alum.passingYear || ''})</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-200">{alum.jobTitle || 'Professional'}</div>
                      <div className="text-[11px] text-[#FFD84A] font-semibold">{alum.organisation || 'Independent'}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      <div>{alum.city || 'Mysuru'}, {alum.country || 'India'}</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        alum.willingToMentor === 'Yes'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {alum.willingToMentor === 'Yes' ? 'MENTOR' : 'NO'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleStatusChange(alum.id, isApproved ? 'pending' : 'approved')}
                        className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold cursor-pointer transition-colors ${
                          isApproved
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                        }`}
                        title="Click to toggle status"
                      >
                        {isApproved ? 'APPROVED' : 'PENDING'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedAlum(alum)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#1C5496] text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="View Full Registration Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(alum.id, alum.fullName)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: FULL REGISTRATION APPLICATION ================= */}
      {selectedAlum && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">
                  SPCAA Membership Record · {selectedAlum.registrationNo}
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  {selectedAlum.fullName}
                </h3>
              </div>

              <button
                onClick={() => setSelectedAlum(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              
              {/* Profile Card */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center space-x-4">
                {selectedAlum.photo ? (
                  <img src={selectedAlum.photo} alt={selectedAlum.fullName} className="w-16 h-16 rounded-2xl object-cover border border-[#1C5496]" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#1C5496]/20 border border-[#1C5496] flex items-center justify-center text-[#FFD84A] font-bold text-xl">
                    {selectedAlum.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                )}
                <div className="space-y-1 min-w-0 flex-1">
                  <h4 className="font-serif font-bold text-base text-white">{selectedAlum.fullName}</h4>
                  <p className="text-slate-400">{selectedAlum.jobTitle} at <strong className="text-white">{selectedAlum.organisation}</strong></p>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-0.5">
                    <span className="flex items-center space-x-1"><Mail className="w-3 h-3" /><span>{selectedAlum.email}</span></span>
                    {selectedAlum.mobile && <span className="flex items-center space-x-1"><Phone className="w-3 h-3" /><span>{selectedAlum.mobile}</span></span>}
                  </div>
                </div>
              </div>

              {/* 1. Academic History */}
              <div className="space-y-2 p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <span className="font-mono text-[10px] text-blue-400 uppercase font-bold block">1. Academic History</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div><strong className="text-slate-400">Course:</strong> {selectedAlum.course}</div>
                  <div><strong className="text-slate-400">Department:</strong> {selectedAlum.department}</div>
                  <div><strong className="text-slate-400">Admission Batch:</strong> {selectedAlum.batchYear}</div>
                  <div><strong className="text-slate-400">Year of Passing:</strong> {selectedAlum.passingYear}</div>
                  <div><strong className="text-slate-400">Register No:</strong> {selectedAlum.registerNumber || 'N/A'}</div>
                  <div><strong className="text-slate-400">Result:</strong> {selectedAlum.classObtained}</div>
                </div>
              </div>

              {/* 2. Employment & Location */}
              <div className="space-y-2 p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <span className="font-mono text-[10px] text-purple-400 uppercase font-bold block">2. Employment & Higher Studies</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div><strong className="text-slate-400">Industry:</strong> {selectedAlum.industry}</div>
                  <div><strong className="text-slate-400">Work Location:</strong> {selectedAlum.workLocation || 'N/A'}</div>
                  <div className="col-span-2"><strong className="text-slate-400">Higher Studies:</strong> {selectedAlum.higherStudies || 'N/A'}</div>
                  <div className="col-span-2"><strong className="text-slate-400">Address:</strong> {selectedAlum.address ? `${selectedAlum.address}, ${selectedAlum.city}, ${selectedAlum.state}, ${selectedAlum.country}` : 'N/A'}</div>
                </div>
              </div>

              {/* 3. Mentorship & Engagement */}
              <div className="space-y-2 p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold block">3. Mentorship & Engagement</span>
                <div className="space-y-2 text-slate-300">
                  <div><strong className="text-slate-400">Willing to Mentor:</strong> {selectedAlum.willingToMentor}</div>
                  <div><strong className="text-slate-400">Areas of Expertise:</strong> {selectedAlum.expertise || 'General'}</div>
                  {selectedAlum.linkedinUrl && (
                    <div>
                      <strong className="text-slate-400">LinkedIn:</strong>{' '}
                      <a href={selectedAlum.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {selectedAlum.linkedinUrl}
                      </a>
                    </div>
                  )}
                  {selectedAlum.achievements && <div><strong className="text-slate-400">Achievements:</strong> {selectedAlum.achievements}</div>}
                  {selectedAlum.remarks && <div><strong className="text-slate-400">Alma Mater Message:</strong> "{selectedAlum.remarks}"</div>}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">Submitted: {selectedAlum.submissionDate || 'N/A'}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStatusChange(selectedAlum.id, selectedAlum.status === 'approved' ? 'pending' : 'approved')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedAlum.status === 'approved'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {selectedAlum.status === 'approved' ? 'Mark Pending' : 'Approve Membership'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
