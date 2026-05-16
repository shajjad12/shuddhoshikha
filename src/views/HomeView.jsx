/**
 * HomeView — Shuddhoshikha
 * Module 2: হোম (Home)
 *
 * Sections:
 *  1. Welcome Card — gradient banner + SVG circular progress ring
 *  2. Stats Grid   — 4 white cards (Total Courses, Success Rate, Quiz %, Streak)
 *  3. Continue Learning — last-touched course(s)
 *  4. Quick Access — subject shortcuts filtered by profile
 */
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Target,
  Zap,
  Flame,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  Brain,
} from 'lucide-react';
import { useAuth }          from '../context/AuthContext';
import { useSubjectFilter } from '../hooks/useSubjectFilter';
import FallbackCard         from '../components/ui/FallbackCard';

/* ─────────────────────────────────────────────────────────── */
/*  WordPress API helpers                                       */
/* ─────────────────────────────────────────────────────────── */
const WP_BASE = process.env.REACT_APP_WP_BASE_URL || 'https://your-wp-site.com/wp-json';

async function fetchDashboardStats(token) {
  try {
    const res = await fetch(`${WP_BASE}/shuddhoshikha/v1/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    /* Return mock data so UI always renders during dev */
    return {
      totalCourses:    12,
      successRate:     78,
      quizCompletion:  64,
      currentStreak:   7,
      overallProgress: 42,
      continueCourses: [
        {
          id: 1,
          title: 'পদার্থবিজ্ঞান - ১ম পত্র',
          progress: 68,
          thumbnail: null,
          lastLesson: 'নিউটনের গতিসূত্র',
        },
      ],
    };
  }
}

/* ─────────────────────────────────────────────────────────── */
/*  SVG Circular Progress Ring                                  */
/* ─────────────────────────────────────────────────────────── */
function ProgressRing({ percent = 0, size = 96, stroke = 7 }) {
  const radius      = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset      = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="#ffffff"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-data font-bold text-white text-xl leading-none">
          {percent}%
        </span>
        <span className="font-bengali text-white/70 text-[10px] leading-tight mt-0.5">
          সম্পূর্ণ
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Stat Card                                                   */
/* ─────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, iconBg, label, value, unit, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y:  0 }}
      transition={{ duration: 0.28, delay }}
      className="bg-white rounded-2xl shadow-card p-5 flex flex-col gap-3
                 hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Icon bubble */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-5 h-5" style={{ color: iconBgToColor(iconBg) }} strokeWidth={2} />
      </div>

      {/* Value */}
      <div>
        <div className="flex items-baseline gap-1">
          <span className="font-data font-bold text-2xl text-brand-charcoal leading-none">
            {value}
          </span>
          {unit && (
            <span className="font-data text-xs text-brand-muted font-medium">{unit}</span>
          )}
        </div>
        <p className="font-bengali text-sm text-brand-muted mt-1 leading-snug">{label}</p>
      </div>
    </motion.div>
  );
}

/* map pastel bg → icon color */
function iconBgToColor(bg) {
  const map = {
    '#E8F5E9': '#2e7d32',
    '#E3F2FD': '#1565c0',
    '#FFF3E0': '#e65100',
    '#FCE4EC': '#c62828',
    '#EDE7F6': '#4527a0',
    '#F4F2FF': '#6d28d9',
    '#E0F7FA': '#006064',
    '#F3E5F5': '#6a1b9a',
  };
  return map[bg] || '#374151';
}

/* ─────────────────────────────────────────────────────────── */
/*  Continue Learning Card                                      */
/* ─────────────────────────────────────────────────────────── */
function ContinueCard({ course, index }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y:  0 }}
      transition={{ duration: 0.26, delay: 0.15 + index * 0.07 }}
      className="bg-white rounded-2xl shadow-card overflow-hidden
                 hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Top gradient banner */}
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, #00C9A7 0%, #00b4d8 100%)`,
          width: `${course.progress}%`,
          minWidth: '8%',
          transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      {/* Track */}
      <div className="h-1 w-full bg-gray-100 -mt-1" />

      <div className="p-5 flex items-center gap-4">
        {/* Thumbnail / placeholder */}
        <div
          className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{
            background: course.thumbnail
              ? `url(${course.thumbnail}) center/cover`
              : 'linear-gradient(135deg,#6366f1 0%,#3b82f6 100%)',
          }}
        >
          {!course.thumbnail && (
            <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bengali font-semibold text-sm text-brand-charcoal truncate">
            {course.title}
          </p>
          <p className="font-bengali text-xs text-brand-muted mt-0.5 truncate">
            শেষ পাঠ: {course.lastLesson}
          </p>
          {/* Progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#00C9A7,#00b4d8)' }}
              />
            </div>
            <span className="font-data text-[11px] font-semibold text-brand-mint flex-shrink-0">
              {course.progress}%
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(`/courses/${course.id}`)}
          className="btn-mint flex-shrink-0 flex items-center gap-1.5 !px-4 !py-2 !text-xs"
        >
          চালিয়ে যান
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Quick Subject Chip                                          */
/* ─────────────────────────────────────────────────────────── */
function SubjectChip({ subject, delay = 0 }) {
  const navigate = useNavigate();
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22, delay }}
      onClick={() => navigate(`/practice/chapter/${subject.slug}`)}
      className="bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3
                 hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 text-left"
    >
      <span className="text-xl">{subject.icon}</span>
      <span className="font-bengali text-sm font-medium text-brand-charcoal">
        {subject.label}
      </span>
      <ChevronRight className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0" />
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  HomeView                                                    */
/* ─────────────────────────────────────────────────────────── */
export default function HomeView() {
  const { profile, token } = useAuth();
  const { subjects, isEmpty } = useSubjectFilter();
  const navigate = useNavigate();

  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched            = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchDashboardStats(token).then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, [token]);

  /* ── Greeting time ─────────────────────────────────────── */
  const hour = new Date().getHours();
  const timeGreet =
    hour < 12 ? 'শুভ সকাল' :
    hour < 17 ? 'শুভ বিকেল' :
    hour < 20 ? 'শুভ সন্ধ্যা' : 'শুভ রাত্রি';

  /* ── Stat cards config ─────────────────────────────────── */
  const STAT_CARDS = [
    {
      icon:   BookOpen,
      iconBg: '#E3F2FD',
      label:  'মোট কোর্স',
      value:  stats?.totalCourses   ?? '—',
      delay:  0.10,
    },
    {
      icon:   TrendingUp,
      iconBg: '#E8F5E9',
      label:  'সাফল্যের হার',
      value:  stats?.successRate    ?? '—',
      unit:   '%',
      delay:  0.16,
    },
    {
      icon:   Target,
      iconBg: '#FFF3E0',
      label:  'কুইজ সম্পন্ন',
      value:  stats?.quizCompletion ?? '—',
      unit:   '%',
      delay:  0.22,
    },
    {
      icon:   Flame,
      iconBg: '#FCE4EC',
      label:  'ধারাবাহিকতা',
      value:  stats?.currentStreak  ?? '—',
      unit:   'দিন',
      delay:  0.28,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-base px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ══════════════════════════════════════════════════
            1. WELCOME CARD — gradient banner
        ══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
            minHeight: 172,
          }}
        >
          {/* Subtle decorative blobs */}
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #00C9A7, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 left-24 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
          />

          <div className="relative z-10 flex items-center justify-between px-7 py-7 gap-4">

            {/* Left: Greeting */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {/* Time-aware greeting */}
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x:  0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="font-bengali text-white/60 text-sm font-medium"
              >
                {timeGreet} 👋
              </motion.p>

              {/* Main greeting */}
              <motion.h1
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x:  0 }}
                transition={{ delay: 0.22, duration: 0.3 }}
                className="font-bengali font-bold text-white leading-snug"
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}
              >
                আসসালামুআলাইকুম,<br />
                <span style={{ color: '#00C9A7' }}>
                  {profile?.displayName || 'শিক্ষার্থী'}
                </span>!
              </motion.h1>

              {/* Sub info */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32, duration: 0.28 }}
                className="font-bengali text-white/50 text-xs mt-1 leading-relaxed"
              >
                {profile?.sh_class
                  ? `শ্রেণি ${profile.sh_class} • ${profile.sh_group || 'গ্রুপ নির্ধারিত হয়নি'}`
                  : 'প্রোফাইল সম্পূর্ণ করুন'}
              </motion.p>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.26 }}
                onClick={() => navigate('/practice')}
                className="mt-3 self-start btn-mint flex items-center gap-2 !py-2 !px-4 !text-xs"
              >
                <Brain className="w-3.5 h-3.5" />
                চর্চা শুরু করুন
              </motion.button>
            </div>

            {/* Right: Progress Ring */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              {loading ? (
                <div className="w-24 h-24 rounded-full bg-white/10 animate-pulse" />
              ) : (
                <>
                  <ProgressRing percent={stats?.overallProgress ?? 0} size={96} stroke={7} />
                  <p className="font-bengali text-white/50 text-[10px] text-center">
                    সিলেবাস অগ্রগতি
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════
            2. STATS GRID — 4-column
        ══════════════════════════════════════════════════ */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card p-5 h-[110px] animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gray-100 mb-3" />
                <div className="h-6 w-16 bg-gray-100 rounded-lg mb-2" />
                <div className="h-3 w-24 bg-gray-50 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map((card, i) => (
              <StatCard key={i} {...card} />
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            3. CONTINUE LEARNING
        ══════════════════════════════════════════════════ */}
        {!loading && stats?.continueCourses?.length > 0 && (
          <section>
            {/* Section header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bengali font-semibold text-base text-brand-charcoal">
                চালিয়ে যান
              </h2>
              <button
                onClick={() => navigate('/courses')}
                className="font-bengali text-xs text-brand-mint font-medium
                           flex items-center gap-1 hover:underline"
              >
                সব কোর্স <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {stats.continueCourses.map((course, i) => (
                <ContinueCard key={course.id} course={course} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            4. QUICK SUBJECT ACCESS
        ══════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bengali font-semibold text-base text-brand-charcoal">
              বিষয়ভিত্তিক চর্চা
            </h2>
            <button
              onClick={() => navigate('/practice')}
              className="font-bengali text-xs text-brand-mint font-medium
                         flex items-center gap-1 hover:underline"
            >
              সব বিষয় <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isEmpty ? (
            <FallbackCard />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {subjects.slice(0, 6).map((subject, i) => (
                <SubjectChip
                  key={subject.id}
                  subject={subject}
                  delay={0.06 * i}
                />
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════
            5. MOTIVATIONAL FOOTER STRIP
        ══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-2xl px-6 py-4 flex items-center gap-4"
          style={{ backgroundColor: '#F4F2FF' }}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-purple-500" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bengali font-semibold text-sm text-purple-800">
              আজকের লক্ষ্য পূরণ করুন!
            </p>
            <p className="font-bengali text-xs text-purple-500 mt-0.5">
              প্রতিদিন অনুশীলন করলে পরীক্ষায় সাফল্য নিশ্চিত।
            </p>
          </div>
          <button
            onClick={() => navigate('/practice')}
            className="btn-mint !px-4 !py-2 !text-xs flex-shrink-0"
          >
            শুরু করুন
          </button>
        </motion.div>

        {/* Bottom padding for mobile nav */}
        <div className="h-4 lg:h-0" />
      </div>
    </div>
  );
}
