/**
 * CoursesView — Shuddhoshikha
 * Module 3: কোর্সসমূহ (Courses)
 *
 * - Responsive card grid: Indigo→Blue gradient top, white bottom
 * - Progress bar + Mint "চালিয়ে যান" CTA per card
 * - Subject filter tabs (profile-aware via useSubjectFilter)
 * - Search bar
 * - Skeleton loading
 * - FallbackCard on empty results
 */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, BookOpen, Lock, CheckCircle2,
  ChevronRight, Filter, X, SlidersHorizontal,
} from 'lucide-react';
import { useAuth }          from '../context/AuthContext';
import { useSubjectFilter } from '../hooks/useSubjectFilter';
import FallbackCard         from '../components/ui/FallbackCard';

/* ─────────────────────────────────────────────────────────── */
/*  WP API                                                      */
/* ─────────────────────────────────────────────────────────── */
const WP_BASE = process.env.REACT_APP_WP_BASE_URL || 'https://your-wp-site.com/wp-json';

async function fetchCourses(token, subjectSlug = '') {
  try {
    const url = `${WP_BASE}/tutor/v1/courses?per_page=24${subjectSlug ? `&subject=${subjectSlug}` : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    /* Mock data — dev fallback */
    return MOCK_COURSES;
  }
}

/* ─────────────────────────────────────────────────────────── */
/*  Mock courses                                               */
/* ─────────────────────────────────────────────────────────── */
const MOCK_COURSES = [
  {
    id: 1, title: 'পদার্থবিজ্ঞান - ১ম পত্র', subject: 'physics',
    progress: 68, totalLessons: 42, completedLessons: 28,
    status: 'enrolled', thumbnail: null,
    gradient: 'linear-gradient(135deg,#4f46e5 0%,#3b82f6 100%)',
    instructor: 'জনাব করিম স্যার',
  },
  {
    id: 2, title: 'রসায়ন - ২য় পত্র', subject: 'chemistry',
    progress: 35, totalLessons: 38, completedLessons: 13,
    status: 'enrolled', thumbnail: null,
    gradient: 'linear-gradient(135deg,#7c3aed 0%,#6366f1 100%)',
    instructor: 'জনাব রহমান ম্যাডাম',
  },
  {
    id: 3, title: 'উচ্চতর গণিত', subject: 'hmath',
    progress: 0, totalLessons: 55, completedLessons: 0,
    status: 'locked', thumbnail: null,
    gradient: 'linear-gradient(135deg,#0891b2 0%,#06b6d4 100%)',
    instructor: 'জনাব আলী স্যার',
  },
  {
    id: 4, title: 'বাংলা সাহিত্য', subject: 'bangla',
    progress: 100, totalLessons: 30, completedLessons: 30,
    status: 'completed', thumbnail: null,
    gradient: 'linear-gradient(135deg,#059669 0%,#10b981 100%)',
    instructor: 'জনাব ইসলাম স্যার',
  },
  {
    id: 5, title: 'English Grammar & Writing', subject: 'english',
    progress: 52, totalLessons: 24, completedLessons: 12,
    status: 'enrolled', thumbnail: null,
    gradient: 'linear-gradient(135deg,#d97706 0%,#f59e0b 100%)',
    instructor: 'Mr. Ahmed',
  },
  {
    id: 6, title: 'তথ্য ও যোগাযোগ প্রযুক্তি', subject: 'ict',
    progress: 20, totalLessons: 18, completedLessons: 3,
    status: 'enrolled', thumbnail: null,
    gradient: 'linear-gradient(135deg,#be185d 0%,#ec4899 100%)',
    instructor: 'জনাব হাসান স্যার',
  },
];

/* ─────────────────────────────────────────────────────────── */
/*  Status badge                                               */
/* ─────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const config = {
    enrolled:  { label: 'চলমান',    bg: '#E3F2FD', color: '#1565c0' },
    completed: { label: 'সম্পন্ন', bg: '#E8F5E9', color: '#2e7d32' },
    locked:    { label: 'লক',      bg: '#FFF3E0', color: '#e65100' },
  }[status] || { label: status, bg: '#f1f5f9', color: '#64748b' };

  return (
    <span
      className="font-bengali text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Course Card                                                */
/* ─────────────────────────────────────────────────────────── */
function CourseCard({ course, index }) {
  const navigate  = useNavigate();
  const isLocked  = course.status === 'locked';
  const isDone    = course.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y:  0 }}
      transition={{ duration: 0.26, delay: index * 0.06 }}
      className="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col
                 hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* ── Top gradient half ─────────────────────────── */}
      <div
        className="relative h-36 flex flex-col justify-between p-4"
        style={{ background: course.gradient }}
      >
        {/* Lock / Done overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-2xl">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          </div>
        )}
        {isDone && (
          <div className="absolute top-3 right-3">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="flex justify-between items-start relative z-10">
          <StatusBadge status={course.status} />
          <span className="font-data text-white/70 text-[10px]">
            {course.completedLessons}/{course.totalLessons} পাঠ
          </span>
        </div>

        {/* Title */}
        <div className="relative z-10">
          <h3 className="font-bengali font-bold text-white text-sm leading-snug line-clamp-2">
            {course.title}
          </h3>
          <p className="font-bengali text-white/60 text-[11px] mt-0.5">
            {course.instructor}
          </p>
        </div>
      </div>

      {/* ── Bottom white half ─────────────────────────── */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bengali text-[11px] text-brand-muted">অগ্রগতি</span>
            <span className="font-data text-[11px] font-semibold text-brand-mint">
              {course.progress}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.3 + index * 0.05 }}
              className="h-full rounded-full"
              style={{
                background: isDone
                  ? 'linear-gradient(90deg,#00C9A7,#10b981)'
                  : 'linear-gradient(90deg,#00C9A7,#00b4d8)',
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          disabled={isLocked}
          onClick={() => !isLocked && navigate(`/courses/${course.id}`)}
          className={`
            w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
            font-bengali font-semibold text-sm transition-all duration-200
            ${isLocked
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isDone
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'btn-mint'
            }
          `}
        >
          {isLocked
            ? <><Lock className="w-3.5 h-3.5" /> লক করা</>
            : isDone
              ? <><CheckCircle2 className="w-3.5 h-3.5" /> পুনরায় দেখুন</>
              : <>চালিয়ে যান <ChevronRight className="w-3.5 h-3.5" /></>
          }
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Skeleton Card                                              */
/* ─────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
      <div className="h-36 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-2 bg-gray-100 rounded-full" />
        <div className="h-9 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Filter Tab                                                  */
/* ─────────────────────────────────────────────────────────── */
function FilterTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 px-4 py-2 rounded-xl font-bengali text-sm
                 font-medium transition-colors duration-150"
      style={{
        color:           active ? '#ffffff' : '#64748b',
        backgroundColor: active ? '#1F1F1F' : 'transparent',
      }}
    >
      {!active && (
        <span className="absolute inset-0 rounded-xl hover:bg-brand-hover
                         transition-colors duration-150" />
      )}
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  CoursesView                                                */
/* ─────────────────────────────────────────────────────────── */
export default function CoursesView() {
  const { token }             = useAuth();
  const { subjects, isEmpty } = useSubjectFilter();
  const navigate              = useNavigate();

  const [courses,   setCourses]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const hasFetched = useRef(false);

  /* ── Fetch ─────────────────────────────────────────────── */
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchCourses(token, activeTab === 'all' ? '' : activeTab)
      .then(data => { setCourses(data); setLoading(false); });
  }, [token]);

  /* Re-fetch when subject tab changes */
  const handleTabChange = (slug) => {
    setActiveTab(slug);
    setLoading(true);
    fetchCourses(token, slug === 'all' ? '' : slug)
      .then(data => { setCourses(data); setLoading(false); });
  };

  /* ── Derived filtered list ─────────────────────────────── */
  const filtered = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = !search ||
        c.title.toLowerCase().includes(search.toLowerCase());
      const matchSubject = activeTab === 'all' || c.subject === activeTab;
      const matchStatus  = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchSubject && matchStatus;
    });
  }, [courses, search, activeTab, statusFilter]);

  /* ── Subject tabs (All + profile subjects) ─────────────── */
  const tabs = [
    { id: 'all', label: 'সব কোর্স' },
    ...subjects.map(s => ({ id: s.id, label: s.label, slug: s.slug })),
  ];

  /* ── Status filters ────────────────────────────────────── */
  const STATUS_OPTS = [
    { id: 'all',       label: 'সব'     },
    { id: 'enrolled',  label: 'চলমান'  },
    { id: 'completed', label: 'সম্পন্ন' },
    { id: 'locked',    label: 'লক'     },
  ];

  return (
    <div className="min-h-screen bg-brand-base px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Page header ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-bengali font-bold text-2xl text-brand-charcoal">
              কোর্সসমূহ
            </h1>
            <p className="font-bengali text-sm text-brand-muted mt-0.5">
              আপনার নথিভুক্ত সব কোর্স
            </p>
          </div>
          <div className="font-data text-sm font-semibold text-brand-mint bg-green-50
                          px-3 py-1.5 rounded-xl">
            {loading ? '...' : `${filtered.length} টি`}
          </div>
        </motion.div>

        {/* ── Search + Status filter ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.06 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4
                               text-gray-400" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="কোর্স খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100
                         rounded-xl text-sm font-bengali text-brand-charcoal
                         placeholder:text-gray-400 shadow-card
                         focus:outline-none focus:ring-2 focus:ring-brand-mint/30
                         focus:border-brand-mint transition-all duration-150"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Status dropdown */}
          <div className="flex gap-2">
            {STATUS_OPTS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setStatusFilter(opt.id)}
                className="px-3 py-2.5 rounded-xl font-bengali text-xs font-medium
                           transition-all duration-150 shadow-card"
                style={{
                  backgroundColor: statusFilter === opt.id ? '#1F1F1F' : '#ffffff',
                  color:           statusFilter === opt.id ? '#ffffff' : '#64748b',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Subject filter tabs ───────────────────────── */}
        {!isEmpty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.24 }}
            className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide"
          >
            {tabs.map(tab => (
              <FilterTab
                key={tab.id}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => handleTabChange(tab.slug || tab.id)}
              />
            ))}
          </motion.div>
        )}

        {/* ── Course Grid ───────────────────────────────── */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FallbackCard
                message="এই বিষয়ে কোনো কোর্স পাওয়া যায়নি। অন্য বিষয় বেছে নিন।"
                spinning={false}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom pad mobile */}
        <div className="h-4 lg:h-0" />
      </div>
    </div>
  );
}
