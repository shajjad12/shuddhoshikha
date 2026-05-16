/**
 * Sidebar — Shuddhoshikha
 * Apple-style fixed sidebar: 280px, dark active state, Framer Motion layoutId.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Brain,
  User,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ── Nav items ───────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'হোম',        path: '/',            icon: Home      },
  { label: 'কোর্সসমূহ', path: '/courses',     icon: BookOpen  },
  { label: 'চর্চাঘর',   path: '/practice',    icon: Brain     },
  { label: 'প্রোফাইল',  path: '/profile',     icon: User      },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-[280px] bg-white border-r border-gray-100
                 flex flex-col z-40 shadow-sm"
    >
      {/* ── Logo ────────────────────────────────────────── */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-mint rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bengali font-bold text-brand-charcoal text-base leading-tight">
              শুদ্ধশিক্ষা
            </h1>
            <p className="font-data text-[10px] text-brand-muted tracking-wide uppercase">
              EdTech Platform
            </p>
          </div>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="mx-6 h-px bg-gray-100 mb-4" />

      {/* ── Nav Items ───────────────────────────────────── */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative w-full flex items-center gap-3 px-4 py-3 rounded-xl
                         transition-colors duration-150 group"
              style={{ color: active ? '#ffffff' : '#64748b' }}
            >
              {/* Animated background */}
              {active && (
                <motion.div
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: '#1F1F1F' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}

              {/* Hover bg (inactive only) */}
              {!active && (
                <span
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                             transition-opacity duration-150"
                  style={{ backgroundColor: '#F0F1F5' }}
                />
              )}

              {/* Icon */}
              <span className="relative z-10">
                <Icon
                  className="w-[18px] h-[18px] transition-colors duration-150"
                  strokeWidth={active ? 2.5 : 2}
                  color={active ? '#ffffff' : '#64748b'}
                />
              </span>

              {/* Label */}
              <span
                className="relative z-10 font-bengali font-medium text-sm flex-1 text-left
                           transition-colors duration-150"
                style={{ color: active ? '#ffffff' : '#64748b' }}
              >
                {label}
              </span>

              {/* ChevronRight on active */}
              <AnimatePresence>
                {active && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.18 }}
                    className="relative z-10"
                  >
                    <ChevronRight className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* ── User card ───────────────────────────────────── */}
      <div className="px-3 pb-6">
        <div className="mx-0 h-px bg-gray-100 mb-4" />
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-hover
                        transition-colors duration-150 cursor-pointer group"
          onClick={() => navigate('/profile')}
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-brand-lavender flex items-center justify-center
                          flex-shrink-0 overflow-hidden">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-bengali font-semibold text-sm text-purple-500">
                {profile?.displayName?.[0] || 'শ'}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-bengali font-semibold text-sm text-brand-charcoal truncate leading-tight">
              {profile?.displayName || 'শিক্ষার্থী'}
            </p>
            <p className="font-data text-[11px] text-brand-muted truncate">
              {profile?.sh_class
                ? `শ্রেণি ${profile.sh_class} • ${profile.sh_group || ''}`
                : 'প্রোফাইল সম্পূর্ণ করুন'}
            </p>
          </div>

          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400
                                   transition-colors duration-150 flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
