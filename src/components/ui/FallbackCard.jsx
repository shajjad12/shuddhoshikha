/**
 * FallbackCard — Shuddhoshikha
 * Soft Lavender fallback shown when content query returns 0 results.
 * Used across all views that depend on profile-filtered data.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function FallbackCard({
  message  = 'আপনার ক্লাসের কন্টেন্ট লোড হচ্ছে...',
  icon     = null,
  spinning = true,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="w-full rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center"
      style={{ backgroundColor: '#F4F2FF' }}
    >
      {icon ?? (
        spinning && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-8 h-8 text-purple-400" strokeWidth={1.8} />
          </motion.div>
        )
      )}
      <p className="font-bengali text-base font-medium text-purple-700 max-w-xs leading-relaxed">
        {message}
      </p>
    </motion.div>
  );
}
