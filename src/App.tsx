import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext.tsx';
import { ToastProvider } from './components/ui/Toast.tsx';

// Layouts
import { PublicLayout } from './layouts/PublicLayout.tsx';
import { AdminLayout } from './layouts/AdminLayout.tsx';

// Public Pages
const Home = React.lazy(() => import('./pages/public/Home.tsx').then((m) => ({ default: m.Home })));
const About = React.lazy(() => import('./pages/public/About.tsx').then((m) => ({ default: m.About })));
const Rooms = React.lazy(() => import('./pages/public/Rooms.tsx').then((m) => ({ default: m.Rooms })));
const Facilities = React.lazy(() => import('./pages/public/Facilities.tsx').then((m) => ({ default: m.Facilities })));
const Mess = React.lazy(() => import('./pages/public/Mess.tsx').then((m) => ({ default: m.Mess })));
const Gallery = React.lazy(() => import('./pages/public/Gallery.tsx').then((m) => ({ default: m.Gallery })));
const Location = React.lazy(() => import('./pages/public/Location.tsx').then((m) => ({ default: m.Location })));
const RulesFaq = React.lazy(() => import('./pages/public/RulesFaq.tsx').then((m) => ({ default: m.RulesFaq })));
const Contact = React.lazy(() => import('./pages/public/Contact.tsx').then((m) => ({ default: m.Contact })));
const NotFound = React.lazy(() => import('./pages/public/NotFound.tsx').then((m) => ({ default: m.NotFound })));

// Admin Pages
const Login = React.lazy(() => import('./pages/admin/Login.tsx').then((m) => ({ default: m.Login })));
const ResetPassword = React.lazy(() => import('./pages/admin/ResetPassword.tsx').then((m) => ({ default: m.ResetPassword })));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard.tsx').then((m) => ({ default: m.Dashboard })));
const HostelInfoAdmin = React.lazy(() => import('./pages/admin/HostelInfoAdmin.tsx').then((m) => ({ default: m.HostelInfoAdmin })));
const RoomsAdmin = React.lazy(() => import('./pages/admin/RoomsAdmin.tsx').then((m) => ({ default: m.RoomsAdmin })));
const FacilitiesAdmin = React.lazy(() => import('./pages/admin/FacilitiesAdmin.tsx').then((m) => ({ default: m.FacilitiesAdmin })));
const MessAdmin = React.lazy(() => import('./pages/admin/MessAdmin.tsx').then((m) => ({ default: m.MessAdmin })));
const GalleryAdmin = React.lazy(() => import('./pages/admin/GalleryAdmin.tsx').then((m) => ({ default: m.GalleryAdmin })));
const RulesFaqAdmin = React.lazy(() => import('./pages/admin/RulesFaqAdmin.tsx').then((m) => ({ default: m.RulesFaqAdmin })));
const ReviewsAdmin = React.lazy(() => import('./pages/admin/ReviewsAdmin.tsx').then((m) => ({ default: m.ReviewsAdmin })));
const InquiriesAdmin = React.lazy(() => import('./pages/admin/InquiriesAdmin.tsx').then((m) => ({ default: m.InquiriesAdmin })));
const NoticesAdmin = React.lazy(() => import('./pages/admin/NoticesAdmin.tsx').then((m) => ({ default: m.NoticesAdmin })));
const SettingsAdmin = React.lazy(() => import('./pages/admin/SettingsAdmin.tsx').then((m) => ({ default: m.SettingsAdmin })));

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <BrowserRouter>
          <React.Suspense fallback={<div role="status" className="min-h-[40vh] flex items-center justify-center text-sm font-medium text-teal-800">Loading page…</div>}>
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
            <Route path="/admin/reset-password" element={<ResetPassword />} />

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
          </React.Suspense>
        </BrowserRouter>
      </ToastProvider>
    </I18nProvider>
  );
}
