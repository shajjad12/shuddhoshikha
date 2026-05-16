/**
 * MobileTopBar — Shuddhoshikha
 * Visible only on mobile. Hamburger | Logo | Bell.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, GraduationCap } from 'lucide-react';

export default function MobileTopBar({ onMenuOpen, notificationCount = 0 }) {
  return (
    <header
      className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md
                 border-b border-gray-100 h-14 flex items-center px-4"
    >
      {/* Hamburger */}
      <button
        onClick={onMenuOpen}
        className="w-9 h-9 rounded-xl flex items-center justify-center
                   hover:bg-brand-hover transition-colors duration-150"
      >
        <Menu className="w-5 h-5 text-brand-charcoal" strokeWidth={2} />
      </button>

      {/* Logo — centered */}
      <div className="flex-1 flex justify-center items-center gap-2">
        <div className="w-7 h-7 bg-brand-mint rounded-lg flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bengali font-bold text-brand-charcoal text-base">
          শুদ্ধশিক্ষা
        </span>
      </div>

      {/* Bell */}
      <div className="relative">
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center
                     hover:bg-brand-hover transition-colors duration-150"
        >
          <Bell className="w-5 h-5 text-brand-charcoal" strokeWidth={2} />
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-mint rounded-full"
            />
          )}
        </button>
      </div>
    </header>
  );
}
