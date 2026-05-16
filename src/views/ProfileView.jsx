/**
 * ProfileView — Shuddhoshikha
 * Module 5: প্রোফাইল (Profile)
 *
 * Apple Settings-style vertical list with 3 sections:
 *   1. ব্যক্তিগত তথ্য       — Name, email, avatar
 *   2. একাডেমিক তথ্য        — 3-tier: Class → Group → Batch
 *   3. আমার জীবনের লক্ষ্য  — Optional subject + goal text
 *
 * - Selected pills: Mint Green background
 * - Save → updateProfile() → cache bust → grid refresh
 * - Onboarding mode: animated "সেটআপ করুন" banner at top
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence }    from 'framer-motion';
import { useLocation, useNavigate }   from 'react-router-dom';
import {
  User, GraduationCap, Target, Camera, Check,
  ChevronRight, LogOut, Save, Sparkles, Shield,
  Bell, HelpCircle, ChevronDown,
} from 'lucide-react';
import { useAuth }    from '../context/AuthContext';
import { SUBJECTS }   from '../hooks/useSubjectFilter';

/* ─────────────────────────────────────────────────────────── */
/*  Data maps                                                   */
/* ─────────────────────────────────────────────────────────── */
const CLASS_OPTIONS  = ['৯', '১০', '১১', '১২'];
const GROUP_OPTIONS  = {
  '৯':  ['বিজ্ঞান', 'মানবিক', 'ব্যবসায় শিক্ষা'],
  '১০': ['বিজ্ঞান', 'মানবিক', 'ব্যবসায় শিক্ষা'],
  '১১': ['বিজ্ঞান', 'মানবিক', 'ব্যবসায় শিক্ষা'],
  '১২': ['বিজ্ঞান', 'মানবিক', 'ব্যবসায় শিক্ষা'],
};
const BATCH_OPTIONS  = ['২০২৪', '২০২৫', '২০২৬', '২০২৭', '২০২৮'];

/* Group → internal slug */
const GROUP_SLUG = {
  'বিজ্ঞান':           'science',
  'মানবিক':            'humanities',
  'ব্যবসায় শিক্ষা':  'commerce',
};

const OPTIONAL_SUBJECTS = Object.values(SUBJECTS.optional);

const GOAL_OPTIONS = [
  'HSC-তে GPA 5.00 পাওয়া',
  'ঢাকা বিশ্ববিদ্যালয়ে ভর্তি',
  'BUET-এ ভর্তি',
  'মেডিকেল কলেজে ভর্তি',
  'সরকারি চাকরি',
  'বিদেশে উচ্চশিক্ষা',
  'উদ্যোক্তা হওয়া',
];

/* ─────────────────────────────────────────────────────────── */
/*  Settings Section wrapper                                    */
/* ─────────────────────────────────────────────────────────── */
function Section({ icon: Icon, iconColor = '#00C9A7', title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-card overflow-hidden"
    >
      {/* Section header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconColor + '22' }}
        >
          <Icon className="w-4 h-4" style={{ color: iconColor }} strokeWidth={2} />
        </div>
        <h2 className="font-bengali font-bold text-sm text-brand-charcoal">{title}</h2>
      </div>
      <div className="px-5 pb-5 space-y-4">{children}</div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Field label                                                 */
/* ─────────────────────────────────────────────────────────── */
function FieldLabel({ children }) {
  return (
    <p className="font-bengali text-xs font-semibold text-brand-muted mb-2">{children}</p>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Text Input                                                  */
/* ─────────────────────────────────────────────────────────── */
function TextInput({ value, onChange, placeholder, disabled }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-2.5 bg-brand-base border border-gray-100 rounded-xl
                 font-bengali text-sm text-brand-charcoal placeholder:text-gray-400
                 focus:outline-none focus:ring-2 focus:ring-brand-mint/30 focus:border-brand-mint
                 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
    />
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Pill selector                                               */
/* ─────────────────────────────────────────────────────────── */
function PillGroup({ options, selected, onSelect, disabled = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const label  = typeof opt === 'string' ? opt : opt.label;
        const val    = typeof opt === 'string' ? opt : opt.id;
        const active = selected === val;
        return (
          <motion.button
            key={val}
            whileTap={{ scale: 0.95 }}
            onClick={() => !disabled && onSelect(active ? null : val)}
            disabled={disabled}
            className="px-4 py-2 rounded-xl font-bengali text-sm font-medium
                       transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: active ? '#00C9A7' : '#F4F7FB',
              color:           active ? '#ffffff' : '#64748b',
              boxShadow:       active ? '0 2px 8px rgba(0,201,167,0.3)' : 'none',
            }}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Settings Row (for non-edit items)                           */
/* ─────────────────────────────────────────────────────────── */
function SettingsRow({ icon: Icon, iconColor, label, value, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 px-1 border-b border-gray-50
                 last:border-0 hover:bg-brand-base rounded-xl transition-colors duration-150"
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: (iconColor || '#64748b') + '18' }}
      >
        <Icon
          className="w-4 h-4"
          style={{ color: danger ? '#ff0000' : iconColor || '#64748b' }}
          strokeWidth={2}
        />
      </div>
      <span
        className="flex-1 font-bengali text-sm font-medium text-left"
        style={{ color: danger ? '#ff0000' : '#29262d' }}
      >
        {label}
      </span>
      {value && (
        <span className="font-bengali text-xs text-brand-muted mr-1">{value}</span>
      )}
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  ProfileView                                                  */
/* ─────────────────────────────────────────────────────────── */
export default function ProfileView() {
  const { profile, updateProfile, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isOnboarding = location.state?.onboarding === true;

  /* ── Local form state ──────────────────────────────────── */
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [selClass,    setSelClass]    = useState(profile?.sh_class    || null);
  const [selGroup,    setSelGroup]    = useState(null); // Bengali label
  const [selBatch,    setSelBatch]    = useState(profile?.sh_batch    || null);
  const [selOptional, setSelOptional] = useState(profile?.sh_optional || null);
  const [selGoal,     setSelGoal]     = useState('');
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);

  /* Initialise group from slug */
  useEffect(() => {
    if (profile?.sh_group) {
      const bengaliLabel = Object.entries(GROUP_SLUG)
        .find(([, slug]) => slug === profile.sh_group)?.[0];
      if (bengaliLabel) setSelGroup(bengaliLabel);
    }
  }, [profile?.sh_group]);

  /* Reset group when class changes */
  const handleClassChange = (val) => {
    setSelClass(val);
    setSelGroup(null);
  };

  /* Available groups for current class */
  const groupOptions = selClass ? (GROUP_OPTIONS[selClass] || []) : [];

  /* ── Save ──────────────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        sh_class:    selClass    || '',
        sh_group:    selGroup    ? (GROUP_SLUG[selGroup] || selGroup) : '',
        sh_batch:    selBatch    || '',
        sh_optional: selOptional || '',
        display_name: displayName,
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        if (isOnboarding) navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      alert('সংরক্ষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setSaving(false);
    }
  };

  const canSave = selClass && selGroup && selBatch;

  return (
    <div className="min-h-screen bg-brand-base px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* ── Onboarding banner ─────────────────────────── */}
        <AnimatePresence>
          {isOnboarding && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl px-5 py-4 flex items-start gap-4"
              style={{ background: 'linear-gradient(135deg,#00C9A7 0%,#00b4d8 100%)' }}
            >
              <Sparkles className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bengali font-bold text-sm text-white">
                  স্বাগতম! প্রোফাইল সেটআপ করুন
                </p>
                <p className="font-bengali text-xs text-white/80 mt-0.5">
                  আপনার শ্রেণি ও বিভাগ নির্বাচন করলে আমরা আপনার জন্য সঠিক কোর্স ও প্রশ্ন সাজাতে পারব।
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Page header ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#6366f1 0%,#a78bfa 100%)' }}
            >
              {profile?.avatar ? (
                <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bengali font-bold text-2xl text-white">
                  {(displayName || profile?.displayName || 'শ')[0]}
                </span>
              )}
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-mint
                         flex items-center justify-center shadow-sm"
            >
              <Camera className="w-3 h-3 text-white" strokeWidth={2.5} />
            </button>
          </div>

          <div>
            <h1 className="font-bengali font-bold text-xl text-brand-charcoal">
              {displayName || profile?.displayName || 'শিক্ষার্থী'}
            </h1>
            <p className="font-bengali text-xs text-brand-muted mt-0.5">
              {profile?.email || user?.email || 'ইমেইল যোগ করুন'}
            </p>
            {profile?.sh_class && (
              <span
                className="inline-block font-bengali text-[10px] font-semibold
                           px-2 py-0.5 rounded-full mt-1"
                style={{ backgroundColor: '#E6FBF7', color: '#00C9A7' }}
              >
                শ্রেণি {profile.sh_class} · {selGroup || profile.sh_group || '—'}
              </span>
            )}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════
            SECTION 1: ব্যক্তিগত তথ্য
        ══════════════════════════════════════════════ */}
        <Section icon={User} iconColor="#6366f1" title="ব্যক্তিগত তথ্য">
          <div>
            <FieldLabel>পূর্ণ নাম</FieldLabel>
            <TextInput
              value={displayName}
              onChange={setDisplayName}
              placeholder="আপনার পূর্ণ নাম লিখুন"
            />
          </div>
          <div>
            <FieldLabel>ইমেইল</FieldLabel>
            <TextInput
              value={profile?.email || user?.email || ''}
              onChange={() => {}}
              placeholder="email@example.com"
              disabled
            />
          </div>
        </Section>

        {/* ══════════════════════════════════════════════
            SECTION 2: একাডেমিক তথ্য — 3-tier filter
        ══════════════════════════════════════════════ */}
        <Section icon={GraduationCap} iconColor="#00C9A7" title="একাডেমিক তথ্য">

          {/* Tier 1: Class */}
          <div>
            <FieldLabel>শ্রেণি (Tier 1)</FieldLabel>
            <PillGroup
              options={CLASS_OPTIONS}
              selected={selClass}
              onSelect={handleClassChange}
            />
          </div>

          {/* Tier 2: Group — shown only after class is selected */}
          <AnimatePresence>
            {selClass && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FieldLabel>বিভাগ (Tier 2)</FieldLabel>
                <PillGroup
                  options={groupOptions}
                  selected={selGroup}
                  onSelect={setSelGroup}
                />
                {/* Hard constraint reminder */}
                {selGroup === 'মানবিক' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-bengali text-[11px] text-orange-500 mt-2 flex items-center gap-1"
                  >
                    <span>⚠️</span> মানবিক বিভাগে বিজ্ঞান বিষয় প্রদর্শিত হবে না
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tier 3: Batch — shown only after group is selected */}
          <AnimatePresence>
            {selGroup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FieldLabel>ব্যাচ (Tier 3)</FieldLabel>
                <PillGroup
                  options={BATCH_OPTIONS}
                  selected={selBatch}
                  onSelect={setSelBatch}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* ══════════════════════════════════════════════
            SECTION 3: জীবনের লক্ষ্য
        ══════════════════════════════════════════════ */}
        <Section icon={Target} iconColor="#f59e0b" title="আমার জীবনের লক্ষ্য">

          {/* Optional subject */}
          <div>
            <FieldLabel>ঐচ্ছিক বিষয় (4th Paper)</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {OPTIONAL_SUBJECTS.map(sub => {
                const active = selOptional === sub.id;
                return (
                  <motion.button
                    key={sub.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelOptional(active ? null : sub.id)}
                    className="px-3 py-2 rounded-xl font-bengali text-xs font-medium
                               transition-all duration-150 flex items-center gap-1.5"
                    style={{
                      backgroundColor: active ? '#00C9A7' : '#F4F7FB',
                      color:           active ? '#ffffff' : '#64748b',
                    }}
                  >
                    <span>{sub.icon}</span>
                    {sub.label}
                    {active && <Check className="w-3 h-3" strokeWidth={3} />}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Life goal */}
          <div>
            <FieldLabel>জীবনের লক্ষ্য</FieldLabel>
            <div className="flex flex-wrap gap-2 mb-3">
              {GOAL_OPTIONS.map(g => {
                const active = selGoal === g;
                return (
                  <button
                    key={g}
                    onClick={() => setSelGoal(active ? '' : g)}
                    className="px-3 py-2 rounded-xl font-bengali text-xs font-medium
                               transition-all duration-150"
                    style={{
                      backgroundColor: active ? '#1F1F1F' : '#F4F7FB',
                      color:           active ? '#ffffff' : '#64748b',
                    }}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
            <textarea
              placeholder="নিজের ভাষায় লক্ষ্য লিখুন..."
              rows={3}
              value={selGoal}
              onChange={e => setSelGoal(e.target.value)}
              className="w-full px-4 py-3 bg-brand-base border border-gray-100 rounded-xl
                         font-bengali text-sm text-brand-charcoal placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-brand-mint/30
                         focus:border-brand-mint resize-none transition-all duration-150"
            />
          </div>
        </Section>

        {/* ── Save button ────────────────────────────────── */}
        <motion.button
          onClick={handleSave}
          disabled={saving || !canSave}
          whileHover={canSave && !saving ? { y: -2 } : {}}
          whileTap={canSave && !saving ? { scale: 0.98 } : {}}
          className="w-full py-3.5 rounded-2xl font-bengali font-bold text-sm
                     flex items-center justify-center gap-2 transition-all duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: saved
              ? 'linear-gradient(135deg,#10b981,#059669)'
              : 'linear-gradient(135deg,#00C9A7,#00b4d8)',
            color: '#ffffff',
            boxShadow: canSave && !saving
              ? '0 4px 16px rgba(0,201,167,0.35)'
              : 'none',
          }}
        >
          <AnimatePresence mode="wait">
            {saving ? (
              <motion.div
                key="saving"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                />
                সংরক্ষণ হচ্ছে...
              </motion.div>
            ) : saved ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" strokeWidth={3} /> সংরক্ষিত হয়েছে!
              </motion.div>
            ) : (
              <motion.div
                key="save"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> প্রোফাইল সংরক্ষণ করুন
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {!canSave && (
          <p className="font-bengali text-xs text-center text-brand-muted -mt-2">
            সংরক্ষণ করতে শ্রেণি, বিভাগ ও ব্যাচ নির্বাচন করুন
          </p>
        )}

        {/* ── Settings rows ──────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-card px-4 py-2">
          <SettingsRow
            icon={Bell}      iconColor="#6366f1"
            label="নোটিফিকেশন সেটিংস"
            onClick={() => {}}
          />
          <SettingsRow
            icon={Shield}    iconColor="#00C9A7"
            label="পাসওয়ার্ড পরিবর্তন"
            onClick={() => {}}
          />
          <SettingsRow
            icon={HelpCircle} iconColor="#f59e0b"
            label="সহায়তা ও যোগাযোগ"
            onClick={() => {}}
          />
          <SettingsRow
            icon={LogOut}
            label="লগ আউট"
            danger
            onClick={() => { logout(); navigate('/login', { replace: true }); }}
          />
        </div>

        {/* Version */}
        <p className="font-data text-[10px] text-center text-gray-300 pb-2">
          শুদ্ধশিক্ষা v1.0.0 — Made with ❤️ in Bangladesh
        </p>

        {/* Bottom pad mobile */}
        <div className="h-4 lg:h-0" />
      </div>
    </div>
  );
}
