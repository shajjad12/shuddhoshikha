/**
 * MobileBottomNav — Shuddhoshikha
 * Sticky bottom navigation with high-radius icon tabs.
 * Visible only on mobile (lg:hidden).
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Brain, User } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'হোম',        path: '/',         icon: Home     },
  { label: 'কোর্স',     path: '/courses',  icon: BookOpen },
  { label: 'চর্চাঘর',  path: '/practice', icon: Brain    },
  { label: 'প্রোফাইল', path: '/profile',  icon: User     },
];

export default function MobileBottomNav() {
  const location = useNavigate ? useLocation() : { pathname: '/' };
  const navigate  = useNavigate();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md
                 border-t border-gray-100 bottom-nav"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl
                         transition-colors duration-150 relative min-w-[60px]"
            >
              {/* Active pill background */}
              {active && (
                <motion.div
                  layoutId="mobile-nav-bg"
                  className="absolute inset-0 rounded-2xl"
                  style={{ backgroundColor: '#F4F2FF' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                />
              )}

              {/* Icon */}
              <span className="relative z-10">
                {/* Brain special case: Mint circle when active */}
                {path === '/practice' && active ? (
                  <span className="w-7 h-7 rounded-full bg-brand-mint flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </span>
                ) : (
                  <Icon
                    className="w-5 h-5 transition-colors duration-150"
                    strokeWidth={active ? 2.5 : 1.8}
                    color={active ? '#00C9A7' : '#94a3b8'}
                  />
                )}
              </span>

              {/* Label */}
              <span
                className="relative z-10 font-bengali text-[10px] font-medium leading-none
                           transition-colors duration-150"
                style={{ color: active ? '#00C9A7' : '#94a3b8' }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
