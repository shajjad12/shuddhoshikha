/**
 * PracticeView — Shuddhoshikha
 * Module 4: চর্চাঘর (Practice Hub)
 *
 * Root with 3 categories:
 *   A. অধ্যায়ভিত্তিক প্রস্তুতি  → ChapterPractice
 *   B. মক টেস্ট                  → MockTestWizard
 *   C. বোর্ড প্রশ্ন প্রস্তুতি   → BoardQuestions
 *
 * Brain icon with Mint circle when /practice is the active base route.
 * Access control:
 *   - Unauthenticated → redirect to /login (handled by MainLayout)
 *   - Missing sh_class → redirect to /profile (handled by MainLayout)
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Brain, BookMarked, Trophy, ArrowRight,
  ChevronRight, Layers,
} from 'lucide-react';
import ChapterPractice from './practice/ChapterPractice';
import MockTestWizard  from './practice/MockTestWizard';
import BoardQuestions  from './practice/BoardQuestions';

/* ─────────────────────────────────────────────────────────── */
/*  Category card data                                          */
/* ─────────────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id:       'chapter',
    path:     'chapter',
    label:    'অধ্যায়ভিত্তিক প্রস্তুতি',
    sublabel: 'বিষয় → অধ্যায় → মোড নির্বাচন করুন',
    icon:     BookMarked,
    iconBg:   '#E3F2FD',
    iconColor:'#1565c0',
    gradient: 'linear-gradient(135deg,#4f46e5 0%,#6366f1 100%)',
    badge:    'Quick + Timed',
  },
  {
    id:       'mock',
    path:     'mock',
    label:    'মক টেস্ট',
    sublabel: '৪ ধাপে কাস্টম পরীক্ষা তৈরি করুন',
    icon:     Layers,
    iconBg:   '#E8F5E9',
    iconColor:'#2e7d32',
    gradient: 'linear-gradient(135deg,#059669 0%,#10b981 100%)',
    badge:    '4-Step Wizard',
  },
  {
    id:       'board',
    path:     'board',
    label:    'বোর্ড প্রশ্ন প্রস্তুতি',
    sublabel: 'বোর্ড ও সাল অনুযায়ী প্রশ্ন দেখুন',
    icon:     Trophy,
    iconBg:   '#FFF3E0',
    iconColor:'#e65100',
    gradient: 'linear-gradient(135deg,#d97706 0%,#f59e0b 100%)',
    badge:    '৯ বোর্ড',
  },
];

/* ─────────────────────────────────────────────────────────── */
/*  Category Card                                               */
/* ─────────────────────────────────────────────────────────── */
function CategoryCard({ cat, index, onClick }) {
  const Icon = cat.icon;
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y:  0 }}
      transition={{ duration: 0.26, delay: index * 0.08 }}
      whileHover={{ y: -3, boxShadow: '0 8px 28px 0 rgba(0,0,0,0.10)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-card overflow-hidden text-left"
    >
      {/* Gradient strip */}
      <div
        className="h-28 flex items-end p-4 relative"
        style={{ background: cat.gradient }}
      >
        {/* Decorative circle */}
        <div className="absolute top-3 right-3 w-16 h-16 rounded-full bg-white/10" />
        <div className="absolute top-6 right-6 w-8  h-8  rounded-full bg-white/10" />

        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
        </div>

        {/* Badge */}
        <span className="absolute top-3 left-4 font-data text-[10px] font-semibold
                         bg-white/20 text-white px-2 py-0.5 rounded-full">
          {cat.badge}
        </span>
      </div>

      {/* Bottom white */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-bengali font-bold text-sm text-brand-charcoal">{cat.label}</p>
          <p className="font-bengali text-xs text-brand-muted mt-0.5">{cat.sublabel}</p>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cat.gradient }}
        >
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Hub Header — always visible above sub-routes               */
/* ─────────────────────────────────────────────────────────── */
function PracticeHeader({ subPath, onBack }) {
  const isRoot = !subPath || subPath === '/';

  /* Sub-route label */
  const subLabel =
    subPath?.includes('chapter') ? 'অধ্যায়ভিত্তিক প্রস্তুতি' :
    subPath?.includes('mock')    ? 'মক টেস্ট' :
    subPath?.includes('board')   ? 'বোর্ড প্রশ্ন প্রস্তুতি' :
    subPath?.includes('quiz')    ? 'কুইজ' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26 }}
      className="flex items-center gap-4"
    >
      {/* Brain icon — Mint circle */}
      <div className="w-11 h-11 rounded-full bg-brand-mint flex items-center justify-center
                      flex-shrink-0 shadow-sm">
        <Brain className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          {!isRoot && (
            <>
              <button
                onClick={onBack}
                className="font-bengali text-sm text-brand-mint font-medium hover:underline"
              >
                চর্চাঘর
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            </>
          )}
          <h1 className="font-bengali font-bold text-base text-brand-charcoal">
            {isRoot ? 'চর্চাঘর' : subLabel}
          </h1>
        </div>
        <p className="font-bengali text-xs text-brand-muted">
          {isRoot ? 'অনুশীলনের ধরন বেছে নিন' : 'ফিরে যেতে ট্যাপ করুন'}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Practice Hub Home                                           */
/* ─────────────────────────────────────────────────────────── */
function PracticeHome() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: 'কুইজ দিয়েছি',   value: '42',  color: '#00C9A7' },
          { label: 'সঠিক উত্তর',     value: '78%', color: '#6366f1' },
          { label: 'মক টেস্ট',       value: '6',   color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-card p-3 text-center">
            <p className="font-data font-bold text-lg" style={{ color: s.color }}>{s.value}</p>
            <p className="font-bengali text-[10px] text-brand-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            index={i}
            onClick={() => navigate(cat.path)}
          />
        ))}
      </div>

      {/* Motivational strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl px-5 py-4 flex items-center gap-4"
        style={{ backgroundColor: '#F4F2FF' }}
      >
        <span className="text-2xl">🎯</span>
        <div className="flex-1">
          <p className="font-bengali font-semibold text-sm text-purple-800">
            আজ কমপক্ষে ১টি কুইজ দিন
          </p>
          <p className="font-bengali text-xs text-purple-500 mt-0.5">
            ধারাবাহিক অনুশীলনই সাফল্যের চাবিকাঠি।
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  PracticeView root — nested routes                           */
/* ─────────────────────────────────────────────────────────── */
export default function PracticeView() {
  const navigate = useNavigate();
  const location = useLocation();

  /* Determine if we're in a sub-route */
  const isRoot = location.pathname === '/practice' ||
                 location.pathname === '/practice/';

  return (
    <div className="min-h-screen bg-brand-base px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Hub Header */}
        <PracticeHeader
          subPath={isRoot ? null : location.pathname}
          onBack={() => navigate('/practice')}
        />

        {/* Sub-routes */}
        <AnimatePresence mode="wait">
          <Routes>
            <Route index element={<PracticeHome />} />
            <Route path="chapter"         element={<ChapterPractice />} />
            <Route path="chapter/:subjectId" element={<ChapterPractice />} />
            <Route path="mock"            element={<MockTestWizard />} />
            <Route path="board"           element={<BoardQuestions />} />
            {/* Quiz runner — placeholder */}
            <Route
              path="quiz"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-card p-8 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-mint/10 flex items-center
                                  justify-center mx-auto">
                    <Brain className="w-8 h-8 text-brand-mint" strokeWidth={2} />
                  </div>
                  <p className="font-bengali font-bold text-lg text-brand-charcoal">
                    কুইজ ইঞ্জিন
                  </p>
                  <p className="font-bengali text-sm text-brand-muted max-w-xs mx-auto">
                    Tutor LMS কুইজ রানার এখানে ইন্টিগ্রেট হবে। পেলোড প্রস্তুত।
                  </p>
                  <button
                    onClick={() => navigate('/practice')}
                    className="btn-mint mx-auto flex items-center gap-2"
                  >
                    ফিরে যান
                  </button>
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>

        {/* Bottom pad */}
        <div className="h-4 lg:h-0" />
      </div>
    </div>
  );
}
