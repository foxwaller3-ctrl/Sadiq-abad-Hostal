import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header.tsx';
import { Footer } from '../components/common/Footer.tsx';
import { FloatingActions } from '../components/common/FloatingActions.tsx';
import { ScrollToTop } from '../components/common/ScrollToTop.tsx';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};
