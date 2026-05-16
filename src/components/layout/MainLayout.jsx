/**
 * MainLayout — Shuddhoshikha
 * Root layout: fixed 280px sidebar (desktop) + scrollable main.
 * Mobile: TopBar + BottomNav + Drawer.
 * Auth gating + onboarding redirect handled here.
 */
import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar         from './Sidebar';
import MobileTopBar    from './MobileTopBar';
import MobileBottomNav from './MobileBottomNav';
import MobileDrawer    from './MobileDrawer';
import { useAuth }     from '../../context/AuthContext';

/* ── Page transition variants ────────────────────────────── */
const pageVariants = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0  },
  exit:     { opacity: 0, y: -6 },
};
const pageTransition = { duration: 0.22, ease: [0.4, 0, 0.2, 1] };

/* ── Routes that don't need auth ─────────────────────────── */
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

export default function MainLayout() {
  const { isAuthenticated, needsOnboarding, loading } = useAuth();
  const location  = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* Loading splash */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-base">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-brand-mint border-t-transparent rounded-full"
        />
      </div>
    );
  }

  /* Auth guard */
  const isPublic = PUBLIC_ROUTES.includes(location.pathname);
  if (!isAuthenticated && !isPublic) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /* Onboarding guard — missing sh_class */
  if (
    isAuthenticated &&
    needsOnboarding &&
    location.pathname !== '/profile' &&
    !isPublic
  ) {
    return <Navigate to="/profile" state={{ onboarding: true }} replace />;
  }

  /* Public routes (Login, etc.) render without layout */
  if (isPublic) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="page-wrapper"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-base">

      {/* ── Desktop Sidebar ──────────────────────────── */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* ── Mobile Drawer ────────────────────────────── */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ── Mobile Top Bar ───────────────────────────── */}
      <MobileTopBar onMenuOpen={() => setDrawerOpen(true)} />

      {/* ── Main Content ─────────────────────────────── */}
      <main
        className="
          flex-1 min-h-screen overflow-y-auto
          lg:ml-[280px]
          pt-14 lg:pt-0
          pb-24 lg:pb-0
        "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="page-wrapper"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Mobile Bottom Nav ────────────────────────── */}
      <MobileBottomNav />
    </div>
  );
}
