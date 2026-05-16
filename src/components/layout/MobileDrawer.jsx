/**
 * MobileDrawer — Shuddhoshikha
 * Slide-in overlay drawer for mobile hamburger menu.
 * Renders the full Sidebar content inside a sheet.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MobileDrawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="lg:hidden fixed top-0 left-0 h-screen z-[70]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-[-44px] z-10 w-9 h-9 bg-white rounded-full
                         flex items-center justify-center shadow-md"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Reuse the desktop Sidebar */}
            <Sidebar />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
