import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import AnnouncementTicker from '../components/common/AnnouncementTicker';
import QuickPortalsBar from '../components/common/QuickPortalsBar';
import Footer from '../components/common/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <AnnouncementTicker />
      <QuickPortalsBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
