/**
 * BoardQuestions — Feature C
 * Dynamic Breadcrumb: চর্চাঘর > বোর্ড প্রশ্ন > [Subject] > [Year] > [Board] > [Type]
 * Drill-down: Subject → Year → Board → Type → Question List
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ArrowRight, BookOpen } from 'lucide-react';
import { BOARDS, YEARS, Q_TYPES }  from '../../data/syllabus';
import { useSubjectFilter }        from '../../hooks/useSubjectFilter';
import FallbackCard                from '../../components/ui/FallbackCard';

/* ─────────────────────────────────────────────────────────── */
/*  Breadcrumb                                                  */
/* ─────────────────────────────────────────────────────────── */
function Breadcrumb({ crumbs, onNavigate }) {
  return (
    <div className="flex items-center flex-wrap gap-1">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          <button
            onClick={() => i < crumbs.length - 1 && onNavigate(i)}
            className={`font-bengali text-xs font-medium transition-colors duration-150
              ${i < crumbs.length - 1
                ? 'text-brand-mint hover:underline cursor-pointer'
                : 'text-brand-charcoal cursor-default'
              }`}
          >
            {crumb}
          </button>
          {i < crumbs.length - 1 && (
            <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Selection Grid — generic                                    */
/* ─────────────────────────────────────────────────────────── */
function SelectionGrid({ items, onSelect, columns = 2 }) {
  return (
    <div className={`grid gap-3`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items.map((item, i) => (
        <motion.button
          key={item.id || item}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          onClick={() => onSelect(item)}
          className="bg-white rounded-2xl shadow-card px-4 py-4 flex items-center gap-3
                     hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 text-left"
        >
          {item.icon && <span className="text-xl">{item.icon}</span>}
          <div className="flex-1 min-w-0">
            <p className="font-bengali text-sm font-semibold text-brand-charcoal truncate">
              {item.label || item}
            </p>
            {item.sub && (
              <p className="font-data text-[10px] text-brand-muted">{item.sub}</p>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
        </motion.button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Mock question list                                          */
/* ─────────────────────────────────────────────────────────── */
function QuestionList({ subject, year, board, type }) {
  const mockQuestions = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    no: i + 1,
    text: `${year} সালের ${board} বোর্ডের ${subject?.label || ''} প্রশ্নপত্র থেকে ${type} প্রশ্ন নং ${i + 1}। এটি একটি নমুনা প্রশ্ন যা Tutor LMS API থেকে লোড হবে।`,
    marks: type === 'MCQ' ? 1 : 10,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {mockQuestions.map(q => (
        <div key={q.id} className="bg-white rounded-2xl shadow-card p-4 flex gap-4">
          <div className="w-7 h-7 rounded-lg bg-brand-lavender flex items-center justify-center
                          flex-shrink-0">
            <span className="font-data text-xs font-bold text-purple-500">{q.no}</span>
          </div>
          <div className="flex-1">
            <p className="font-bengali text-sm text-brand-charcoal leading-relaxed">{q.text}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-data text-[10px] font-semibold text-brand-muted">
                নম্বর: {q.marks}
              </span>
              <button className="btn-mint !px-3 !py-1.5 !text-xs">
                উত্তর দেখুন
              </button>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  BoardQuestions root                                         */
/* ─────────────────────────────────────────────────────────── */
export default function BoardQuestions() {
  const { subjects } = useSubjectFilter();

  /* Drill-down state */
  const [selSubject, setSelSubject] = useState(null);
  const [selYear,    setSelYear]    = useState(null);
  const [selBoard,   setSelBoard]   = useState(null);
  const [selType,    setSelType]    = useState(null);

  /* Current depth */
  const depth =
    selType    ? 4 :
    selBoard   ? 3 :
    selYear    ? 2 :
    selSubject ? 1 : 0;

  /* Breadcrumb items */
  const crumbs = [
    'বোর্ড প্রশ্ন',
    selSubject && selSubject.label,
    selYear    && `${selYear} সাল`,
    selBoard   && selBoard,
    selType    && selType,
  ].filter(Boolean);

  /* Navigate to a crumb index */
  const navigateToCrumb = (idx) => {
    if (idx === 0) { setSelSubject(null); setSelYear(null); setSelBoard(null); setSelType(null); }
    if (idx === 1) { setSelYear(null); setSelBoard(null); setSelType(null); }
    if (idx === 2) { setSelBoard(null); setSelType(null); }
    if (idx === 3) { setSelType(null); }
  };

  /* Back button */
  const goBack = () => navigateToCrumb(depth - 2);

  /* Year items */
  const yearItems = YEARS.map(y => ({ id: y, label: `${y} সাল`, sub: 'এইচএসসি' }));

  /* Board items */
  const boardItems = BOARDS.map(b => ({ id: b, label: b + ' বোর্ড' }));

  /* Type items */
  const typeItems = Q_TYPES.map(t => ({ id: t, label: t }));

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        {depth > 0 && (
          <button
            onClick={goBack}
            className="w-8 h-8 rounded-xl bg-white shadow-card flex items-center justify-center
                       hover:shadow-lift transition-all duration-150 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-brand-charcoal" />
          </button>
        )}
        <Breadcrumb crumbs={crumbs} onNavigate={navigateToCrumb} />
      </div>

      {/* ── Depth 0: Subject ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {depth === 0 && (
          <motion.div key="subjects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="font-bengali text-sm font-semibold text-brand-charcoal mb-3">
              বিষয় বেছে নিন
            </p>
            <SelectionGrid
              items={subjects.map(s => ({ ...s, sub: `${Object.values(YEARS).length} বছর` }))}
              onSelect={setSelSubject}
              columns={2}
            />
          </motion.div>
        )}

        {/* ── Depth 1: Year ────────────────────────────── */}
        {depth === 1 && (
          <motion.div key="years" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="font-bengali text-sm font-semibold text-brand-charcoal mb-3">
              সাল বেছে নিন
            </p>
            <SelectionGrid items={yearItems} onSelect={(y) => setSelYear(y.id)} columns={2} />
          </motion.div>
        )}

        {/* ── Depth 2: Board ───────────────────────────── */}
        {depth === 2 && (
          <motion.div key="boards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="font-bengali text-sm font-semibold text-brand-charcoal mb-3">
              বোর্ড বেছে নিন
            </p>
            <SelectionGrid items={boardItems} onSelect={(b) => setSelBoard(b.label)} columns={2} />
          </motion.div>
        )}

        {/* ── Depth 3: Type ────────────────────────────── */}
        {depth === 3 && (
          <motion.div key="types" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="font-bengali text-sm font-semibold text-brand-charcoal mb-3">
              প্রশ্নের ধরন
            </p>
            <SelectionGrid items={typeItems} onSelect={(t) => setSelType(t.label)} columns={3} />
          </motion.div>
        )}

        {/* ── Depth 4: Questions ───────────────────────── */}
        {depth === 4 && (
          <motion.div key="questions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="font-bengali text-xs text-brand-muted mb-3">
              {selSubject?.label} · {selYear} সাল · {selBoard} · {selType}
            </p>
            <QuestionList
              subject={selSubject} year={selYear}
              board={selBoard}     type={selType}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
