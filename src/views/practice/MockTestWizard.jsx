/**
 * MockTestWizard — Feature B
 * 4-Step Stepper:
 *   Step 1: Subject & Type (multi-select subjects, MCQ/CQ/Both)
 *   Step 2: Chapter/Topic  (accordion UI with checkboxes)
 *   Step 3: Config         (sliders, negative marking, timer)
 *   Step 4: Summary        (review table + launch)
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence }  from 'framer-motion';
import { useNavigate }              from 'react-router-dom';
import {
  Check, ChevronRight, ChevronDown, ChevronLeft,
  Minus, Plus, Toggle, Clock, AlertTriangle, Rocket,
} from 'lucide-react';
import { SYLLABUS }         from '../../data/syllabus';
import { useSubjectFilter } from '../../hooks/useSubjectFilter';

/* ─────────────────────────────────────────────────────────── */
/*  Step indicator                                              */
/* ─────────────────────────────────────────────────────────── */
const STEPS = [
  { label: 'বিষয় ও ধরন' },
  { label: 'অধ্যায়'       },
  { label: 'কনফিগ'       },
  { label: 'সারসংক্ষেপ'  },
];

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              {/* Bubble */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center
                           font-data text-xs font-bold transition-all duration-300"
                style={{
                  backgroundColor: done ? '#00C9A7' : active ? '#1F1F1F' : '#f1f5f9',
                  color:           done || active ? '#ffffff' : '#94a3b8',
                }}
              >
                {done ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
              </div>
              {/* Label */}
              <span
                className="font-bengali text-[10px] mt-1 font-medium whitespace-nowrap"
                style={{ color: active ? '#29262d' : '#94a3b8' }}
              >
                {s.label}
              </span>
            </div>
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-1 mb-4 transition-all duration-300"
                style={{ backgroundColor: i < current ? '#00C9A7' : '#e2e8f0' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Step 1: Subject & Type                                      */
/* ─────────────────────────────────────────────────────────── */
function Step1({ subjects, selSubjects, setSelSubjects, qType, setQType, onNext }) {
  const Q_TYPES = [
    { id: 'MCQ',  label: 'MCQ'   },
    { id: 'CQ',   label: 'CQ'    },
    { id: 'Both', label: 'দুটোই' },
  ];

  const toggleSub = (id) =>
    setSelSubjects(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      {/* Subject multi-select */}
      <div>
        <p className="font-bengali font-semibold text-sm text-brand-charcoal mb-3">
          বিষয় বেছে নিন (একাধিক)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {subjects.map(sub => {
            const sel = selSubjects.includes(sub.id);
            return (
              <button
                key={sub.id}
                onClick={() => toggleSub(sub.id)}
                className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl
                           border-2 transition-all duration-150 text-left"
                style={{
                  borderColor:     sel ? '#00C9A7' : '#e2e8f0',
                  backgroundColor: sel ? '#E6FBF7' : '#ffffff',
                }}
              >
                <span className="text-lg">{sub.icon}</span>
                <span
                  className="font-bengali text-xs font-medium truncate"
                  style={{ color: sel ? '#00C9A7' : '#64748b' }}
                >
                  {sub.label}
                </span>
                {sel && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-mint
                                  flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Q Type */}
      <div>
        <p className="font-bengali font-semibold text-sm text-brand-charcoal mb-3">
          প্রশ্নের ধরন
        </p>
        <div className="flex gap-3">
          {Q_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setQType(t.id)}
              className="flex-1 py-2.5 rounded-xl font-bengali text-sm font-semibold
                         border-2 transition-all duration-150"
              style={{
                borderColor:     qType === t.id ? '#00C9A7' : '#e2e8f0',
                backgroundColor: qType === t.id ? '#00C9A7' : '#ffffff',
                color:           qType === t.id ? '#ffffff' : '#64748b',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={selSubjects.length === 0}
        onClick={onNext}
        className="btn-mint w-full disabled:opacity-40 disabled:cursor-not-allowed
                   disabled:hover:translate-y-0 disabled:hover:shadow-none
                   flex items-center justify-center gap-2"
      >
        পরবর্তী <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Step 2: Chapter/Topic accordion                             */
/* ─────────────────────────────────────────────────────────── */
function Step2({ selSubjects, selChapters, setSelChapters, subjects, onNext, onBack }) {
  const [openSub, setOpenSub] = useState(selSubjects[0] || null);

  const toggle = (chId) =>
    setSelChapters(prev =>
      prev.includes(chId) ? prev.filter(c => c !== chId) : [...prev, chId]
    );

  const toggleAllForSub = (subId) => {
    const chaps = SYLLABUS[subId]?.chapters || [];
    const ids   = chaps.map(c => c.id);
    const allIn = ids.every(id => selChapters.includes(id));
    setSelChapters(prev =>
      allIn ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
    >
      <p className="font-bengali font-semibold text-sm text-brand-charcoal">
        অধ্যায় বেছে নিন
      </p>

      {/* Accordion per subject */}
      {selSubjects.map(subId => {
        const sub    = subjects.find(s => s.id === subId);
        const chaps  = SYLLABUS[subId]?.chapters || [];
        const isOpen = openSub === subId;
        const selCount = chaps.filter(c => selChapters.includes(c.id)).length;

        return (
          <div key={subId} className="bg-white rounded-2xl shadow-card overflow-hidden">
            {/* Accordion header */}
            <button
              onClick={() => setOpenSub(isOpen ? null : subId)}
              className="w-full flex items-center justify-between px-4 py-3.5"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{sub?.icon || '📚'}</span>
                <div className="text-left">
                  <p className="font-bengali font-semibold text-sm text-brand-charcoal">
                    {sub?.label || subId}
                  </p>
                  <p className="font-data text-[10px] text-brand-muted">
                    {selCount}/{chaps.length} টি বেছে নেওয়া হয়েছে
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selCount === chaps.length && (
                  <span className="font-bengali text-[10px] font-semibold text-brand-mint
                                   bg-green-50 px-2 py-0.5 rounded-full">সব</span>
                )}
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.span>
              </div>
            </button>

            {/* Accordion body */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  {/* Select all row */}
                  <div className="px-4 pb-2">
                    <button
                      onClick={() => toggleAllForSub(subId)}
                      className="font-bengali text-xs text-brand-mint font-semibold
                                 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      {selCount === chaps.length ? 'সব বাদ দিন' : 'সব বেছে নিন'}
                    </button>
                  </div>

                  {/* Chapter list */}
                  <div className="px-4 pb-4 space-y-2">
                    {chaps.map(ch => {
                      const sel = selChapters.includes(ch.id);
                      return (
                        <button
                          key={ch.id}
                          onClick={() => toggle(ch.id)}
                          className="w-full flex items-center gap-3 py-2.5 px-3
                                     rounded-xl hover:bg-brand-base transition-colors duration-150"
                        >
                          <div
                            className="w-4 h-4 rounded border-2 flex items-center justify-center
                                       flex-shrink-0 transition-all duration-150"
                            style={{
                              borderColor:     sel ? '#00C9A7' : '#d1d5db',
                              backgroundColor: sel ? '#00C9A7' : 'transparent',
                            }}
                          >
                            {sel && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                          </div>
                          <span className="font-bengali text-xs text-brand-charcoal text-left flex-1">
                            {ch.label}
                          </span>
                          <span className="font-data text-[10px] text-brand-muted flex-shrink-0">
                            {ch.mcqCount}Q
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Nav */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 font-bengali text-sm
                     font-semibold text-brand-muted hover:bg-brand-base transition-all duration-150
                     flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> পিছনে
        </button>
        <button
          onClick={onNext}
          className="flex-1 btn-mint flex items-center justify-center gap-2"
        >
          পরবর্তী <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Step 3: Config                                              */
/* ─────────────────────────────────────────────────────────── */
function Step3({ config, setConfig, onNext, onBack }) {
  const update = (key, val) => setConfig(prev => ({ ...prev, [key]: val }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      {/* Question count slider */}
      <div className="bg-white rounded-2xl shadow-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-bengali font-semibold text-sm text-brand-charcoal">
            প্রশ্নের সংখ্যা
          </p>
          <span className="font-data font-bold text-lg text-brand-mint">
            {config.questionCount}
          </span>
        </div>
        <input
          type="range" min={10} max={200} step={5}
          value={config.questionCount}
          onChange={e => update('questionCount', Number(e.target.value))}
          className="w-full accent-brand-mint h-2 rounded-full"
        />
        <div className="flex justify-between font-data text-[10px] text-brand-muted">
          <span>১০</span><span>২০০</span>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-white rounded-2xl shadow-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-muted" />
            <p className="font-bengali font-semibold text-sm text-brand-charcoal">
              সময় (মিনিট)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => update('timer', Math.max(5, config.timer - 5))}
              className="w-8 h-8 rounded-xl bg-brand-base hover:bg-gray-200
                         flex items-center justify-center transition-colors duration-150"
            >
              <Minus className="w-3.5 h-3.5 text-brand-charcoal" />
            </button>
            <span className="font-data font-bold text-base text-brand-charcoal w-8 text-center">
              {config.timer}
            </span>
            <button
              onClick={() => update('timer', Math.min(180, config.timer + 5))}
              className="w-8 h-8 rounded-xl bg-brand-base hover:bg-gray-200
                         flex items-center justify-center transition-colors duration-150"
            >
              <Plus className="w-3.5 h-3.5 text-brand-charcoal" />
            </button>
          </div>
        </div>
      </div>

      {/* Negative marking toggle */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <p className="font-bengali font-semibold text-sm text-brand-charcoal">
                নেগেটিভ মার্কিং
              </p>
            </div>
            <p className="font-bengali text-xs text-brand-muted mt-0.5 ml-6">
              প্রতি ভুল উত্তরে −০.২৫
            </p>
          </div>
          {/* Custom toggle */}
          <button
            onClick={() => update('negative', !config.negative)}
            className="relative w-12 h-6 rounded-full transition-all duration-200 flex-shrink-0"
            style={{ backgroundColor: config.negative ? '#00C9A7' : '#e2e8f0' }}
          >
            <motion.div
              animate={{ x: config.negative ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>
      </div>

      {/* Nav */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 font-bengali text-sm
                     font-semibold text-brand-muted hover:bg-brand-base transition-all duration-150
                     flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> পিছনে
        </button>
        <button
          onClick={onNext}
          className="flex-1 btn-mint flex items-center justify-center gap-2"
        >
          পরবর্তী <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Step 4: Summary & Launch                                    */
/* ─────────────────────────────────────────────────────────── */
function Step4({ selSubjects, selChapters, qType, config, subjects, onBack, onLaunch }) {
  const rows = selSubjects.map(subId => {
    const sub   = subjects.find(s => s.id === subId);
    const chaps = (SYLLABUS[subId]?.chapters || [])
      .filter(c => selChapters.length === 0 || selChapters.includes(c.id));
    return { sub, chaps, count: chaps.length };
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <p className="font-bengali font-semibold text-base text-brand-charcoal">
        সারসংক্ষেপ
      </p>

      {/* Summary table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 font-bengali text-xs text-brand-muted font-semibold">বিষয়</th>
              <th className="text-center px-4 py-3 font-bengali text-xs text-brand-muted font-semibold">অধ্যায়</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ sub, count }, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3 font-bengali text-sm text-brand-charcoal">
                  <span className="mr-2">{sub?.icon}</span>{sub?.label || '—'}
                </td>
                <td className="px-4 py-3 text-center font-data text-sm font-semibold text-brand-mint">
                  {count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Config summary chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: `ধরন: ${qType}` },
          { label: `প্রশ্ন: ${config.questionCount}` },
          { label: `সময়: ${config.timer} মিনিট` },
          { label: config.negative ? 'নেগেটিভ: চালু' : 'নেগেটিভ: বন্ধ',
            highlight: config.negative },
        ].map((c, i) => (
          <span
            key={i}
            className="font-bengali text-xs font-semibold px-3 py-1.5 rounded-xl"
            style={{
              backgroundColor: c.highlight ? '#FFF3E0' : '#F4F7FB',
              color:           c.highlight ? '#e65100' : '#64748b',
            }}
          >
            {c.label}
          </span>
        ))}
      </div>

      {/* Nav */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 font-bengali text-sm
                     font-semibold text-brand-muted hover:bg-brand-base transition-all duration-150
                     flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> পিছনে
        </button>
        <button
          onClick={onLaunch}
          className="flex-1 btn-mint flex items-center justify-center gap-2"
        >
          <Rocket className="w-4 h-4" /> কুইজ শুরু করুন
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  MockTestWizard — root                                       */
/* ─────────────────────────────────────────────────────────── */
export default function MockTestWizard() {
  const navigate           = useNavigate();
  const { subjects }       = useSubjectFilter();

  const [step,        setStep]        = useState(0);
  const [selSubjects, setSelSubjects] = useState([]);
  const [qType,       setQType]       = useState('MCQ');
  const [selChapters, setSelChapters] = useState([]);
  const [config,      setConfig]      = useState({
    questionCount: 30,
    timer:         20,
    negative:      false,
  });

  const launch = () => {
    const payload = {
      subjects: selSubjects,
      chapters: selChapters,
      qType,
      questionCount: config.questionCount,
      timer:         config.timer,
      negative:      config.negative,
    };
    navigate('/practice/quiz', { state: { payload } });
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="bg-white rounded-2xl shadow-card p-4">
        <StepBar current={step} />
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <Step1
            key="step1"
            subjects={subjects}
            selSubjects={selSubjects} setSelSubjects={setSelSubjects}
            qType={qType} setQType={setQType}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <Step2
            key="step2"
            subjects={subjects}
            selSubjects={selSubjects}
            selChapters={selChapters} setSelChapters={setSelChapters}
            onNext={() => setStep(2)} onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <Step3
            key="step3"
            config={config} setConfig={setConfig}
            onNext={() => setStep(3)} onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step4
            key="step4"
            subjects={subjects}
            selSubjects={selSubjects} selChapters={selChapters}
            qType={qType} config={config}
            onBack={() => setStep(2)} onLaunch={launch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
