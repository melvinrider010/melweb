import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './lib/authContext';
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
import ResourcesPage from './pages/ResourcesPage';
import IqacPage from './pages/IqacPage';
import NaacPage from './pages/NaacPage';
import NirfPage from './pages/NirfPage';
import IicPage from './pages/IicPage';
import MandatoryDisclosurePage from './pages/MandatoryDisclosurePage';
import ComplianceDocumentPage from './pages/ComplianceDocumentPage';
import AlumniPage from './pages/AlumniPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import DocumentsPage from './pages/DocumentsPage';
import NewsEventsPage from './pages/NewsEventsPage';
import AnthemsPage from './pages/AnthemsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin CMS Modules
import AdminLayout from './admin/AdminLayout';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminSliderManagerPage from './admin/pages/AdminSliderManagerPage';
import AdminMediaManagerPage from './admin/pages/AdminMediaManagerPage';
import AdminDocumentManagerPage from './admin/pages/AdminDocumentManagerPage';
import AdminUserManagerPage from './admin/pages/AdminUserManagerPage';
import AdminArchiveStatusPage from './admin/pages/AdminArchiveStatusPage';
import AdminVerificationPage from './admin/pages/AdminVerificationPage';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AuthProvider>
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
          <Route path="admissions" element={<AdmissionsPage />} />
          <Route path="apply" element={<AdmissionsPage />} />
          <Route path="applications" element={<AdmissionsPage />} />
          <Route path="examinations" element={<ExaminationsPage />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="student-support" element={<StudentLifePage />} />
          <Route path="student-life" element={<StudentLifePage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="iqac" element={<IqacPage />} />
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
          <Route path="anthems" element={<AnthemsPage />} />
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
          <Route path="notices" element={<AdminDashboardPage />} />
          <Route path="events" element={<AdminDashboardPage />} />
          <Route path="gallery" element={<AdminMediaManagerPage />} />
          <Route path="programmes" element={<AdminDashboardPage />} />
          <Route path="departments" element={<AdminDashboardPage />} />
          <Route path="faculty" element={<AdminDashboardPage />} />
          <Route path="iqac" element={<AdminDocumentManagerPage />} />
          <Route path="media" element={<AdminMediaManagerPage />} />
          <Route path="documents" element={<AdminDocumentManagerPage />} />
          <Route path="users" element={<AdminUserManagerPage />} />
          <Route path="logs" element={<AdminUserManagerPage />} />
          <Route path="settings" element={<AdminDashboardPage />} />
          <Route path="archive-status" element={<AdminArchiveStatusPage />} />
          <Route path="verification" element={<AdminVerificationPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
