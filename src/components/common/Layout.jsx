import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AnnouncementTicker from './AnnouncementTicker';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#071A33] font-sans antialiased overflow-x-hidden">
      <Header />
      <AnnouncementTicker />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
