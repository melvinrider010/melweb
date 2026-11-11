import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileText, 
  Download, 
  ExternalLink,
  Users,
  Building2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  CollegeBreadcrumb,
  CollegePageHeader,
  CollegeSection,
  CollegeCard,
  CollegeFacultyCard,
  CollegeDepartmentCard,
  CollegeDocumentCard,
  CollegeDataTable,
  CollegeTabs
} from '../components/college';

export default function CollegeComponentShowcase() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sampleTabVariant, setSampleTabVariant] = useState('pills');

  // Sample data simulating real STPHLOS records
  const sampleFacultyComplete = {
    id: 'dr-john-dsouza',
    slug: 'dr-john-dsouza',
    name: 'Dr. John D\'Souza',
    designation: 'Professor & Head of Department',
    qualification: 'Ph.D., M.Sc., NET',
    department: 'Computer Science',
    deptName: 'Computer Science',
    email: 'john.dsouza@stphilos.ac.in',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    specialization: 'Artificial Intelligence & Natural Language Processing',
    experience: '18+ Years'
  };

  const sampleFacultyMissingData = {
    id: 'prof-mary-fernandes',
    slug: 'prof-mary-fernandes',
    name: 'Prof. Mary Fernandes',
    designation: 'Assistant Professor',
    qualification: 'M.Sc., KSET',
    department: 'Chemistry',
    // intentionally missing: photo_url, email, specialization, experience
  };

  const sampleFacultyLongName = {
    id: 'dr-venkatanarasimha-krishnamurthy',
    name: 'Dr. Venkatanarasimha R. Krishnamurthy Sharma',
    designation: 'Senior Associate Professor of Computational Biology & Bioinformatics',
    qualification: 'Ph.D. (IISc), PostDoc (Max Planck), M.Tech, B.Tech',
    department: 'Biotechnology & Bioinformatics',
    email: 'v.krishnamurthy@stphilos.ac.in',
    specialization: 'Structural Bioinformatics, Macromolecular Crystallography, Genomics',
    experience: '22 Years'
  };

  const sampleDept = {
    id: 'dept-computer-science',
    slug: 'dept-computer-science',
    name: 'Department of Computer Science',
    stream: 'Science & Technology',
    description: 'Empowering digital leaders through cutting-edge undergraduate and postgraduate computer applications and software engineering curricula.',
    facultyCount: 14,
    degrees: ['BCA', 'B.Sc. CS', 'MCA', 'M.Sc. CS'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop'
  };

  const sampleDocPdf = {
    id: 'doc-1',
    title: 'NEP 2020 Autonomous Curriculum Regulations & Course Structure (BCA & MCA)',
    file_type: 'PDF',
    size: '2.4 MB',
    year: '2024-25',
    category: 'Syllabus',
    description: 'Authoritative scheme of evaluation, credit distribution, and semester examination guidelines approved by the Academic Council.',
    url: '/assets/documents/sample.pdf'
  };

  const sampleDocExcel = {
    id: 'doc-2',
    title: 'Departmental Faculty Research Output & Scopus Indexed Publication Registry',
    file_type: 'XLSX',
    size: '840 KB',
    year: '2023-24',
    category: 'Research',
    description: 'Comprehensive annual catalog of peer-reviewed journal papers and patent disclosures.',
    url: '/assets/documents/research-output.xlsx'
  };

  // Sample Table Columns & Data
  const tableColumns = [
    { header: 'Degree / Examination', accessor: 'degree', width: '25%' },
    { header: 'Institution / Board', accessor: 'institution', width: '35%' },
    { header: 'Year of Passing', accessor: 'year', width: '15%' },
    { 
      header: 'Specialization / Honors', 
      cell: (row) => (
        <span className="font-semibold text-[#1C5496]">
          {row.honors}
        </span>
      ),
      width: '25%'
    }
  ];

  const tableData = [
    { id: 1, degree: 'Ph.D. in Computer Science', institution: 'University of Mysore', year: '2016', honors: 'Specialization in Machine Learning' },
    { id: 2, degree: 'Master of Science (M.Sc.)', institution: 'St. Philomena\'s College (Autonomous)', year: '2009', honors: 'First Class with Distinction (Rank 1)' },
    { id: 3, degree: 'Bachelor of Science (B.Sc.)', institution: 'University of Mysore', year: '2007', honors: 'Physics, Mathematics, Computer Science' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-8 px-4 sm:px-6 lg:px-8 space-y-10 max-w-7xl mx-auto">
      {/* 1. VERIFICATION PAGE BANNER */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-amber-900 block">
            STPHLOS Isolated Component Test Arena (Phase 2 Verification)
          </span>
          <p className="text-xs text-amber-800 font-sans mt-0.5">
            This route verifies all 9 reusable College components against responsive viewports, missing data fallbacks, and accessibility patterns.
          </p>
        </div>
        <span className="px-3 py-1 rounded-lg bg-amber-200/80 text-amber-900 font-mono text-xs font-bold">
          Zero Impact on Production Routes
        </span>
      </div>

      {/* 2. COMPONENT 2: CollegePageHeader (also tests CollegeBreadcrumb) */}
      <section className="space-y-3">
        <h2 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
          1. CollegePageHeader & CollegeBreadcrumb
        </h2>
        <CollegePageHeader
          eyebrow="Academic Department Showcase"
          badge="Autonomous Curriculum"
          title="Department of Computer Science & Applications"
          subtitle="Fostering academic excellence, empirical software engineering research, and ethical technology leadership affiliated with the University of Mysore."
          icon={Building2}
          breadcrumb={[
            { label: 'Academics', href: '/academics' },
            { label: 'Departments', href: '/departments' },
            { label: 'Computer Science' }
          ]}
          actions={
            <div className="flex items-center gap-2">
              <button className="btn-primary-blue px-4 py-2 rounded-xl text-xs font-bold shadow-xs">
                Apply for Admission
              </button>
              <button className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                Contact HOD
              </button>
            </div>
          }
          stats={[
            { label: 'Active Faculty', value: '14 Scholars', icon: Users },
            { label: 'Degree Programs', value: '4 UG / PG', icon: GraduationCap },
            { label: 'Research Papers', value: '86 Scopus', icon: BookOpen },
            { label: 'NAAC Accredited', value: 'Grade A+', icon: Award }
          ]}
        />
      </section>

      {/* 3. COMPONENT 9: CollegeTabs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
            2. CollegeTabs (Testing Variant: {sampleTabVariant})
          </h2>
          <div className="flex gap-1.5 text-xs font-mono">
            {['pills', 'line', 'segmented'].map((v) => (
              <button
                key={v}
                onClick={() => setSampleTabVariant(v)}
                className={`px-2.5 py-1 rounded capitalize ${
                  sampleTabVariant === v ? 'bg-[#0B1F4E] text-white font-bold' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <CollegeTabs
          variant={sampleTabVariant}
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'overview', label: 'Department Overview', icon: BookOpen },
            { id: 'faculty', label: 'Faculty Directory', icon: Users, badge: 14 },
            { id: 'programmes', label: 'Academic Continuum', icon: GraduationCap, badge: 4 },
            { id: 'curriculum', label: 'Syllabus & Documents', icon: FileText, badge: 8 }
          ]}
        />
      </section>

      {/* 4. COMPONENT 3 & 4: CollegeSection & CollegeCard */}
      <section className="space-y-3">
        <h2 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
          3. CollegeSection & Generic CollegeCard
        </h2>
        <CollegeSection
          title="Curricular Infrastructure & Laboratories"
          eyebrow="Facilities & Centers"
          description="Standardized section container replacing inline shell repetition across department templates."
          icon={Layers}
          action={
            <button className="text-xs text-[#1C5496] font-bold hover:underline">
              View All Facilities &rarr;
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <CollegeCard
              variant="hover"
              icon={Sparkles}
              subtitle="Center of Excellence"
              title="Advanced Computing & AI Laboratory"
              description="Equipped with 60 high-performance workstations, dedicated GPU nodes, and Linux development environments."
              footer={<span className="text-[#1C5496] font-bold">Location: Block C, Room 204</span>}
            />
            <CollegeCard
              variant="hover"
              icon={BookOpen}
              subtitle="Departmental Wing"
              title="Department Reference Library"
              description="Over 1,200 specialized monographs, ACM/IEEE digital subscriptions, and research dissertations."
              footer={<span className="text-slate-500 font-mono text-[11px]">Accessible to PG & Research Scholars</span>}
            />
            <CollegeCard
              variant="hover"
              icon={Users}
              subtitle="Incubation"
              title="Software Innovation Sandbox"
              description="Collaborative space for hackathons, open-source projects, and industry capstone engagements."
              footer={<span className="text-emerald-700 font-semibold">Active Industry Mentorship</span>}
            />
          </div>
        </CollegeSection>
      </section>

      {/* 5. COMPONENT 5: CollegeFacultyCard (Testing 3 Layouts & Data Fallbacks) */}
      <section className="space-y-3">
        <h2 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
          4. CollegeFacultyCard (Standardizing All 3 Current Variants)
        </h2>

        {/* 5A. Rich Grid Layout (Faculty Directory) */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 font-sans">
            A. Standard Grid Layout (Complete vs. Missing Image Fallback vs. Long Name)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <CollegeFacultyCard faculty={sampleFacultyComplete} layout="grid" />
            <CollegeFacultyCard faculty={sampleFacultyMissingData} layout="grid" />
            <CollegeFacultyCard faculty={sampleFacultyLongName} layout="grid" />
          </div>
        </div>

        {/* 5B. Compact Circular Layout (Department Detail Faculty Grid) */}
        <div className="space-y-2 pt-4">
          <h3 className="text-xs font-bold text-slate-700 font-sans">
            B. Compact Circular Layout (Department Detail Hub — With Working Profile Links)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <CollegeFacultyCard faculty={sampleFacultyComplete} layout="compact" />
            <CollegeFacultyCard faculty={sampleFacultyMissingData} layout="compact" />
            <CollegeFacultyCard faculty={sampleFacultyLongName} layout="compact" />
          </div>
        </div>

        {/* 5C. Horizontal Row Layout (Course Continuum & Academic Advisors) */}
        <div className="space-y-2 pt-4">
          <h3 className="text-xs font-bold text-slate-700 font-sans">
            C. Horizontal Row Layout (Programmes & Faculty Continuum)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CollegeFacultyCard faculty={sampleFacultyComplete} layout="horizontal" />
            <CollegeFacultyCard faculty={sampleFacultyMissingData} layout="horizontal" />
          </div>
        </div>
      </section>

      {/* 6. COMPONENT 6: CollegeDepartmentCard */}
      <section className="space-y-3">
        <h2 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
          5. CollegeDepartmentCard (Directory Cards)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CollegeDepartmentCard department={sampleDept} variant="standard" />
          <div className="space-y-3">
            <CollegeDepartmentCard department={sampleDept} variant="compact" />
            <CollegeDepartmentCard 
              department={{
                id: 'dept-chemistry',
                slug: 'dept-chemistry',
                name: 'Department of Chemistry',
                stream: 'Physical Sciences',
                facultyCount: 10
              }} 
              variant="compact" 
            />
          </div>
        </div>
      </section>

      {/* 7. COMPONENT 7: CollegeDocumentCard */}
      <section className="space-y-3">
        <h2 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
          6. CollegeDocumentCard (Row & Card Layouts)
        </h2>
        
        {/* Row format (e.g. Department Syllabi) */}
        <div className="space-y-2.5">
          <CollegeDocumentCard document={sampleDocPdf} layout="row" />
          <CollegeDocumentCard document={sampleDocExcel} layout="row" />
        </div>

        {/* Card format (e.g. Documents Page grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
          <CollegeDocumentCard document={sampleDocPdf} layout="card" />
          <CollegeDocumentCard document={sampleDocExcel} layout="card" />
        </div>
      </section>

      {/* 8. COMPONENT 8: CollegeDataTable */}
      <section className="space-y-3">
        <h2 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
          7. CollegeDataTable (Academic Record Grid)
        </h2>
        <CollegeDataTable
          columns={tableColumns}
          data={tableData}
          caption="Verified Faculty Academic Credentials and Educational Background"
          hoverable={true}
          striped={true}
        />

        {/* Empty State Demonstration */}
        <div className="pt-2">
          <h4 className="text-xs font-mono text-slate-500 mb-1.5">Empty Table Handling (Zero Data):</h4>
          <CollegeDataTable
            columns={tableColumns}
            data={[]}
            emptyMessage="No historical credentials on file for this academic department."
          />
        </div>
      </section>
    </div>
  );
}
