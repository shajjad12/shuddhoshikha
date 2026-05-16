/**
 * App.jsx — Shuddhoshikha
 * Root router. Lazy-loads all view components.
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import MainLayout       from './components/layout/MainLayout';

/* ── Lazy views ──────────────────────────────────────────── */
const HomeView     = lazy(() => import('./views/HomeView'));
const CoursesView  = lazy(() => import('./views/CoursesView'));
const PracticeView = lazy(() => import('./views/PracticeView'));
const ProfileView  = lazy(() => import('./views/ProfileView'));
const LoginView    = lazy(() => import('./views/LoginView'));

/* ── Suspend fallback ────────────────────────────────────── */
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-base">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-8 h-8 border-2 border-brand-mint border-t-transparent rounded-full"
    />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<LoginView />} />

            {/* Protected routes — all under MainLayout */}
            <Route element={<MainLayout />}>
              <Route index            element={<HomeView />}     />
              <Route path="courses"   element={<CoursesView />}  />
              <Route path="practice/*"element={<PracticeView />} />
              <Route path="profile"   element={<ProfileView />}  />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
