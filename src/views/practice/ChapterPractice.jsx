/**
 * ChapterPractice — Feature A
 * Subject → Chapter → Mode (Quick Practice / Unlimited Quiz Test)
 * Reads chapters from SYLLABUS JSON.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, Zap, Clock,
  BookOpen, CheckSquare, ArrowRight,
} from 'lucide-react';
import { SYLLABUS }         from '../../data/syllabus';
import { useSubjectFilter } from '../../hooks/useSubjectFilter';

/* ── Mode card ─────────────────────────────────────────────── */
function ModeCard({ icon: Icon, title, desc, color, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -3, boxShadow: '0 8px 24px 0 rgba(0,0,0,0.10)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-card p-5 flex items-center gap-4 text-left"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + '22' }}
      >
        <Icon className="w-6 h-6" style={{ color }} strokeWidth={2} />
      </div>
      <div className="flex-1">
        <p className="font-bengali font-semibold text-sm text-brand-charcoal">{title}</p>
        <p className="font-bengali text-xs text-brand-muted mt-0.5 leading-snug">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </motion.button>
  );
}

/* ── Chapter row ───────────────────────────────────────────── */
function ChapterRow({ chapter, selected, onToggle }) {
  return (
    <motion.div
      layout
      className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl shadow-card
                 cursor-pointer hover:shadow-lift transition-all duration-150"
      onClick={() => onToggle(chapter.id)}
    >
      <div
        className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150"
        style={{
          borderColor: selected ? '#00C9A7' : '#d1d5db',
          backgroundColor: selected ? '#00C9A7' : 'transparent',
        }}
      >
        {selected && (
          <svg viewBox="0 0 10 8" className="w-3 h-3" fill="none">
            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bengali text-sm font-medium text-brand-charcoal truncate">
          {chapter.label}
        </p>
        <p className="font-data text-[10px] text-brand-muted mt-0.5">
          MCQ: {chapter.mcqCount} · CQ: {chapter.cqCount}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
export default function ChapterPractice() {
  const { subjectId }         = useParams();
  const navigate              = useNavigate();
  const { subjects }          = useSubjectFilter();

  /* Step: 'subject' | 'chapter' | 'mode' */
  const [step,     setStep]    = useState(subjectId ? 'chapter' : 'subject');
  const [selSub,   setSelSub]  = useState(subjectId || null);
  const [selChaps, setSelChaps] = useState([]);

  const syllabusData = selSub ? SYLLABUS[selSub] : null;
  const chapters     = syllabusData?.chapters || [];

  /* Toggle chapter selection */
  const toggleChapter = (id) =>
    setSelChaps(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );

  /* Select all / none */
  const toggleAll = () =>
    setSelChaps(selChaps.length === chapters.length ? [] : chapters.map(c => c.id));

  /* Launch quiz */
  const launch = (mode) => {
    const payload = {
      subject: selSub,
      chapters: selChaps.length ? selChaps : chapters.map(c => c.id),
      mode,                          // 'quick' | 'unlimited'
      timer: mode === 'unlimited' ? 20 : null,
    };
    navigate('/practice/quiz', { state: { payload } });
  };

  /* ── Subject Grid (step 1) ──────────────────────────────── */
  if (step === 'subject') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="font-bengali font-semibold text-base text-brand-charcoal">
          বিষয় বেছে নিন
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects.map((sub, i) => (
            <motion.button
              key={sub.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { setSelSub(sub.id); setStep('chapter'); }}
              className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4
                         hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 text-left"
            >
              <span className="text-2xl">{sub.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bengali font-semibold text-sm text-brand-charcoal">{sub.label}</p>
                {SYLLABUS[sub.id] && (
                  <p className="font-data text-[11px] text-brand-muted mt-0.5">
                    {SYLLABUS[sub.id].chapters.length} টি অধ্যায়
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  /* ── Chapter List (step 2) ──────────────────────────────── */
  if (step === 'chapter') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setStep('subject'); setSelSub(null); setSelChaps([]); }}
            className="w-8 h-8 rounded-xl bg-white shadow-card flex items-center justify-center
                       hover:shadow-lift transition-all duration-150"
          >
            <ChevronLeft className="w-4 h-4 text-brand-charcoal" />
          </button>
          <div>
            <h2 className="font-bengali font-semibold text-base text-brand-charcoal">
              {syllabusData?.label || selSub}
            </h2>
            <p className="font-bengali text-xs text-brand-muted">অধ্যায় বেছে নিন</p>
          </div>
        </div>

        {/* Select all toggle */}
        <button
          onClick={toggleAll}
          className="flex items-center gap-2 font-bengali text-sm text-brand-mint font-medium"
        >
          <CheckSquare className="w-4 h-4" />
          {selChaps.length === chapters.length ? 'সব বাদ দিন' : 'সব বেছে নিন'}
        </button>

        {/* Chapter list */}
        <div className="space-y-2">
          {chapters.map(ch => (
            <ChapterRow
              key={ch.id}
              chapter={ch}
              selected={selChaps.includes(ch.id)}
              onToggle={toggleChapter}
            />
          ))}
        </div>

        {/* Next CTA */}
        <button
          onClick={() => setStep('mode')}
          className="btn-mint w-full flex items-center justify-center gap-2"
        >
          মোড বেছে নিন
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  /* ── Mode Select (step 3) ───────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setStep('chapter')}
          className="w-8 h-8 rounded-xl bg-white shadow-card flex items-center justify-center
                     hover:shadow-lift transition-all duration-150"
        >
          <ChevronLeft className="w-4 h-4 text-brand-charcoal" />
        </button>
        <div>
          <h2 className="font-bengali font-semibold text-base text-brand-charcoal">
            অনুশীলনের ধরন
          </h2>
          <p className="font-bengali text-xs text-brand-muted">
            {selChaps.length || chapters.length} টি অধ্যায় বেছে নেওয়া হয়েছে
          </p>
        </div>
      </div>

      <ModeCard
        icon={Zap}
        title="দ্রুত অনুশীলন"
        desc="নির্বাচিত অধ্যায়ের সব MCQ একসাথে — কোনো টাইমার নেই"
        color="#00C9A7"
        onClick={() => launch('quick')}
      />
      <ModeCard
        icon={Clock}
        title="আনলিমিটেড কুইজ টেস্ট"
        desc="২০ মিনিটের টাইমড কুইজ — পরীক্ষার পরিবেশে অনুশীলন করুন"
        color="#6366f1"
        onClick={() => launch('unlimited')}
      />
    </motion.div>
  );
}
