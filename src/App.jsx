import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './lib/authContext';
import { FlipbookProvider } from './context/FlipbookContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/common/Layout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AcademicsPage from './pages/AcademicsPage';
import ProgrammeDetailPage from './pages/ProgrammeDetailPage';
import SyllabusDetailPage from './pages/SyllabusDetailPage';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage';
import FacultyPage from './pages/FacultyPage';
import FacultyDetailPage from './pages/FacultyDetailPage';
import AdmissionsPage from './pages/AdmissionsPage';
import ExaminationsPage from './pages/ExaminationsPage';
import ResearchPage from './pages/ResearchPage';
import StudentLifePage from './pages/StudentLifePage';
import CampusInfrastructurePage from './pages/CampusInfrastructurePage';
import ResourcesPage from './pages/ResourcesPage';
import IqacPage from './pages/IqacPage';
import NaacPage from './pages/NaacPage';
import NirfPage from './pages/NirfPage';
import IicPage from './pages/IicPage';
import MandatoryDisclosurePage from './pages/MandatoryDisclosurePage';
import ImportantLinksPage from './pages/ImportantLinksPage';
import ComplianceDocumentPage from './pages/ComplianceDocumentPage';
import AlumniPage from './pages/AlumniPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import DocumentsPage from './pages/DocumentsPage';
import NewsEventsPage from './pages/NewsEventsPage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import AnthemsPage from './pages/AnthemsPage';
import ProspectusPage from './pages/ProspectusPage';
import EJournalPage from './pages/EJournalPage';
import LibraryPage from './pages/LibraryPage';
import MagazinePage from './pages/MagazinePage';
import DynamicCmsPage from './pages/DynamicCmsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin CMS Modules
import AdminLayout from './admin/AdminLayout';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminSliderManagerPage from './admin/pages/AdminSliderManagerPage';
import AdminGalleryManagerPage from './admin/pages/AdminGalleryManagerPage';
import AdminMediaManagerPage from './admin/pages/AdminMediaManagerPage';
import AdminDocumentManagerPage from './admin/pages/AdminDocumentManagerPage';
import AdminEventsManagerPage from './admin/pages/AdminEventsManagerPage';
import AdminFacultyManagerPage from './admin/pages/AdminFacultyManagerPage';
import AdminDepartmentManagerPage from './admin/pages/AdminDepartmentManagerPage';
import AdminProgrammeManagerPage from './admin/pages/AdminProgrammeManagerPage';
import AdminPagesManagerPage from './admin/pages/AdminPagesManagerPage';
import AdminNoticesManagerPage from './admin/pages/AdminNoticesManagerPage';
import AdminMenuManagerPage from './admin/pages/AdminMenuManagerPage';
import AdminUserManagerPage from './admin/pages/AdminUserManagerPage';
import AdminAlumniManagerPage from './admin/pages/AdminAlumniManagerPage';
import AdminArchiveStatusPage from './admin/pages/AdminArchiveStatusPage';
import AdminVerificationPage from './admin/pages/AdminVerificationPage';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <FlipbookProvider>
          <Routes>
            {/* PUBLIC INSTITUTIONAL PORTAL ROUTES */}
            <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="about/*" element={<AboutPage />} />
            <Route path="history" element={<AboutPage />} />
            <Route path="vision-mission" element={<AboutPage />} />
            <Route path="coat-of-arms" element={<AboutPage />} />
            <Route path="former-bishops" element={<AboutPage />} />
            <Route path="former-principals" element={<AboutPage />} />
            <Route path="mdes" element={<AboutPage />} />
            <Route path="organogram" element={<AboutPage />} />
            <Route path="governing-body" element={<AboutPage />} />
            <Route path="statutory-bodies" element={<AboutPage />} />
            <Route path="rectors-message" element={<AboutPage />} />
            <Route path="principals-message" element={<AboutPage />} />
            <Route path="academics" element={<AcademicsPage />} />
            <Route path="academics/:programmeCode" element={<ProgrammeDetailPage />} />
            <Route path="academics/:programmeCode/syllabus" element={<SyllabusDetailPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="departments/:deptId" element={<DepartmentDetailPage />} />
            <Route path="departments/:deptId/faculty/:facultyId" element={<FacultyDetailPage />} />
            <Route path="faculty" element={<FacultyPage />} />
            <Route path="faculty/:facultyId" element={<FacultyDetailPage />} />
            <Route path="prospectus" element={<ProspectusPage />} />
            <Route path="admission/prospectus" element={<ProspectusPage />} />
            <Route path="admissions" element={<AdmissionsPage />} />
            <Route path="apply" element={<AdmissionsPage />} />
            <Route path="applications" element={<AdmissionsPage />} />
            <Route path="admissions/fee-structure" element={<ComplianceDocumentPage />} />
            <Route path="examinations" element={<ExaminationsPage />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="student-life" element={<StudentLifePage />} />
            <Route path="student-life/:slug" element={<StudentLifePage />} />
            <Route path="student-support" element={<StudentLifePage />} />
            <Route path="student-support/:slug" element={<StudentLifePage />} />

            {/* DIRECT STUDENT SUPPORT & AMENITIES ALIASES */}
            <Route path="placement-cell" element={<StudentLifePage />} />
            <Route path="student-grievance-redressal-committee" element={<StudentLifePage />} />
            <Route path="anti-ragging" element={<StudentLifePage />} />
            <Route path="womens-cell" element={<StudentLifePage />} />
            <Route path="student-welfare-cell" element={<StudentLifePage />} />
            <Route path="counselling-centre" element={<StudentLifePage />} />
            <Route path="human-values-professional-ethics" element={<StudentLifePage />} />
            <Route path="youth-red-cross-yrc" element={<StudentLifePage />} />
            <Route path="facilities" element={<CampusInfrastructurePage />} />
            <Route path="infrastructure" element={<CampusInfrastructurePage />} />
            <Route path="campus" element={<CampusInfrastructurePage />} />
            <Route path="campus-infrastructure" element={<CampusInfrastructurePage />} />
            <Route path="about-us-2/infrastructure" element={<CampusInfrastructurePage />} />
            <Route path="about-us-2/infrastructure/facilities" element={<CampusInfrastructurePage />} />
            <Route path="business-lab" element={<StudentLifePage />} />
            <Route path="computer-science-lab" element={<StudentLifePage />} />
            <Route path="about-us-2/infrastructure/girls-hostel" element={<StudentLifePage />} />
            <Route path="girls-hostel" element={<StudentLifePage />} />
            <Route path="about-us-2/infrastructure/boys-hostel" element={<StudentLifePage />} />
            <Route path="boys-hostel" element={<StudentLifePage />} />
            <Route path="auditorium" element={<StudentLifePage />} />
            <Route path="about-us-2/infrastructure/bank-atm" element={<StudentLifePage />} />
            <Route path="bank-atm" element={<StudentLifePage />} />
            <Route path="chapel-hall-3" element={<StudentLifePage />} />
            <Route path="chapel" element={<StudentLifePage />} />
            <Route path="ranger-and-rovers" element={<StudentLifePage />} />
            <Route path="ncc" element={<StudentLifePage />} />
            <Route path="nss" element={<StudentLifePage />} />
            <Route path="indoor-stadium" element={<StudentLifePage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="iqac" element={<IqacPage />} />
            <Route path="iqac/:tab" element={<IqacPage />} />
            <Route path="naac" element={<NaacPage />} />
            <Route path="nirf" element={<NirfPage />} />
            <Route path="iic" element={<IicPage />} />
            <Route path="mandatory-disclosure" element={<MandatoryDisclosurePage />} />
            <Route path="mandatory-disclosure/:docSlug" element={<ComplianceDocumentPage />} />
            <Route path="compliance" element={<MandatoryDisclosurePage />} />
            <Route path="compliance/:docSlug" element={<ComplianceDocumentPage />} />
            <Route path="alumni" element={<AlumniPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="gallery/:albumSlug" element={<GalleryPage />} />
            <Route path="gallery/album/:albumSlug" element={<GalleryPage />} />
            <Route path="picture-gallery" element={<GalleryPage />} />
            <Route path="picture-gallery/:albumSlug" element={<GalleryPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="news-events" element={<NewsEventsPage />} />
            <Route path="news-events/:id" element={<NoticeDetailPage />} />
            <Route path="notices" element={<NewsEventsPage />} />
            <Route path="notices/:id" element={<NoticeDetailPage />} />
            <Route path="events" element={<NewsEventsPage />} />
            <Route path="events/:id" element={<NoticeDetailPage />} />
            <Route path="congratulations-25" element={<NoticeDetailPage />} />
            <Route path="blog/events" element={<NewsEventsPage />} />
            <Route path="anthems" element={<AnthemsPage />} />
            <Route path="e-journals" element={<EJournalPage />} />
            <Route path="e-journal" element={<EJournalPage />} />
            <Route path="ejournal" element={<EJournalPage />} />
            <Route path="philos-bulletin" element={<EJournalPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="magazine" element={<MagazinePage />} />
            <Route path="college-magazine" element={<MagazinePage />} />
            <Route path="pages/:slug" element={<DynamicCmsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* AUTHENTICATION ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<LoginPage />} />

          {/* ENTERPRISE ADMIN CMS DASHBOARD (PROTECTED) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="sliders" element={<AdminSliderManagerPage />} />
            <Route path="pages" element={<AdminPagesManagerPage />} />
            <Route path="menus" element={<AdminMenuManagerPage />} />
            <Route path="notices" element={<AdminNoticesManagerPage />} />
            <Route path="events" element={<AdminEventsManagerPage />} />
            <Route path="gallery" element={<AdminGalleryManagerPage />} />
            <Route path="programmes" element={<AdminProgrammeManagerPage />} />
            <Route path="departments" element={<AdminDepartmentManagerPage />} />
            <Route path="faculty" element={<AdminFacultyManagerPage />} />
            <Route path="alumni" element={<AdminAlumniManagerPage />} />
            <Route path="iqac" element={<AdminDocumentManagerPage />} />
            <Route path="media" element={<AdminGalleryManagerPage />} />
            <Route path="documents" element={<AdminDocumentManagerPage />} />
            <Route path="users" element={<AdminUserManagerPage />} />
            <Route path="logs" element={<AdminUserManagerPage />} />
            <Route path="settings" element={<AdminDashboardPage />} />
            <Route path="archive-status" element={<AdminArchiveStatusPage />} />
            <Route path="verification" element={<AdminVerificationPage />} />
          </Route>
        </Routes>
        </FlipbookProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
