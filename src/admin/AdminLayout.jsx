import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent browser window from creating an outer scrollbar while in admin
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow || 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 h-screen w-screen max-h-screen max-w-full overflow-hidden bg-gradient-to-br from-[#C7D2FE]/60 via-[#E0E7FF]/70 to-[#DDD6FE]/60 p-2 sm:p-3 lg:p-4 flex items-center justify-center font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Floating Frosted Glass Tablet Container: Fits viewport with ZERO outer scrollbar */}
      <div className="w-full h-full max-w-[1720px] max-h-full bg-white/40 backdrop-blur-3xl rounded-[28px] sm:rounded-[34px] lg:rounded-[38px] border border-white/70 shadow-[0_25px_80px_rgba(30,27,75,0.18)] flex overflow-hidden relative">
        
        {/* Sidebar (Desktop + Mobile Drawer) */}
        <AdminSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

        {/* Main Content Area in Translucent Glass Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-[#F1F5F9]/70 via-[#F8FAFC]/80 to-[#EDF2F7]/70 backdrop-blur-2xl overflow-hidden h-full">
          <AdminHeader onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
          
          {/* Internal Scrollable Viewport (The single active scrollbar) */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-9 space-y-6 scrollbar-thin scrollbar-thumb-indigo-200/80 hover:scrollbar-thumb-indigo-300">
            <Outlet />
          </main>
        </div>

      </div>

    </div>
  );
}
