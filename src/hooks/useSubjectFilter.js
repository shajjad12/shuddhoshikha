/**
 * useSubjectFilter — Triple-Layer Subject Filter
 * Layer 1: Always show Compulsory subjects (Bangla, English, Math, ICT)
 * Layer 2: Group-conditional subjects (Science / Humanities / Commerce)
 * Layer 3: Optional subject from profile (sh_optional)
 *
 * Hard constraint: Humanities students NEVER see Science subjects.
 */
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

/* ── Master subject registry ─────────────────────────────── */
export const SUBJECTS = {
  /* Compulsory — always shown */
  compulsory: [
    { id: 'bangla',   label: 'বাংলা',       icon: '📖', slug: 'bangla'   },
    { id: 'english',  label: 'English',      icon: '🔤', slug: 'english'  },
    { id: 'math',     label: 'গণিত',         icon: '📐', slug: 'math'     },
    { id: 'ict',      label: 'তথ্য ও যোগাযোগ প্রযুক্তি', icon: '💻', slug: 'ict' },
  ],

  /* Science group */
  science: [
    { id: 'physics',   label: 'পদার্থবিজ্ঞান', icon: '⚛️',  slug: 'physics'   },
    { id: 'chemistry', label: 'রসায়ন',          icon: '🧪',  slug: 'chemistry' },
    { id: 'biology',   label: 'জীববিজ্ঞান',     icon: '🌿',  slug: 'biology'   },
    { id: 'hmath',     label: 'উচ্চতর গণিত',    icon: '📊',  slug: 'higher-math' },
  ],

  /* Humanities group */
  humanities: [
    { id: 'history',    label: 'ইতিহাস',           icon: '🏛️', slug: 'history'    },
    { id: 'civics',     label: 'পৌরনীতি',          icon: '⚖️', slug: 'civics'     },
    { id: 'economics',  label: 'অর্থনীতি',         icon: '📈', slug: 'economics'  },
    { id: 'geography',  label: 'ভূগোল',            icon: '🌍', slug: 'geography'  },
  ],

  /* Commerce group */
  commerce: [
    { id: 'accounting', label: 'হিসাববিজ্ঞান',    icon: '🧾', slug: 'accounting' },
    { id: 'finance',    label: 'ফিন্যান্স',         icon: '💰', slug: 'finance'    },
    { id: 'business',   label: 'ব্যবসায় উদ্যোগ',  icon: '🏢', slug: 'business'   },
  ],

  /* Optional subjects (4th paper) */
  optional: {
    agriculture:  { id: 'agriculture', label: 'কৃষি শিক্ষা',     icon: '🌾', slug: 'agriculture'  },
    religion_i:   { id: 'religion_i',  label: 'ইসলাম শিক্ষা',    icon: '☪️', slug: 'islam-ed'     },
    home_science: { id: 'home_science',label: 'গার্হস্থ্য বিজ্ঞান',icon: '🏠', slug: 'home-science' },
    fine_arts:    { id: 'fine_arts',   label: 'চারু ও কারুকলা',  icon: '🎨', slug: 'fine-arts'    },
    music:        { id: 'music',       label: 'সংগীত',            icon: '🎵', slug: 'music'        },
    physical_ed:  { id: 'physical_ed', label: 'শারীরিক শিক্ষা',  icon: '🏃', slug: 'physical-ed'  },
  },
};

/* ── Group → subject pool map ────────────────────────────── */
const GROUP_MAP = {
  science:    SUBJECTS.science,
  humanities: SUBJECTS.humanities,
  commerce:   SUBJECTS.commerce,
};

/* ── Hook ────────────────────────────────────────────────── */
export const useSubjectFilter = () => {
  const { profile } = useAuth();

  const filteredSubjects = useMemo(() => {
    const group    = profile?.sh_group?.toLowerCase()    || null;
    const optional = profile?.sh_optional?.toLowerCase() || null;

    /* Layer 1 — Compulsory */
    const base = [...SUBJECTS.compulsory];

    /* Layer 2 — Group subjects (hard constraint enforced by map) */
    if (group && GROUP_MAP[group]) {
      base.push(...GROUP_MAP[group]);
    }

    /* Layer 3 — Optional subject */
    if (optional && SUBJECTS.optional[optional]) {
      base.push(SUBJECTS.optional[optional]);
    }

    return base;
  }, [profile?.sh_group, profile?.sh_optional]);

  /* Fallback to compulsory if filter returns nothing meaningful */
  const subjects = filteredSubjects.length >= 2
    ? filteredSubjects
    : SUBJECTS.compulsory;

  const isEmpty = subjects.length === 0;

  return { subjects, isEmpty };
};
