import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#121316] font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <AdminSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Content Area in White Rounded Card */}
      <div className="flex-1 flex flex-col min-w-0 my-2 mr-2 sm:my-3 sm:mr-3 lg:my-4 lg:mr-4 ml-2 lg:ml-0 overflow-hidden">
        <div className="flex-1 bg-white rounded-[24px] sm:rounded-[32px] lg:rounded-[36px] shadow-2xl flex flex-col min-w-0 overflow-hidden border border-white/10">
          <AdminHeader onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
