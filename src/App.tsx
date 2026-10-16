import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext.tsx';
import { ToastProvider } from './components/ui/Toast.tsx';

// Layouts
import { PublicLayout } from './layouts/PublicLayout.tsx';
import { AdminLayout } from './layouts/AdminLayout.tsx';

// Public Pages
import { Home } from './pages/public/Home.tsx';
import { About } from './pages/public/About.tsx';
import { Rooms } from './pages/public/Rooms.tsx';
import { Facilities } from './pages/public/Facilities.tsx';
import { Mess } from './pages/public/Mess.tsx';
import { Gallery } from './pages/public/Gallery.tsx';
import { Location } from './pages/public/Location.tsx';
import { RulesFaq } from './pages/public/RulesFaq.tsx';
import { Contact } from './pages/public/Contact.tsx';
import { NotFound } from './pages/public/NotFound.tsx';

// Admin Pages
import { Login } from './pages/admin/Login.tsx';
import { Dashboard } from './pages/admin/Dashboard.tsx';
import { HostelInfoAdmin } from './pages/admin/HostelInfoAdmin.tsx';
import { RoomsAdmin } from './pages/admin/RoomsAdmin.tsx';
import { FacilitiesAdmin } from './pages/admin/FacilitiesAdmin.tsx';
import { MessAdmin } from './pages/admin/MessAdmin.tsx';
import { GalleryAdmin } from './pages/admin/GalleryAdmin.tsx';
import { RulesFaqAdmin } from './pages/admin/RulesFaqAdmin.tsx';
import { ReviewsAdmin } from './pages/admin/ReviewsAdmin.tsx';
import { InquiriesAdmin } from './pages/admin/InquiriesAdmin.tsx';
import { NoticesAdmin } from './pages/admin/NoticesAdmin.tsx';
import { SettingsAdmin } from './pages/admin/SettingsAdmin.tsx';

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="facilities" element={<Facilities />} />
              <Route path="mess" element={<Mess />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="location" element={<Location />} />
              <Route path="rules-faq" element={<RulesFaq />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="hostel-info" element={<HostelInfoAdmin />} />
              <Route path="rooms" element={<RoomsAdmin />} />
              <Route path="facilities" element={<FacilitiesAdmin />} />
              <Route path="mess" element={<MessAdmin />} />
              <Route path="gallery" element={<GalleryAdmin />} />
              <Route path="rules-faq" element={<RulesFaqAdmin />} />
              <Route path="reviews" element={<ReviewsAdmin />} />
              <Route path="inquiries" element={<InquiriesAdmin />} />
              <Route path="notices" element={<NoticesAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </I18nProvider>
  );
}
