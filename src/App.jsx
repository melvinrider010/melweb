import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './lib/authContext';
import { FlipbookProvider } from './context/FlipbookContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/common/Layout';
import PageFallback from './components/common/PageFallback';

// Public Pages (Lazy-Loaded)
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AcademicsPage = lazy(() => import('./pages/AcademicsPage'));
const ProgrammeDetailPage = lazy(() => import('./pages/ProgrammeDetailPage'));
const SyllabusDetailPage = lazy(() => import('./pages/SyllabusDetailPage'));
const DepartmentsPage = lazy(() => import('./pages/DepartmentsPage'));
const DepartmentDetailPage = lazy(() => import('./pages/DepartmentDetailPage'));
const FacultyPage = lazy(() => import('./pages/FacultyPage'));
const FacultyDetailPage = lazy(() => import('./pages/FacultyDetailPage'));
const AdmissionsPage = lazy(() => import('./pages/AdmissionsPage'));
const ExaminationsPage = lazy(() => import('./pages/ExaminationsPage'));
const ResearchPage = lazy(() => import('./pages/ResearchPage'));
const StudentLifePage = lazy(() => import('./pages/StudentLifePage'));
const CampusInfrastructurePage = lazy(() => import('./pages/CampusInfrastructurePage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const IqacPage = lazy(() => import('./pages/IqacPage'));
const NaacPage = lazy(() => import('./pages/NaacPage'));
const NirfPage = lazy(() => import('./pages/NirfPage'));
const IicPage = lazy(() => import('./pages/IicPage'));
const MandatoryDisclosurePage = lazy(() => import('./pages/MandatoryDisclosurePage'));
const ImportantLinksPage = lazy(() => import('./pages/ImportantLinksPage'));
const ComplianceDocumentPage = lazy(() => import('./pages/ComplianceDocumentPage'));
const AlumniPage = lazy(() => import('./pages/AlumniPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const NewsEventsPage = lazy(() => import('./pages/NewsEventsPage'));
const NoticeDetailPage = lazy(() => import('./pages/NoticeDetailPage'));
const AnthemsPage = lazy(() => import('./pages/AnthemsPage'));
const ProspectusPage = lazy(() => import('./pages/ProspectusPage'));
const EJournalPage = lazy(() => import('./pages/EJournalPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const MagazinePage = lazy(() => import('./pages/MagazinePage'));
const DynamicCmsPage = lazy(() => import('./pages/DynamicCmsPage'));
const LeadershipMessagePage = lazy(() => import('./pages/LeadershipMessagePage'));
const CollegeComponentShowcase = lazy(() => import('./pages/CollegeComponentShowcase'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin CMS Modules (Lazy-Loaded)
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./admin/pages/AdminDashboardPage'));
const AdminSliderManagerPage = lazy(() => import('./admin/pages/AdminSliderManagerPage'));
const AdminGalleryManagerPage = lazy(() => import('./admin/pages/AdminGalleryManagerPage'));
const AdminMediaManagerPage = lazy(() => import('./admin/pages/AdminMediaManagerPage'));
const AdminDocumentManagerPage = lazy(() => import('./admin/pages/AdminDocumentManagerPage'));
const AdminEventsManagerPage = lazy(() => import('./admin/pages/AdminEventsManagerPage'));
const AdminFacultyManagerPage = lazy(() => import('./admin/pages/AdminFacultyManagerPage'));
const AdminDepartmentManagerPage = lazy(() => import('./admin/pages/AdminDepartmentManagerPage'));
const AdminDepartmentPortalPage = lazy(() => import('./admin/pages/AdminDepartmentPortalPage'));
const AdminDepartmentPagesListPage = lazy(() => import('./admin/pages/AdminDepartmentPagesListPage'));
const AdminDepartmentEditorPage = lazy(() => import('./admin/pages/AdminDepartmentEditorPage'));
const AdminProgrammeManagerPage = lazy(() => import('./admin/pages/AdminProgrammeManagerPage'));
const AdminPagesManagerPage = lazy(() => import('./admin/pages/AdminPagesManagerPage'));
const AdminNoticesManagerPage = lazy(() => import('./admin/pages/AdminNoticesManagerPage'));
const AdminMenuManagerPage = lazy(() => import('./admin/pages/AdminMenuManagerPage'));
const AdminUserManagerPage = lazy(() => import('./admin/pages/AdminUserManagerPage'));
const AdminAlumniManagerPage = lazy(() => import('./admin/pages/AdminAlumniManagerPage'));
const AdminArchiveStatusPage = lazy(() => import('./admin/pages/AdminArchiveStatusPage'));
const AdminVerificationPage = lazy(() => import('./admin/pages/AdminVerificationPage'));
const AdminSettingsPage = lazy(() => import('./admin/pages/AdminSettingsPage'));
const AdminHeaderFooterPage = lazy(() => import('./admin/pages/AdminHeaderFooterPage'));
const AdminLeadershipManagerPage = lazy(() => import('./admin/pages/AdminLeadershipManagerPage'));
const AdminOrganogramPage = lazy(() => import('./admin/pages/AdminOrganogramPage'));

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <FlipbookProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* PUBLIC INSTITUTIONAL PORTAL ROUTES */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="about/principals-message" element={<LeadershipMessagePage defaultSlug="principal" />} />
                <Route path="about/principal-message" element={<LeadershipMessagePage defaultSlug="principal" />} />
                <Route path="about/rectors-message" element={<LeadershipMessagePage defaultSlug="rector" />} />
                <Route path="about/rector-message" element={<LeadershipMessagePage defaultSlug="rector" />} />
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
                <Route path="leadership" element={<AboutPage />} />
                <Route path="rectors-message" element={<LeadershipMessagePage defaultSlug="rector" />} />
                <Route path="rector-message" element={<LeadershipMessagePage defaultSlug="rector" />} />
                <Route path="principals-message" element={<LeadershipMessagePage defaultSlug="principal" />} />
                <Route path="principal-message" element={<LeadershipMessagePage defaultSlug="principal" />} />
                <Route path="bishops-message" element={<Navigate to="/about?tab=mdes" replace />} />
                <Route path="financial-officers-message" element={<Navigate to="/about?tab=leadership" replace />} />
                <Route path="leadership/bishop" element={<Navigate to="/about?tab=mdes" replace />} />
                <Route path="leadership/financial-officer" element={<Navigate to="/about?tab=leadership" replace />} />
                <Route path="leadership/:slug" element={<LeadershipMessagePage />} />
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
                <Route path="important-links" element={<DynamicCmsPage defaultSlug="important-links" />} />
                <Route path="pages/:slug" element={<DynamicCmsPage />} />
                <Route path="dev/college-components" element={<CollegeComponentShowcase />} />
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
                <Route path="leadership" element={<AdminLeadershipManagerPage />} />
                <Route path="administration" element={<AdminLeadershipManagerPage />} />
                <Route path="organogram" element={<AdminOrganogramPage />} />
                <Route path="sliders" element={<AdminSliderManagerPage />} />
                <Route path="pages" element={<AdminPagesManagerPage />} />
                <Route path="menus" element={<AdminMenuManagerPage />} />
                <Route path="notices" element={<AdminNoticesManagerPage />} />
                <Route path="events" element={<AdminEventsManagerPage />} />
                <Route path="gallery" element={<AdminGalleryManagerPage />} />
                <Route path="programmes" element={<AdminProgrammeManagerPage />} />
                <Route path="department-pages" element={<AdminDepartmentPagesListPage />} />
                <Route path="department-pages/:deptId/edit" element={<AdminDepartmentEditorPage />} />
                <Route path="departments" element={<AdminDepartmentPagesListPage />} />
                <Route path="departments/:deptId/edit" element={<AdminDepartmentEditorPage />} />
                <Route path="department-portal" element={<AdminDepartmentPortalPage />} />
                <Route path="faculty" element={<AdminFacultyManagerPage />} />
                <Route path="alumni" element={<AdminAlumniManagerPage />} />
                <Route path="iqac" element={<AdminDocumentManagerPage />} />
                <Route path="media" element={<AdminGalleryManagerPage />} />
                <Route path="documents" element={<AdminDocumentManagerPage />} />
                <Route path="users" element={<AdminUserManagerPage />} />
                <Route path="logs" element={<AdminUserManagerPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="header-footer" element={<AdminHeaderFooterPage />} />
                <Route path="layout" element={<AdminHeaderFooterPage />} />
                <Route path="archive-status" element={<AdminArchiveStatusPage />} />
                <Route path="verification" element={<AdminVerificationPage />} />
              </Route>
            </Routes>
          </Suspense>
        </FlipbookProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}